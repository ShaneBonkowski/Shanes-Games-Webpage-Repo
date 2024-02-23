import { Boid } from "./Boid.js";
import { more_math } from "../../Shared-Game-Assets/js/more_math.js";

// Define constants for the boids rules
export const BoidFactors = {
  speed: 0.3,
  alignmentFactor: 0.9,
  cohesionFactor: 0.5,
  flockSearchRadius: 50,
  separationFactor: 0.8,
};

export const customEvents = {
  speedChangeEvent: new Event("onSpeedChange"),
};

export function instantiateBoids(scene, boidCount) {
  // Allows for async behavior
  return new Promise((resolve, reject) => {
    const boidColor = 0xffffff;
    let boids = [];
    let boidsInitialized = 0;

    //   // Spawn in the main boid at the middle of the screen, and have it follow mouse
    //   let spawnX = window.innerWidth / 2;
    //   let spawnY = window.innerHeight / 2;
    //   let mainBoid = new Boid(scene, boidColor, spawnX, spawnY);
    //   mainBoid.makeFollowPointer();
    //   boids.push(mainBoid); // Add the main boid to the list

    // Function to check if all boids are initialized
    function checkInitialization() {
      if (boidsInitialized === boidCount) {
        resolve(boids); // Resolve the Promise with the array of boids
      }
    }

    // Spawn in other boids randomly
    for (let i = 0; i < boidCount; i++) {
      let randomX = more_math.getRandomFloat(0.1, 0.9) * window.innerWidth;
      let randomY = more_math.getRandomFloat(0.1, 0.9) * window.innerHeight;
      let boid = new Boid(scene, boidColor, randomX, randomY);
      boids.push(boid);

      // Increment the count of initialized boids
      boidsInitialized++;

      // Check if all boids are initialized
      checkInitialization();
    }
  });
}
