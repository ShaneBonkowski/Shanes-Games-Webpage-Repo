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

  // Set the Z order of all elements that are shared among scenes (e.g. canvas, header, etc.)
  setZOrderForSharedElements(game);
}
