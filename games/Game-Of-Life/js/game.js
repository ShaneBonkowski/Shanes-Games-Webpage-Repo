import { setZOrderForSharedElements } from "./z-ordering.js";
// note: this imports the class, NOT the instance of the class.
// Use scene.isInteracting for e.g. to access that variable of
// the main game scene
import { MainGameScene } from "./main-game-scene.js";

export function LaunchGame() {
  const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    transparent: true,
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [MainGameScene],
  };

  const game = new Phaser.Game(config);

  updateBodySizeWithWindowResize(game);
  setZOrderForSharedElements(game);
}

function updateBodySizeWithWindowResize(game) {
  // Want body of document to == inner width / height.
  // This is so that banners / search bar etc. dont affect screen size.
  function updateBodySize() {
    const viewportWidth = window.innerWidth;
    const viewportHeight =
      window.innerHeight > document.documentElement.clientHeight
        ? document.documentElement.clientHeight
        : window.innerHeight;

    document.body.style.width = `${viewportWidth}px`;
    document.body.style.height = `${viewportHeight}px`;

    // Adjust Phaser canvas size
    if (game) {
      game.canvas.style.width = `${viewportWidth}px`;
      game.canvas.style.height = `${viewportHeight}px`;
    }
  }

  // Initial update
  updateBodySize();

  // Handle resize events to adjust body size
  window.addEventListener("resize", updateBodySize);
  window.addEventListener("orientationchange", updateBodySize);
}
