import { getRandomFloat } from "./boid-utils.js";

export class Boid {
  constructor(scene, size, color, spawnX, spawnY) {
    // Store some attributes about this boid
    this.scene = scene;
    this.size = size;
    this.color = color;
    this.speed = 3;
    this.velocity = {
      x: getRandomFloat(0.1, 0.9) * this.speed,
      y: getRandomFloat(0.1, 0.9) * this.speed,
    };
    this.mainBoid = false;

    // Create a graphics object for the boid
    this.graphic = scene.add.graphics();
    this.graphic.fillStyle(color, 1); // Set the fill color
    this.graphic.fillRect((-1 * size) / 2, (-1 * size) / 2, size, size);

    // Init at provided location, and centered
    this.graphic.x = spawnX - size / 2;
    this.graphic.y = spawnY - size / 2;
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
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    if (this.mainBoid == false) {
      // Boid Behavior
      this.handleBoidFlocking(boids);

      // handle collisions
      this.handleCollisions(boids, screenWidth, screenHeight);

      // Normalize velocity back to regular speed
      const velocityMagnitude = Math.sqrt(
        this.velocity.x ** 2 + this.velocity.y ** 2
      );
      if (velocityMagnitude > 0) {
        this.velocity.x = (this.velocity.x / velocityMagnitude) * this.speed;
        this.velocity.y = (this.velocity.y / velocityMagnitude) * this.speed;
      } else {
        this.velocity.x = 0;
        this.velocity.y = 0;
      }

      // Position update
      this.graphic.x += this.velocity.x;
      this.graphic.y += this.velocity.y;
    }
  }

  handleBoidFlocking(boids) {
    // Define constants for the boids rules
    const alignmentFactor = 1;
    const cohesionFactor = 1;
    const flockSearchRadius = 200;
    const separationFactor = 0.2;

    // Initialize variables to compute the new velocity
    let alignment = { x: 0, y: 0 }; // how similar all boids veloc are (try to converge to same heading)
    let cohesion = { x: 0, y: 0 }; // how similar all boids pos are (i.e. try to head toward a center of mass)
    let separation = { x: 0, y: 0 }; // how far apart all boids are on avg (try to stay a certain distance apart)
    let neighborsCount = 0;

    // Loop through all other boids in the scene
    for (let otherBoid of boids) {
      if (otherBoid !== this) {
        // Calculate distance between this boid and the other
        const dx = otherBoid.graphic.x - this.graphic.x;
        const dy = otherBoid.graphic.y - this.graphic.y;
        const distanceSquared = dx * dx + dy * dy;

        // Update separation if otherBoid is within separation radius
        if (distanceSquared < flockSearchRadius * flockSearchRadius) {
          const distance = Math.sqrt(distanceSquared);
          if (distance > 0) {
            // Subtract so we move oppisite to separate
            separation.x -= dx;
            separation.y -= dy;
          }
          neighborsCount++;

          // Accumulate alignment and cohesion vectors (add so we go toward these)
          alignment.x += otherBoid.velocity.x - this.velocity.x;
          alignment.y += otherBoid.velocity.y - this.velocity.y;
          cohesion.x += otherBoid.graphic.x - this.graphic.x;
          cohesion.y += otherBoid.graphic.y - this.graphic.y;
        }
      }
    }

    if (neighborsCount > 0) {
      // Calculate average alignment and cohesion
      alignment.x /= neighborsCount;
      alignment.y /= neighborsCount;
      cohesion.x /= neighborsCount;
      cohesion.y /= neighborsCount;

      // Calculate the new velocity based on the three rules
      this.velocity.x +=
        alignment.x * alignmentFactor +
        cohesion.x * cohesionFactor +
        separation.x * separationFactor;
      this.velocity.y +=
        alignment.y * alignmentFactor +
        cohesion.y * cohesionFactor +
        separation.y * separationFactor;
    }
  }

  handleCollisions(boids, screenWidth, screenHeight) {
    // Collision handling for screen edges
    const edgeMargin = 10;
    const boidForceMagnitude = 1;

    // Check if the boid is too close to the left or right edge
    if (
      this.graphic.x <= edgeMargin + this.size / 2 ||
      this.graphic.x >= screenWidth - edgeMargin - this.size / 2
    ) {
      // Check if the boid is too close to the left edge
      if (this.graphic.x <= edgeMargin + this.size / 2) {
        this.graphic.x = screenWidth - edgeMargin - this.size / 2; // Move to the right edge
      } else {
        this.graphic.x = edgeMargin + this.size / 2; // Move to the left edge
      }
    }

    // Check if the boid is too close to the top or bottom edge
    if (
      this.graphic.y <= edgeMargin + this.size / 2 ||
      this.graphic.y >= screenHeight - edgeMargin - this.size / 2
    ) {
      // Check if the boid is too close to the top edge
      if (this.graphic.y <= edgeMargin + this.size / 2) {
        this.graphic.y = screenHeight - edgeMargin - this.size / 2; // Move to the bottom edge
      } else {
        this.graphic.y = edgeMargin + this.size / 2; // Move to the top edge
      }
    }

    // Collisions with other boids
    for (let otherBoid of boids) {
      if (otherBoid !== this) {
        // Calculate distance between this boid and the other
        const dx = otherBoid.graphic.x - this.graphic.x;
        const dy = otherBoid.graphic.y - this.graphic.y;
        const distanceSquared = dx * dx + dy * dy;

        // Check if there's a collision
        if (distanceSquared < (this.size / 2 + otherBoid.size / 2) ** 2) {
          const directionX = dx / Math.sqrt(distanceSquared); // normalize
          const directionY = dy / Math.sqrt(distanceSquared);

          // Calculate the magnitude of the repulsive force (inverse proportional to distance)
          const repulsiveForce =
            boidForceMagnitude * (1 / Math.sqrt(distanceSquared));

          // Adjust velocities of both boids to move away from each other
          this.velocity.x -= directionX * repulsiveForce;
          this.velocity.y -= directionY * repulsiveForce;
          otherBoid.velocity.x += directionX * repulsiveForce;
          otherBoid.velocity.y += directionY * repulsiveForce;
        }
      }
    }
  }
}
