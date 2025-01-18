import { GameObject } from "/games/Shared-Game-Assets/js/game-object.js";
import { Physics } from "../../Shared-Game-Assets/js/physics.js";
import { Vec2 } from "../../Shared-Game-Assets/js/vector.js";
import { more_math } from "../../Shared-Game-Assets/js/more-math.js";
import { BoidFactors, boidEventNames } from "./boid-utils.js";
import { SeededRandom } from "../../Shared-Game-Assets/js/seedable-random.js";

const seededRandom = new SeededRandom(1234);

export class Boid extends GameObject {
  constructor(scene, spawnX, spawnY, leaderBoid, boidNumber) {
    // Set some properties on the parent GameObject class
    super(
      "Boid",
      // init size just so its set, will reset to something else later
      new Vec2(1, 1),
      // Add physicsBody2D
      true,
      // Add rigidBody2D
      true
    );

    this.scene = scene;
    this.mainBoid = leaderBoid;
    this.boidNumber = boidNumber;

    this.initBoidType();
    this.physicsBody2D.velocity = this.initVelocity();

    // Create a graphics object for the boid
    this.graphic = null;
    this.initBoid();

    // Init at provided location, and centered
    this.physicsBody2D.position.x = spawnX;
    this.physicsBody2D.position.y = spawnY;

    // Leader is disabled to start
    if (this.mainBoid == true) {
      this.disable();
    } else {
      this.enable();
    }

    // Subscribe to relevant events
    this.subscribeToEvents();
  }

  initBoid() {
    this.updateBoidSize();

    // Init the graphics
    let boidAnimName = "";
    if (this.boid_type == "Good") {
      boidAnimName = "Good Boid Anim";
    } else if (this.boid_type == "Bad") {
      boidAnimName = "Bad Boid Anim";
    } else {
      boidAnimName = "Leader Boid Anim";
    }

    this.graphic = this.scene.add.sprite(0, 0, boidAnimName); // spawn at 0,0 to start
    this.graphic.setOrigin(0.5, 0.5); // Set the anchor point to the center

    // Define an animation for the sprite
    this.graphic.anims.create({
      key: "boidAnimation",
      frames: this.graphic.anims.generateFrameNumbers(boidAnimName, {
        start: 0,
        end: -1,
      }), // -1 to use all frames
      frameRate: 6, // Adjust frame rate as needed
      repeat: -1, // Repeat indefinitely
    });
    this.graphic.anims.play("boidAnimation");
  }

  initBoidType() {
    if (this.mainBoid == true) {
      this.boid_type = "Leader";
    } else {
      if (seededRandom.getRandomFloat(0, 1) < 0.8) {
        this.boid_type = "Good";
      } else {
        this.boid_type = "Bad";
      }
    }
  }

  subscribeToEvents() {
    // Ensure that the boid updates its own speed when the speed value changes
    document.addEventListener(
      boidEventNames.onSpeedChange,
      function (event) {
        this.updateBoidSpeed();
      }.bind(this)
    );

    // Leader boid movement etc.
    if (this.mainBoid) {
      // Follow pointer
      this.scene.input.on("pointerdown", (pointer) => {
        this.physicsBody2D.position.x = pointer.worldX;
        this.physicsBody2D.position.y = pointer.worldY;
      });
      this.scene.input.on("pointermove", (pointer) => {
        this.physicsBody2D.position.x = pointer.worldX;
        this.physicsBody2D.position.y = pointer.worldY;
      });

      // Hide / reveal leader on pointer up / down
      document.addEventListener(
        boidEventNames.pointerholdclick,
        function () {
          // Enable leader boid if ui menu is closed
          if (!this.scene.uiMenuOpen) {
            // can only enable if leader is toggled on
            if (BoidFactors.leaderBoidEnabled == true) {
              this.enable();
            }
          }
        }.bind(this),
        { capture: true }
      );

      document.addEventListener(
        "pointerup",
        function () {
          this.disable();
        }.bind(this),
        { capture: true }
      );
    }
  }

  calculateBoidSize() {
    // Calculate the boid size based on the screen width
    let boidSize = window.innerHeight * 0.15;
    let isPortrait = window.matchMedia("(orientation: portrait)").matches;

    // Phone screen has larger boids
    if (window.innerWidth <= 600 || isPortrait) {
      boidSize = window.innerHeight * 0.1;
    }

    return boidSize;
  }

  handleWindowResize(new_x, new_y) {
    // Reinitialize the boid and its graphic on resize
    this.updateBoidSize();

    this.physicsBody2D.position.x = new_x;
    this.physicsBody2D.position.y = new_y;
  }

