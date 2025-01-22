import { setZOrderForSharedElements } from "./z-ordering.js";
import { MainGameScene } from "./main-game-scene.js"; // note: this imports the class, NOT the instance of the class. Use scene.isInteracting for e.g. to access that variable of the main game scene

// Export so other scripts can access this
export function LaunchGame() {
  // Initialize Phaser Game
  const config = {
    // Game canvas initialization
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    // Set the canvas to be transparent, since we handle
    // background in better-boids-styles.css
    transparent: true,
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [MainGameScene],
  };

  const game = new Phaser.Game(config);

  updateBodySizeWithWindowResize();

  // Set the Z order of all elements that are shared among scenes (e.g. canvas, header, etc.)
  setZOrderForSharedElements(game);
}

function updateBodySizeWithWindowResize() {
  // Want body of document to == inner width / height.
  // This is so that banners / search bar etc. dont affect screen size.
  function updateBodySize() {
    document.body.style.width = window.innerWidth + "px";
    document.body.style.height = window.innerHeight + "px";
  }

  // Initial update
  updateBodySize();

  // Handle resize events to adjust body size
  window.addEventListener("resize", updateBodySize);
  window.addEventListener("orientationchange", updateBodySize);
}
