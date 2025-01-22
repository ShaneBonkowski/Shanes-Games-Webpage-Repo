import { setZOrderForMainGameElements } from "./z-ordering.js";
import { Physics } from "../../Shared-Game-Assets/js/physics.js";
import { Generic2DGameScene } from "../../Shared-Game-Assets/js/game-scene-2d.js";

export class MainGameScene extends Generic2DGameScene {
  constructor() {
    super({ key: "MainGameScene" });

    // Define scene attrs here
    // ...
  }

  preload() {
    // Preload assets if needed
    // this.load.image("Image Name", "./webps/image.webp");
    // ...
  }

  create() {
    setZOrderForMainGameElements(this.game);
    this.setUpWindowResizeHandling();
    this.subscribeToEvents();
    this.disableScroll();

    // Add game initialization code here
    // ...

    // After everything is loaded in, we can begin the game
    this.gameStarted = true;
  }

  update(time, delta) {
    if (this.gameStarted) {
      // Perform physics updates on physicsUpdateInterval
      if (
        time - Physics.lastPhysicsUpdateTime >=
        Physics.physicsUpdateInterval
      ) {
        Physics.performPhysicsUpdate(time);

        // Do physics things here ...
      }
    }
  }

  setUpWindowResizeHandling() {
    // Observe window resizing with ResizeObserver since it
    // is good for snappy changes
    const resizeObserver = new ResizeObserver((entries) => {
      this.handleWindowResize();
    });
    resizeObserver.observe(document.documentElement);

    // Also checking for resize or orientation change to try
    // to handle edge cases that ResizeObserver misses!
    window.addEventListener("resize", this.handleWindowResize.bind(this));
    window.addEventListener(
      "orientationchange",
      this.handleWindowResize.bind(this)
    );
  }

  // Function to handle window resize event
  handleWindowResize() {
    // Handle window resize here... e.g. change sizes of game objects...
  }

  subscribeToEvents() {
    // Subscribe to events here
  }
}