  initVelocity() {
    // Set velocity in a random direction
    let velocity_desired = new Vec2(
      seededRandom.getRandomFloat(0.1, 1),
      seededRandom.getRandomFloat(0.1, 1)
    );

    velocity_desired = this.clampVelocity(velocity_desired);
    return velocity_desired;
  }

  updateBoidSize() {
    this.size = this.calculateBoidSize();
    this.rigidBody2D.hitboxSize = this.size;
  }

  updateBoidSpeed() {
    // Update's boid speed (mostly used so that when the "speed" value is changed by the slider, each boid can adjust their velocity to be
    // capped at the new speed)
    this.physicsBody2D.velocity = this.clampVelocity(
      this.physicsBody2D.velocity
    );
  }

  clampVelocity(velocity_desired) {
    // Cleans up velocity such if the provided value is not within min and max speed,
    // it is normalized and then set in magnitude to the speed limit it is at.
    let normalized_veloc = Vec2.normalize(velocity_desired);
    if (Vec2.magnitude(velocity_desired) > BoidFactors.speed) {
      velocity_desired = Vec2.scale(normalized_veloc, BoidFactors.speed);
    }
    // Min speed is defined at 10% max speed
    else if (Vec2.magnitude(velocity_desired) < BoidFactors.speed * 0.1) {
      velocity_desired = Vec2.scale(normalized_veloc, BoidFactors.speed * 0.1);
    }

    return velocity_desired;
  }

  // Physics for boid
  handlePhysics(boids) {
    // Skip physics calculation if the boid is disabled
    if (this.disabled) {
      return;
    }

    if (!this.mainBoid) {
      // Boid Behavior
      let desired_velocity = this.handleBoidFlocking(boids);

      // Handle collisions
      this.rigidBody2D.checkCollideScreenEdge();

      // Lerp toward desired velocity
      let lerpFactor = 0.1;
      this.physicsBody2D.velocity.x = more_math.lerp(
        this.physicsBody2D.velocity.x,
        desired_velocity.x,
        lerpFactor
      );
      this.physicsBody2D.velocity.y = more_math.lerp(
        this.physicsBody2D.velocity.y,
        desired_velocity.y,
        lerpFactor
      );

      // We can lerp, but never exceed speed limits
      this.physicsBody2D.velocity = this.clampVelocity(
        this.physicsBody2D.velocity
      );

      // Position update
      this.physicsBody2D.updatePosition();
    }
  }

