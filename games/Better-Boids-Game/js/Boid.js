/**
 * @module Boid
 *
 * @author Shane Bonkowski
 */

import { Physics } from "../../Shared-Game-Assets/js/physics.js";
import { Vec2 } from "../../Shared-Game-Assets/js/vector.js";
import { more_math } from "../../Shared-Game-Assets/js/more_math.js";
import { BoidFactors } from "./boid-utils.js";
import { SeededRandom } from "../../Shared-Game-Assets/js/Seedable_Random.js";

const seed = 1234;
const seededRandom = new SeededRandom(seed);

export class Boid {
  constructor(scene, spawnX, spawnY, leaderBoid, boidNumber) {
    // Store some attributes about this boid

    this.scene = scene;
    this.mainBoid = leaderBoid;
    this.boidNumber = boidNumber;

    // Leader is disabled to start
    if (this.mainBoid == true) {
      this.disabled = true;
    } else {
      this.disabled = false;
    }

    this.initBoidType();
    this.velocity = this.initVelocity();

    // Create a graphics object for the boid
    this.graphic = null;
    this.initBoid();

    // Init at provided location, and centered
    this.graphic.x = spawnX;
    this.graphic.y = spawnY;

    // Subscribe to relevant events
    this.subscribeToEvents();
  }

  initBoid() {
    this.size = this.calculateBoidSize();

    let boidAnimName = "";
    // Spawn in graphic of size provided, and center the graphic on itself
    if (this.boid_type == "Good") {
      boidAnimName = "Good Boid Anim";
    } else if (this.boid_type == "Bad") {
      boidAnimName = "Bad Boid Anim";
    } else {
      boidAnimName = "Leader Boid Anim";
    }

    this.graphic = this.scene.add.sprite(0, 0, boidAnimName); // spawn at 0,0 to start

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

    // Play the animation
    this.graphic.anims.play("boidAnimation");

    // Set the scale and origin
    this.graphic.setScale(this.size);
    this.graphic.setOrigin(0.5, 0.5); // Set the anchor point to the center

    // If disabled, hide. If not disabled, reveal
    this.graphic.setVisible(!this.disabled);
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
      "onSpeedChange",
      function (event) {
        this.updateBoidSpeed();
      }.bind(this)
    );

