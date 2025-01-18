import { setZOrderForMainGameElements } from "./z-ordering.js";
import { Physics } from "../../Shared-Game-Assets/js/physics.js";
import { Generic2DGameScene } from "../../Shared-Game-Assets/js/game-scene-2d.js";

export class MainGameScene extends Generic2DGameScene {
  constructor() {
    super({ key: "MainGameScene" });
  }

  preload() {
    // Preload assets if needed
    // this.load.image("Image Name", "./webps/image.webp");
  }

  create() {
    setZOrderForMainGameElements(this.game);
    this.subscribeToEvents();

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

  subscribeToEvents() {
    // Subscribe to events here
  }
}
