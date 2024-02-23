import { setZOrderForSharedElements } from "./zOrdering.js";
import { MainGameScene } from "./main-game-scene.js";

// Export so other scripts can access this
export function LaunchGame() {
  // Initialize Phaser Game
  var config = {
    // Game canvas initialization
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    transparent: true, // Set the canvas to be transparent, since we handle background in better=boids-styles.js
    scale: {
      mode: Phaser.Scale.RESIZE,
      // parent: "phaser-example",
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [MainGameScene],
  };

  var game = new Phaser.Game(config);

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
