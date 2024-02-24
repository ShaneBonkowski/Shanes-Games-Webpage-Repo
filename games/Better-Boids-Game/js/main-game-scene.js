import { instantiateBoids } from "./boid-utils.js";
import { setZOrderForMainGameElements } from "./zOrdering.js";
import { Physics } from "../../Shared-Game-Assets/js/physics.js";
import { Vec2 } from "../../Shared-Game-Assets/js/vector.js";

// Export so other scripts can access this
export class MainGameScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainGameScene" });
    this.boids = [];
    this.gameStarted = false;
    this.isInteracting = false; // is the  player actively interacting with the game?

    // Store the last known window size so we can update boids positions etc.
    // based on this as the screen size changes
    this.lastKnownWindowSize = new Vec2(0, 0);
  }

  preload() {
    // Preload assets if needed
  }

  create() {
    // Set the Z order of all elements
    setZOrderForMainGameElements(this.game);

    // Observe window resizing with ResizeObserver since it works
    // better than window.addEventListener("resize", this.handleWindowResize.bind(this));
    // Seems to be more responsive to quick snaps and changes.
    this.lastKnownWindowSize = new Vec2(window.innerWidth, window.innerHeight);
    const resizeObserver = new ResizeObserver((entries) => {
      this.handleWindowResize();
    });
    resizeObserver.observe(document.documentElement);

    this.initIsPlayerInteracting();
    this.disableScroll();

    // Spawn in x random boids as a Promise (so that we can run this async), and then
    // when that promise is fufilled, we can move on to other init logic
    instantiateBoids(this, 40).then((boids) => {
      this.boids = boids;

      // Continue with other initialization logic after boids are instantiated:
      // more code here eventually ...

      // After everything is loaded in, we can begin the game
      this.gameStarted = true;
      console.log("boids init'd!");
    });
  }

  update(time, delta) {
    if (this.gameStarted) {
      // Check if it's time to perform a physics update
      if (
        time - Physics.lastPhysicsUpdateTime >=
        Physics.physicsUpdateInterval
      ) {
        Physics.performPhysicsUpdate(time);

        // Handle the boid physics
        for (let boid of this.boids) {
          boid.handlePhysics(this.boids);
        }
      }
    }
  }

  // Disable scrolling
  disableScroll() {
    //document.body.style.overflow = "hidden"; // this prevents the page from being able to overflow (aka have more content out of view that you can see via scrolling)
    document.addEventListener("touchmove", this.preventDefault, {
      passive: false,
    });
    document.addEventListener("mousewheel", this.preventDefault, {
      passive: false,
    });
  }

  // Enable scrolling
  enableScroll() {
    //document.body.style.overflow = "";
    document.removeEventListener("touchmove", preventDefault);
    document.removeEventListener("mousewheel", preventDefault);
  }

  // Prevent default behavior of events (used in this case for disabling scroll)
  preventDefault(event) {
    //event.preventDefault();
  }

  initIsPlayerInteracting() {
    // Event listener to detect when the user interacts with the game
    document.addEventListener(
      "pointerdown",
      () => {
        this.isInteracting = true;
      },
      { capture: true }
    );

    document.addEventListener(
      "pointerup",
      () => {
        this.isInteracting = false;
      },
      { capture: true }
    );
  }

  // Function to handle window resize event
  handleWindowResize() {
    // Get the new screen dimensions
    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;

    // Update positions of all boids based on new screen dimensions.
    // We want to retain the general location of the boid, so we try to position it
    // the same screen % it was before on the new screen.
    for (let boid of this.boids) {
      if (boid.mainBoid == false) {
        // Calculate new position based on percentage of old position
        let new_x = (boid.graphic.x / this.lastKnownWindowSize.x) * screenWidth;
        let new_y =
          (boid.graphic.y / this.lastKnownWindowSize.y) * screenHeight;

        // handle re-sizing etc. of boid
        boid.handleWindowResize(new_x, new_y);
      }
    }

    // Update lastKnownWindowSize to current screen dimensions
    this.lastKnownWindowSize = new Vec2(screenWidth, screenHeight);
  }
}
