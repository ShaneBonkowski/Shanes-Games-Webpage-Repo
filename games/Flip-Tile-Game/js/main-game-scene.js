import { setZOrderForMainGameElements } from "./zOrdering.js";
import { Physics } from "../../Shared-Game-Assets/js/physics.js";
import { Vec2 } from "../../Shared-Game-Assets/js/vector.js";

// Export so other scripts can access this
export class MainGameScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainGameScene" });
    this.gameStarted = false;
    this.isInteracting = false; // is the  player actively interacting with the game?
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

    // Final setup for main game
    this.subscribeToEvents();
    this.disableScroll();
    this.gameStarted = true;
  }

  update(time, delta) {
    if (this.gameStarted) {
      // Check if it's time to perform a physics update
      if (
        time - Physics.lastPhysicsUpdateTime >=
        Physics.physicsUpdateInterval
      ) {
        Physics.performPhysicsUpdate(time);

        // Do physics things here ...
      }
    }
  }

  // Disable scrolling
  disableScroll() {
    //document.body.style.overflow = "hidden"; // this prevents the page from being able to overflow (aka have more content out of view that you can see via scrolling)
    document.addEventListener("touchmove", this.preventDefault.bind(this), {
      passive: false,
    });

    document.addEventListener(
      "mousewheel",
      this.preventDefault.bind(this), // Bind 'this' to refer to the class instance
      {
        passive: false,
      }
    );
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

  subscribeToEvents() {}

  // Function to handle window resize event
  handleWindowResize() {
    // Get the new screen dimensions
    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;

    // Update lastKnownWindowSize to current screen dimensions
    this.lastKnownWindowSize = new Vec2(screenWidth, screenHeight);
  }
}
