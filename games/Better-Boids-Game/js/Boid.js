import { Physics } from "../../Shared-Game-Assets/js/physics.js";
import { Vec2 } from "../../Shared-Game-Assets/js/vector.js";
import { more_math } from "../../Shared-Game-Assets/js/more_math.js";
import { BoidFactors } from "./boid-utils.js";

export class Boid {
  constructor(scene, color, spawnX, spawnY) {
    // Store some attributes about this boid
    this.scene = scene;
    this.color = color;
    this.mainBoid = false;
    this.mainBoidActivated = false;

    // Create a graphics object for the boid
    this.graphic = null;
    this.initBoid();
    this.velocity = this.initVelocity();

    // Init at provided location, and centered
    this.graphic.x = spawnX - this.size / 2;
    this.graphic.y = spawnY - this.size / 2;

    // Subscribe to relevant events
    this.subscribeToEvents();
  }

  initBoid() {
    this.size = this.calculateBoidSize();

    // Clear existing graphic if it is not null
    if (this.graphic) {
      this.graphic.clear();
    }

    // Spawn in graphic of size provided, and center the graphic on itself
    this.graphic = this.scene.add.graphics();
    this.graphic.fillStyle(this.color, 1);
    this.graphic.fillRect(
      (-1 * this.size) / 2,
      (-1 * this.size) / 2,
      this.size,
      this.size
    );
  }

  subscribeToEvents() {
    // Ensure that the boid updates its own speed when the speed value changes
    document.addEventListener("onSpeedChange", (event) => {
      this.updateBoidSpeed();
    });

    // Leader is activated if pointer is down (aka player is clicking) on the canvas
    document.addEventListener("pointerdown", (event) => {
      this.mainBoidActivated = true;
    });

    document.addEventListener("pointerup", () => {
      this.mainBoidActivated = false;
    });
  }

  calculateBoidSize() {
    // Calculate the boid size based on the screen width
    const screenWidth = window.innerWidth;
    const boidSize = screenWidth * 0.01;

    return boidSize;
  }

  handleWindowResize(new_x, new_y) {
    // Reinitialize the boid and its graphic on resize
    this.initBoid();

    this.graphic.x = new_x - this.size / 2;
    this.graphic.y = new_y - this.size / 2;
  }

  initVelocity() {
    // Set velocity in a random direction
    let velocity_desired = new Vec2(
      more_math.getRandomFloat(0.1, 1),
      more_math.getRandomFloat(0.1, 1)
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

  // makes this boid directly follow the pointer on the screen
  makeFollowPointer() {
    // This makes this boid become the "main boid"
    this.mainBoid = true;

    this.scene.input.on("pointermove", (pointer) => {
      this.graphic.x = pointer.worldX;
      this.graphic.y = pointer.worldY;
    });
  }

  // Physics for boid
  handlePhysics(boids) {
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
    let neighborsCount = 0;

    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;

    let followLeader = false;
    let leader_pos = new Vec2(0, 0);

    // Loop through all other boids in the scene
    for (let otherBoid of boids) {
      if (otherBoid !== this) {
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

        // Update boid flock measurements if otherBoid is within search radius
        if (
          distanceSquared <
          BoidFactors.flockSearchRadius * BoidFactors.flockSearchRadius
        ) {
          let distance = Math.sqrt(distanceSquared);
          if (distance > 0) {
            neighborsCount++;

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

        // If otherBoid is the main boid and the main boid is activated, follow the leader if within leader follow radius!
        if (otherBoid.mainBoid == true && otherBoid.mainBoidActivated) {
          if (
            distanceSquared <
            BoidFactors.leaderFollowRadius * BoidFactors.leaderFollowRadius
          ) {
            followLeader = true;
            leader_pos = new Vec2(otherBoid.graphic.x, otherBoid.graphic.y);
          }
        }
      }
    }

    // Calculate and update the new velocity based on the rules
    let desired_velocity = new Vec2(0, 0);
    if (neighborsCount > 0) {
      // Alignment: Steer toward average neighboring boid heading (aka velocity)
      let avg_veloc = new Vec2(0, 0);
      avg_veloc = new Vec2(
        veloc_sum.x / neighborsCount,
        veloc_sum.y / neighborsCount
      );
      desired_velocity.x +=
        (avg_veloc.x - this.velocity.x) * BoidFactors.alignmentFactor;
      desired_velocity.y +=
        (avg_veloc.y - this.velocity.y) * BoidFactors.alignmentFactor;

      // Cohesion: Steer toward average neighboring boid position (aka center of mass)
      let avg_pos = new Vec2(0, 0);
      avg_pos = new Vec2(
        pos_sum.x / neighborsCount,
        pos_sum.y / neighborsCount
      );
      desired_velocity.x +=
        (avg_pos.x - this.graphic.x) * BoidFactors.cohesionFactor;
      desired_velocity.y +=
        (avg_pos.y - this.graphic.y) * BoidFactors.cohesionFactor;

      // Separation: boids steer away from boids within their boidProtectedRadius
      desired_velocity.x += separation.x * BoidFactors.separationFactor;
      desired_velocity.y += separation.y * BoidFactors.separationFactor;

      // Follow the leader if told to do so!
      if (followLeader) {
        desired_velocity.x +=
          (leader_pos.x - this.graphic.x) * BoidFactors.leaderFollowFactor;
        desired_velocity.y +=
          (leader_pos.y - this.graphic.y) * BoidFactors.leaderFollowFactor;
      }
    } else {
      desired_velocity = this.velocity;
    }

    // Cleanup veloc so we dont exceed speed limit
    desired_velocity = this.clampVelocity(desired_velocity);

    return desired_velocity;
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
      if (otherBoid !== this) {
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
