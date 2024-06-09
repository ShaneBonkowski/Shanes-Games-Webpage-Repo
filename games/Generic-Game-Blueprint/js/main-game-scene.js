/**
 * @module GameNameMainGameScene
 *
 * @author Author Name
 */

import { setZOrderForMainGameElements } from "./zOrdering.js";
import { Physics } from "../../Shared-Game-Assets/js/physics.js";

export class MainGameScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainGameScene" });
    this.gameStarted = false;
  }

  preload() {
    // Preload assets if needed
    // this.load.image("Image Name", "./webps/image.webp");
  }

  create() {
    setZOrderForMainGameElements(this.game);
    this.subscribeToEvents();
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

  subscribeToEvents() {
    // Subscribe to events here
  }
}
