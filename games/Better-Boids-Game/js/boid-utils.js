/**
 * @module BoidUtils
 *
 * @author Shane Bonkowski
 */

import { Boid } from "./Boid.js";
import { more_math } from "../../Shared-Game-Assets/js/more_math.js";
import { SeededRandom } from "../../Shared-Game-Assets/js/Seedable_Random.js";

// Define constants for the boids rules
export const BoidFactors = {
  speed: 0.6,
  alignmentFactor: 0.3,
  cohesionFactor: 0.054,
  separationFactor: 0.935,
  leaderFollowFactor: 5,
  leaderFollowRadius: 500,
  predatorPreyFactor: 3,
  flockSearchRadius: 90,
  boidProtectedRadius: 20,
  leaderBoidEnabled: true,
};

export const boidEventNames = {
  onSpeedChange: "onSpeedChange",
  pointerholdclick: "pointerholdclick",
};

const seededRandom = new SeededRandom(1234);

export function instantiateBoids(scene, boidCount) {
  // Allows for async behavior
  return new Promise((resolve, reject) => {
    let boids = [];
    let boidsInitialized = 0;

    // Spawn in the main boid at the middle of the screen, and have it follow mouse
    let spawnX = window.innerWidth / 2;
    let spawnY = window.innerHeight / 2;
    let leaderBoid = true;
    let mainBoid = new Boid(scene, spawnX, spawnY, leaderBoid, 0);
    boids.push(mainBoid); // Add the main boid to the list

    // Function to check if all boids are initialized
    function checkInitialization() {
      if (boidsInitialized === boidCount) {
        resolve(boids); // Resolve the Promise with the array of boids
      }
    }

    // Spawn in other boids randomly
    leaderBoid = false;
    for (let i = 0; i < boidCount; i++) {
      let randomX = seededRandom.getRandomFloat(0.1, 0.9) * window.innerWidth;
      let randomY = seededRandom.getRandomFloat(0.1, 0.9) * window.innerHeight;
      let boid = new Boid(
        scene,
        randomX,
        randomY,
        leaderBoid,
        boidsInitialized + 1
      );
      boids.push(boid);

      // Increment the count of initialized boids
      boidsInitialized++;

      // Check if all boids are initialized
      checkInitialization();
    }
  });
}