  handleBoidFlocking(boids) {
    // Initialize variables to compute the new velocity based on boid rules
    let veloc_sum = new Vec2(0, 0);
    let pos_sum = new Vec2(0, 0);
    let separation = new Vec2(0, 0); // how far apart all boids are on avg (try to stay a certain distance apart)
    let opposing_pos_sum = new Vec2(0, 0); // avg pos of opposing neighbors
    let similarNeighborsCount = 0;
    let opposingNeighborsCount = 0;

    let followLeader = false;
    let leader_pos = new Vec2(0, 0);

    // Loop through all other boids in the scene
    for (let otherBoid of boids) {
      if (otherBoid !== this && !otherBoid.disabled) {
        // Get distance attrs between this and other boid
        let distObj = this.getBoidDistance(otherBoid);
        let dx = distObj.dx;
        let dy = distObj.dy;
        let distanceSquared = distObj.distanceSquared;

        // If otherBoid is the main boid and the player is interacting (aka pointer is down), have this boid follow the leader if within leader follow radius!
        if (
          otherBoid.mainBoid == true &&
          this.scene.isInteracting &&
          !this.scene.uiMenuOpen
        ) {
          if (
            distanceSquared <
            BoidFactors.leaderFollowRadius * BoidFactors.leaderFollowRadius
          ) {
            followLeader = true;
            leader_pos = new Vec2(
              otherBoid.physicsBody2D.position.x,
              otherBoid.physicsBody2D.position.y
            );
          }
        }

        // If other boid is the same type as this boid, use regular boid logic!
        else if (this.boid_type == otherBoid.boid_type) {
          // Update boid flock measurements if otherBoid is within search radius
          if (
            distanceSquared <
            BoidFactors.flockSearchRadius * BoidFactors.flockSearchRadius
          ) {
            let distance = Math.sqrt(distanceSquared);
            if (distance > 0) {
              similarNeighborsCount++;

              // Total up avg veloc and position for neighboring boids
              veloc_sum = Vec2.add(veloc_sum, otherBoid.physicsBody2D.velocity);
              pos_sum = Vec2.add(
                pos_sum,
                new Vec2(
                  otherBoid.physicsBody2D.position.x,
                  otherBoid.physicsBody2D.position.y
                )
              );

              // If any boids are within the protected radius of a boid, steer away from them
              if (distance < BoidFactors.boidProtectedRadius) {
                // By doing 0 - distance, this allows us to have this boid move away from other boid
                separation = Vec2.add(
                  separation,
                  Vec2.subtract(new Vec2(0, 0), new Vec2(dx, dy))
                );
              }
            }
          }
        }

        // if boid types conflict, have good boid run from bad boid and bad boid chase good boid!
        // Take avg position of opposing neighbors, and then either go toward or away from that based on boid type.
        else if (this.boid_type != otherBoid.boid_type) {
          if (
            distanceSquared <
            BoidFactors.flockSearchRadius * BoidFactors.flockSearchRadius
          ) {
            opposingNeighborsCount += 1;
            opposing_pos_sum = Vec2.add(
              opposing_pos_sum,
              new Vec2(
                otherBoid.physicsBody2D.position.x,
                otherBoid.physicsBody2D.position.y
              )
            );
          }
        }
      }
    }

    // Calculate and update the new velocity based on the rules.
    // Using Object.assign({}, this.physicsBody2D.velocity); makes desired_velocity a copy of
    // this.physicsBody2D.velocity instead of pointing to the same loc in memory
    let desired_velocity = Object.assign({}, this.physicsBody2D.velocity);

    // Follow the alignment, cohesion, and separation rules for similar (same boid_type) neighbors
    if (similarNeighborsCount > 0) {
      // Alignment: Steer toward average neighboring boid heading (aka velocity)
      let avg_veloc = new Vec2(0, 0);
      avg_veloc = new Vec2(
        veloc_sum.x / similarNeighborsCount,
        veloc_sum.y / similarNeighborsCount
      );
      desired_velocity.x +=
        (avg_veloc.x - this.physicsBody2D.velocity.x) *
        BoidFactors.alignmentFactor;
      desired_velocity.y +=
        (avg_veloc.y - this.physicsBody2D.velocity.y) *
        BoidFactors.alignmentFactor;

      // Cohesion: Steer toward average neighboring boid position (aka center of mass)
      let avg_pos = new Vec2(0, 0);
      avg_pos = new Vec2(
        pos_sum.x / similarNeighborsCount,
        pos_sum.y / similarNeighborsCount
      );

      let directionObj = this.getMovementDirectionVectorThroughTorus(
        this.physicsBody2D.position,
        avg_pos
      );
      desired_velocity.x +=
        Math.abs(avg_pos.x - this.physicsBody2D.position.x) *
        directionObj.direction_x *
        BoidFactors.cohesionFactor;
      desired_velocity.y +=
        Math.abs(avg_pos.y - this.physicsBody2D.position.y) *
        directionObj.direction_y *
        BoidFactors.cohesionFactor;

      // Separation: boids steer away from boids within their boidProtectedRadius
      desired_velocity.x += separation.x * BoidFactors.separationFactor;
      desired_velocity.y += separation.y * BoidFactors.separationFactor;
    }

    // Follow the leader if told to do so!
    if (followLeader) {
      // Follow Leader
      let directionObj = this.getMovementDirectionVectorThroughTorus(
        this.physicsBody2D.position,
        leader_pos
      );
      desired_velocity.x +=
        Math.abs(leader_pos.x - this.physicsBody2D.position.x) *
        directionObj.direction_x *
        BoidFactors.leaderFollowFactor;
      desired_velocity.y +=
        Math.abs(leader_pos.y - this.physicsBody2D.position.y) *
        directionObj.direction_y *
        BoidFactors.leaderFollowFactor;
    }

    // Perform opposing boid velocity updates
    if (opposingNeighborsCount > 0) {
      // Predator-prey: Steer toward average opposing boid position (aka center of mass) if predator (bad boid), and run away from this if prey (good boid)
      let opposing_avg_pos = new Vec2(0, 0);
      opposing_avg_pos = new Vec2(
        opposing_pos_sum.x / opposingNeighborsCount,
        opposing_pos_sum.y / opposingNeighborsCount
      );

      let directionObj = this.getMovementDirectionVectorThroughTorus(
        this.physicsBody2D.position,
        opposing_avg_pos
      );

      // Bad boid chases
      if (this.boid_type == "Bad") {
        desired_velocity.x +=
          Math.abs(opposing_avg_pos.x - this.physicsBody2D.position.x) *
          directionObj.direction_x *
          BoidFactors.predatorPreyFactor;
        desired_velocity.y +=
          Math.abs(opposing_avg_pos.y - this.physicsBody2D.position.y) *
          directionObj.direction_y *
          BoidFactors.predatorPreyFactor;
      }
      // good boid runs away
      else if (this.boid_type == "Good") {
        desired_velocity.x +=
          -1 *
          Math.abs(opposing_avg_pos.x - this.physicsBody2D.position.x) *
          directionObj.direction_x *
          BoidFactors.predatorPreyFactor;
        desired_velocity.y +=
          -1 *
          Math.abs(opposing_avg_pos.y - this.physicsBody2D.position.y) *
          directionObj.direction_y *
          BoidFactors.predatorPreyFactor;
      }
    }

    // Cleanup veloc so we dont exceed speed limit
    desired_velocity = this.clampVelocity(desired_velocity);

    return desired_velocity;
  }