    // Leader boid movement etc.
    if (this.mainBoid) {
      // Follow pointer
      this.scene.input.on("pointerdown", (pointer) => {
        this.graphic.x = pointer.worldX;
        this.graphic.y = pointer.worldY;
      });
      this.scene.input.on("pointermove", (pointer) => {
        this.graphic.x = pointer.worldX;
        this.graphic.y = pointer.worldY;
      });

      // Hide / reveal leader on pointer up / down
      document.addEventListener(
        "pointerholdclick",
        function () {
          // Enable leader boid if ui menu is closed
          if (!this.scene.uiMenuOpen) {
            this.enable();
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

  // Method to disable the boid
  disable() {
    this.disabled = true;
    this.graphic.setVisible(false);
  }

  // Method to enable the boid
  enable() {
    // can only enable if leader is toggled on
    if (BoidFactors.leaderBoidEnabled == true) {
      this.disabled = false;
      this.graphic.setVisible(true);
    }
  }

  calculateBoidSize() {
    // Calculate the boid size based on the screen width
    var screenWidth = window.innerWidth;
    var boidSize = screenWidth * 0.00009 * 3;

    // Phone screen has larger boids
    if (screenWidth <= 600) {
      boidSize = screenWidth * 0.00026 * 3;
    }

    return boidSize;
  }

  handleWindowResize(new_x, new_y) {
    // Reinitialize the boid and its graphic on resize
    this.size = this.calculateBoidSize();
    this.graphic.setScale(this.size);

    this.graphic.x = new_x;
    this.graphic.y = new_y;
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

  updateBoidSpeed() {
    // Update's boid speed (mostly used so that when the "speed" value is changed by the slider, each boid can adjust their velocity to be
    // capped at the new speed)
    this.velocity = this.clampVelocity(this.velocity);
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

    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;

    if (!this.mainBoid) {
      // Boid Behavior
      let desired_velocity = this.handleBoidFlocking(boids);

      // Handle collisions
      desired_velocity = this.handleCollisions(
        boids,
        desired_velocity,
        screenWidth,
        screenHeight
      );

      // Lerp toward desired velocity
      let lerpFactor = 0.1;
      this.velocity.x = more_math.lerp(
        this.velocity.x,
        desired_velocity.x,
        lerpFactor
      );
      this.velocity.y = more_math.lerp(
        this.velocity.y,
        desired_velocity.y,
        lerpFactor
      );

      // We can lerp, but never exceed speed limits
      this.velocity = this.clampVelocity(this.velocity);

      // Position update
      this.graphic.x += this.velocity.x * Physics.physicsUpdateInterval; // x = vx * t
      this.graphic.y += this.velocity.y * Physics.physicsUpdateInterval;
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

    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;

    let followLeader = false;
    let leader_pos = new Vec2(0, 0);

    // Loop through all other boids in the scene
    for (let otherBoid of boids) {
      if (otherBoid !== this && !otherBoid.disabled) {
        // Get distance attrs between this and other boid
        var distObj = this.getBoidDistance(
          otherBoid,
          screenWidth,
          screenHeight
        );
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
            leader_pos = new Vec2(otherBoid.graphic.x, otherBoid.graphic.y);
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
              veloc_sum = Vec2.add(veloc_sum, otherBoid.velocity);
              pos_sum = Vec2.add(
                pos_sum,
                new Vec2(otherBoid.graphic.x, otherBoid.graphic.y)
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
              new Vec2(otherBoid.graphic.x, otherBoid.graphic.y)
            );
          }
        }
      }
    }

    // Calculate and update the new velocity based on the rules.
    // Using Object.assign({}, this.velocity); makes desired_velocity a copy of
    // this.velocity instead of pointing to the same loc in memory
    let desired_velocity = Object.assign({}, this.velocity);

    // Follow the alignment, cohesion, and separation rules for similar (same boid_type) neighbors
    if (similarNeighborsCount > 0) {
      // Alignment: Steer toward average neighboring boid heading (aka velocity)
      let avg_veloc = new Vec2(0, 0);
      avg_veloc = new Vec2(
        veloc_sum.x / similarNeighborsCount,
        veloc_sum.y / similarNeighborsCount
      );
      desired_velocity.x +=
        (avg_veloc.x - this.velocity.x) * BoidFactors.alignmentFactor;
      desired_velocity.y +=
        (avg_veloc.y - this.velocity.y) * BoidFactors.alignmentFactor;

      // Cohesion: Steer toward average neighboring boid position (aka center of mass)
      let avg_pos = new Vec2(0, 0);
      avg_pos = new Vec2(
        pos_sum.x / similarNeighborsCount,
        pos_sum.y / similarNeighborsCount
      );

      var directionObj = this.getMovementDirectionVectorThroughTorus(
        this.graphic,
        avg_pos,
        screenWidth,
        screenHeight
      );
      desired_velocity.x +=
        Math.abs(avg_pos.x - this.graphic.x) *
        directionObj.direction_x *
        BoidFactors.cohesionFactor;
      desired_velocity.y +=
        Math.abs(avg_pos.y - this.graphic.y) *
        directionObj.direction_y *
        BoidFactors.cohesionFactor;

      // Separation: boids steer away from boids within their boidProtectedRadius
      desired_velocity.x += separation.x * BoidFactors.separationFactor;
      desired_velocity.y += separation.y * BoidFactors.separationFactor;
    }

    // Follow the leader if told to do so!
    if (followLeader) {
      // Follow Leader
      directionObj = this.getMovementDirectionVectorThroughTorus(
        this.graphic,
        leader_pos,
        screenWidth,
        screenHeight
      );
      desired_velocity.x +=
        Math.abs(leader_pos.x - this.graphic.x) *
        directionObj.direction_x *
        BoidFactors.leaderFollowFactor;
      desired_velocity.y +=
        Math.abs(leader_pos.y - this.graphic.y) *
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

      directionObj = this.getMovementDirectionVectorThroughTorus(
        this.graphic,
        opposing_avg_pos,
        screenWidth,
        screenHeight
      );

      // Bad boid chases
      if (this.boid_type == "Bad") {
        desired_velocity.x +=
          Math.abs(opposing_avg_pos.x - this.graphic.x) *
          directionObj.direction_x *
          BoidFactors.predatorPreyFactor;
        desired_velocity.y +=
          Math.abs(opposing_avg_pos.y - this.graphic.y) *
          directionObj.direction_y *
          BoidFactors.predatorPreyFactor;
      }
      // good boid runs away
      else if (this.boid_type == "Good") {
        desired_velocity.x +=
          -1 *
          Math.abs(opposing_avg_pos.x - this.graphic.x) *
          directionObj.direction_x *
          BoidFactors.predatorPreyFactor;
        desired_velocity.y +=
          -1 *
          Math.abs(opposing_avg_pos.y - this.graphic.y) *
          directionObj.direction_y *
          BoidFactors.predatorPreyFactor;
      }
    }

    // Cleanup veloc so we dont exceed speed limit
    desired_velocity = this.clampVelocity(desired_velocity);

    return desired_velocity;
  }

  getBoidDistance(otherBoid, screenWidth, screenHeight) {
    // Calculate distance between this boid and the other
    let dx = otherBoid.graphic.x - this.graphic.x;
    let dy = otherBoid.graphic.y - this.graphic.y;

    // Because boids can overflow to the other side of the screen, we need to check the
    // "torus" distance as well to see if the boids are closer in that direction.
    // To do so, we can assume the shorter route from one boid to another is through the edge of a screen if
    // their distance in a given direction (x or y) is greater than half the respective size of the screen.
    if (Math.abs(dx) > screenWidth / 2) {
      // If "other" is to the right of "this", then we subtract screen width since
      // in the land of "torus" geometry "other" is really to the left of "this" in their closest distance
      if (dx > 0) {
        dx -= screenWidth;
      } else {
        dx += screenWidth;
      }
    }
    if (Math.abs(dy) > screenHeight / 2) {
      // If "other" is above "this", then we subtract screen height since
      // in the land of "torus" geometry "other" is really below "this" in their closest distance
      if (dy > 0) {
        dy -= screenHeight;
      } else {
        dy += screenHeight;
      }
    }

    let distanceSquared = dx * dx + dy * dy;

    return {
      dx: dx,
      dy: dy,
      distanceSquared: distanceSquared,
    };
  }

  getMovementDirectionVectorThroughTorus(
    pos_a,
    pos_b,
    screenWidth,
    screenHeight
  ) {
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
    if (Math.abs(dx) > screenWidth / 2) {
      // If pos_b is to the right of pos_a in this case, then we subtract screen width since
      // in the land of "torus" geometry pos_b is really to the left of pos_a in their closest distance through the edge
      if (dx > 0) {
        dx -= screenWidth;
      } else {
        dx += screenWidth;
      }
    }
    if (Math.abs(dy) > screenHeight / 2) {
      // If pos_b is above of pos_a in this case, then we subtract screen height since
      // in the land of "torus" geometry pos_b is really to the below of pos_a in their closest distance through the edge
      if (dy > 0) {
        dy -= screenHeight;
      } else {
        dy += screenHeight;
      }
    }

    return {
      direction_x: Math.sign(dx),
      direction_y: Math.sign(dy),
    };
  }

  handleCollisions(boids, desired_velocity, screenWidth, screenHeight) {
    this.checkCollideScreenEdge(screenWidth, screenHeight);
    // desired_velocity = this.checkCollideWithOtherBoids(boids, desired_velocity);

    return desired_velocity;
  }

  checkCollideScreenEdge(screenWidth, screenHeight) {
    const edgeMargin = 1;
    // Check if the boid is too close to the left or right edge
    if (
      this.graphic.x <= edgeMargin + this.size / 2 ||
      this.graphic.x >= screenWidth - edgeMargin - this.size / 2
    ) {
      // If left, teleport to right side of screen
      if (this.graphic.x <= edgeMargin + this.size / 2) {
        this.graphic.x = screenWidth - edgeMargin - this.size / 2;
      }
      // If right, teleport to left side of screen
      else {
        this.graphic.x = edgeMargin + this.size / 2;
      }
    }

    // Check if the boid is too close to the top or bottom edge
    if (
      this.graphic.y <= edgeMargin + this.size / 2 ||
      this.graphic.y >= screenHeight - edgeMargin - this.size / 2
    ) {
      // If top, move to bottom
      if (this.graphic.y <= edgeMargin + this.size / 2) {
        this.graphic.y = screenHeight - edgeMargin - this.size / 2;
      }
      // If bottom, move to top
      else {
        this.graphic.y = edgeMargin + this.size / 2;
      }
    }
  }

  checkCollideWithOtherBoids(boids, desired_velocity) {
    const boidForceMagnitude = 1;

    // Collisions with other boids
    for (let otherBoid of boids) {
      if (otherBoid !== this && !otherBoid.disabled) {
        let dx = otherBoid.graphic.x - this.graphic.x;
        let dy = otherBoid.graphic.y - this.graphic.y;
        let distanceSquared = dx * dx + dy * dy;

        // Check if there's a collision
        if (
          Physics.checkCircleCollision(
            distanceSquared,
            this.size / 2,
            otherBoid.size / 2
          )
        ) {
          // Calculate the repulsive force (inversely proportional to distance)
          let direction = Vec2.normalize(new Vec2(dx, dy));
          let repulsiveForceMag =
            boidForceMagnitude / Math.sqrt(distanceSquared);
          let repulsiveForce = Vec2.scale(direction, repulsiveForceMag);

          // Adjust velocity so that current boid moves away from boid it collided into (hence why we subtract).
          // Only update current boid's veloc since other boid should be calling this fucntion as well and moving away on its own.
          let desired_velocity = Vec2.subtract(
            desired_velocity,
            repulsiveForce
          );
          desired_velocity = this.clampVelocity(desired_velocity);
        }
      }
    }

    return desired_velocity;
  }
}
