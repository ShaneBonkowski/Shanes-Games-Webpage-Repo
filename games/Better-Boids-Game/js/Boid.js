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

    velocity_desired = this.cleanupVelocity(velocity_desired);
    return velocity_desired;
  }

  updateBoidSpeed() {
    // Update's boid speed (mostly used so that when the "speed" value is changed by the slider, each boid can adjust their velocity to be
    // capped at the new speed)
    this.velocity = this.cleanupVelocity(this.velocity);
  }

  cleanupVelocity(velocity_desired) {
    // Cleans up velocity such the provided value is normalized and then set in magnitude to the speed
    velocity_desired = Vec2.normalize(velocity_desired);
    velocity_desired = Vec2.scale(velocity_desired, BoidFactors.speed);
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
      this.handleBoidFlocking(boids);

      // Handle collisions
      this.handleCollisions(boids, screenWidth, screenHeight);

      // Position update
      this.graphic.x += this.velocity.x * Physics.physicsUpdateInterval; // x = vx * t
      this.graphic.y += this.velocity.y * Physics.physicsUpdateInterval;
    }
  }

  handleBoidFlocking(boids) {
    // Initialize variables to compute the new velocity
    let alignment = new Vec2(0, 0); // how similar all boids veloc are (try to converge to same heading)
    let cohesion = new Vec2(0, 0); // how similar all boids pos are (i.e. try to head toward a center of mass)
    let separation = new Vec2(0, 0); // how far apart all boids are on avg (try to stay a certain distance apart)
    let neighborsCount = 0;

    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;

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

        // Update separation if otherBoid is within separation radius
        if (
          distanceSquared <
          BoidFactors.flockSearchRadius * BoidFactors.flockSearchRadius
        ) {
          let distance = Math.sqrt(distanceSquared);
          if (distance > 0) {
            // Subtract so we move opposite to separate
            separation = Vec2.subtract(separation, new Vec2(dx, dy));
          }
          neighborsCount++;

          // Accumulate alignment and cohesion vectors (add so we go toward these)
          alignment = Vec2.add(
            alignment,
            Vec2.subtract(otherBoid.velocity, this.velocity)
          );
          cohesion = Vec2.add(
            cohesion,
            Vec2.subtract(
              new Vec2(otherBoid.graphic.x, otherBoid.graphic.y),
              new Vec2(this.graphic.x, this.graphic.y)
            )
          );
        }
      }
    }

    if (neighborsCount > 0) {
      // Calculate average alignment and cohesion
      alignment = new Vec2(
        alignment.x / neighborsCount,
        alignment.y / neighborsCount
      );
      cohesion = new Vec2(
        cohesion.x / neighborsCount,
        cohesion.y / neighborsCount
      );

      // Calculate and update the new velocity based on the rules
      let new_velocity = new Vec2(0, 0);
      new_velocity.x +=
        alignment.x * BoidFactors.alignmentFactor +
        cohesion.x * BoidFactors.cohesionFactor +
        separation.x * BoidFactors.separationFactor;
      new_velocity.y +=
        alignment.y * BoidFactors.alignmentFactor +
        cohesion.y * BoidFactors.cohesionFactor +
        separation.y * BoidFactors.separationFactor;
      this.velocity = this.cleanupVelocity(new_velocity);
    }
  }

  handleCollisions(boids, screenWidth, screenHeight) {
    this.checkCollideScreenEdge(screenWidth, screenHeight);
    this.checkCollideWithOtherBoids(boids);
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

  checkCollideWithOtherBoids(boids) {
    const boidForceMagnitude = 1;

    // Collisions with other boids
    for (let otherBoid of boids) {
      if (otherBoid !== this) {
        let dx = otherBoid.graphic.x - this.graphic.x;
        let dy = otherBoid.graphic.y - this.graphic.y;
        let distanceSquared = dx * dx + dy * dy;

        // Check if there's a collision
        if (distanceSquared < (this.size / 2 + otherBoid.size / 2) ** 2) {
          // Calculate the repulsive force (inversely proportional to distance)
          let direction = Vec2.normalize(new Vec2(dx, dy));
          let repulsiveForceMag =
            boidForceMagnitude / Math.sqrt(distanceSquared);
          let repulsiveForce = Vec2.scale(direction, repulsiveForceMag);

          // Adjust velocities of both boids to move away from each other
          let new_velocity = Vec2.subtract(this.velocity, repulsiveForce);
          this.velocity = this.cleanupVelocity(new_velocity);

          new_velocity = Vec2.add(otherBoid.velocity, repulsiveForce);
          otherBoid.velocity = otherBoid.cleanupVelocity(new_velocity);
        }
      }
    }
  }
}