  getBoidDistance(otherBoid) {
    // Calculate distance between this boid and the other
    let dx = otherBoid.physicsBody2D.position.x - this.physicsBody2D.position.x;
    let dy = otherBoid.physicsBody2D.position.y - this.physicsBody2D.position.y;

    // Because boids can overflow to the other side of the screen, we need to check the
    // "torus" distance as well to see if the boids are closer in that direction.
    // To do so, we can assume the shorter route from one boid to another is through the edge of a screen if
    // their distance in a given direction (x or y) is greater than half the respective size of the screen.
    if (Math.abs(dx) > window.innerWidth / 2) {
      // If "other" is to the right of "this", then we subtract screen width since
      // in the land of "torus" geometry "other" is really to the left of "this" in their closest distance
      if (dx > 0) {
        dx -= window.innerWidth;
      } else {
        dx += window.innerWidth;
      }
    }
    if (Math.abs(dy) > window.innerHeight / 2) {
      // If "other" is above "this", then we subtract screen height since
      // in the land of "torus" geometry "other" is really below "this" in their closest distance
      if (dy > 0) {
        dy -= window.innerHeight;
      } else {
        dy += window.innerHeight;
      }
    }

    let distanceSquared = dx * dx + dy * dy;

    return {
      dx: dx,
      dy: dy,
      distanceSquared: distanceSquared,
    };
  }

  getMovementDirectionVectorThroughTorus(pos_a, pos_b) {
    // Get the movement direction vector to go from point a to point b
    // taking into account the fact that boids live on a torus, so sometimes
    // the best (shortest) way to go is through the side of the screen

    // Calculate initial direction from a to b the normal way (not considering torus)
    let dx = pos_b.x - pos_a.x;
    let dy = pos_b.y - pos_a.y;

    // Because boids can overflow to the other side of the screen, we need to check the
    // "torus" distance to see if the boids are closer in that direction.
    // To do so, we can assume the shorter route from one boid to another is through the edge of a screen if
    // their distance in a given direction (x or y) is greater than half the respective size of the screen.
    if (Math.abs(dx) > window.innerWidth / 2) {
      // If pos_b is to the right of pos_a in this case, then we subtract screen width since
      // in the land of "torus" geometry pos_b is really to the left of pos_a in their closest distance through the edge
      if (dx > 0) {
        dx -= window.innerWidth;
      } else {
        dx += window.innerWidth;
      }
    }
    if (Math.abs(dy) > window.innerHeight / 2) {
      // If pos_b is above of pos_a in this case, then we subtract screen height since
      // in the land of "torus" geometry pos_b is really to the below of pos_a in their closest distance through the edge
      if (dy > 0) {
        dy -= window.innerHeight;
      } else {
        dy += window.innerHeight;
      }
    }

    return {
      direction_x: Math.sign(dx),
      direction_y: Math.sign(dy),
    };
  }

  onCollideScreenEdge(collisionDirection = null) {
    const edgeMargin = 1;
    // If left, teleport to right side of screen
    if (collisionDirection === "left") {
      this.physicsBody2D.position.x =
        window.innerWidth - edgeMargin - this.size / 2;
    }
    // If right, teleport to left side of screen
    else if (collisionDirection === "right") {
      this.physicsBody2D.position.x = edgeMargin + this.size / 2;
    }
    // If top, move to bottom
    else if (collisionDirection === "top") {
      this.physicsBody2D.position.y =
        window.innerHeight - edgeMargin - this.size / 2;
    }
    // If bottom, move to top
    else if (collisionDirection === "bottom") {
      this.physicsBody2D.position.y = edgeMargin + this.size / 2;
    }
  }
}
