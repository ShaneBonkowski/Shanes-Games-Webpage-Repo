import { Boid } from "./Boid.js";

export function instantiateBoids(scene, boidCount) {
  const boidSize = 20;
  const boidColor = 0xffffff;
  const boids = []; // Array to store all boids

  //   // Spawn in the main boid at the middle of the screen, and have it follow mouse
  //   const spawnX = window.innerWidth / 2;
  //   const spawnY = window.innerHeight / 2;
  //   const mainBoid = new Boid(scene, boidSize, boidColor, spawnX, spawnY);
  //   mainBoid.makeFollowPointer();
  //   boids.push(mainBoid); // Add the main boid to the list

  // Spawn in other boids randomly
  for (let i = 0; i < boidCount - 1; i++) {
    const randomX = getRandomFloat(0.1, 0.9) * window.innerWidth;
    const randomY = getRandomFloat(0.1, 0.9) * window.innerHeight;
    const boid = new Boid(scene, boidSize, boidColor, randomX, randomY);
    boids.push(boid); // Add the boid to the list
  }

  return boids;
}

export function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}
