import { instantiateBoids } from "./boid-utils.js";
import { setZOrderForMainGameElements } from "./zOrdering.js";

// Export so other scripts can access this
export class MainGameScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainGameScene" });
    this.boids = [];

    // Store the last known window size so we can update boids positions etc.
    // based on this as the screen size changes
    this.lastKnownWindowSize = {
      x: 0,
      y: 0,
    };
  }

  preload() {
    // Preload assets if needed
  }

  create() {
    // Set the Z order of all elements
    setZOrderForMainGameElements(this.game);

    // Spawn in 10 random boids, counting 1 main boid that follows pointer
    this.boids = instantiateBoids(this, 15);

    // Observe window resizing with ResizeObserver since it works
    // better than window.addEventListener("resize", this.handleWindowResize.bind(this));
    // Seems to be more responsive to quick snaps and changes.
    this.lastKnownWindowSize = {
      x: window.innerWidth,
      y: window.innerHeight,
    };
    const resizeObserver = new ResizeObserver((entries) => {
      this.handleWindowResize();
    });
    resizeObserver.observe(document.documentElement);
  }

  update() {
    // Handle the boid physics
    for (let boid of this.boids) {
      boid.handlePhysics(this.boids);
    }
  }

  // Function to handle window resize event
  handleWindowResize() {
    // Get the new screen dimensions
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Update positions of all boids based on new screen dimensions.
    // We want to retain the general location of the boid, so we try to position it
    // the same screen % it was before on the new screen.
    for (let boid of this.boids) {
      if (boid.mainBoid == false) {
        // Calculate new position based on percentage of old position
        boid.graphic.x =
          (boid.graphic.x / this.lastKnownWindowSize.x) * screenWidth;
        boid.graphic.y =
          (boid.graphic.y / this.lastKnownWindowSize.y) * screenHeight;
      }
    }

    // Update lastKnownWindowSize to current screen dimensions
    this.lastKnownWindowSize = {
      x: screenWidth,
      y: screenHeight,
    };
  }
}
