import {
  instantiateTiles,
  TilePatternAttrs,
  difficulty,
} from "./tile-utils.js";
import { setZOrderForMainGameElements } from "./zOrdering.js";
import { Physics } from "../../Shared-Game-Assets/js/physics.js";
import { Vec2 } from "../../Shared-Game-Assets/js/vector.js";
import {
  SeededRandom,
  randomType,
} from "../../Shared-Game-Assets/js/Seedable_Random.js";
import { more_math } from "../../Shared-Game-Assets/js/more_math.js";

export var intendedNewTileAttrs = {
  tileCount: 9, // initial values
  seed: more_math.getRandomInt(1, 10000), // UNSEEDED getRandomInt func from more_math isnstead of Seedable_Random
  qtyStatesBeingUsed: 2, // init
  difficultyLevel: difficulty.HARD,
};

// Export so other scripts can access this
export class MainGameScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainGameScene" });
    this.tiles = [];
    this.gameStarted = false;
    this.isInteracting = false; // is the  player actively interacting with the game?
  }

  preload() {
    // Preload assets if needed
    this.load.image("Tile", "./pngs/Tile.png");
  }

  create() {
    // Set the Z order of all elements
    setZOrderForMainGameElements(this.game);

    // Observe window resizing with ResizeObserver since it works
    // better than window.addEventListener("resize", this.handleWindowResize.bind(this));
    // Seems to be more responsive to quick snaps and changes.
    const resizeObserver = new ResizeObserver((entries) => {
      this.handleWindowResize();
    });
    resizeObserver.observe(document.documentElement);

    // Final setup for main game
    this.subscribeToEvents();
    this.disableScroll();

    // Spawn in tiles in a grid as a Promise (so that we can run this async), and then
    // when that promise is fufilled, we can move on to other init logic
    this.newTilePattern(true); // first time calling this
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

  resetCurrentTilePattern() {
    // Call a new tile pattern with the same seed in tile-utils
    // so that it resets back to the same tile pattern

    // Make sure no tiles exist to start
    this.destroyAllTiles();

    // Reset tile pattern in a grid as a Promise (so that we can run this async).
    // Do not change these parameters!! hence why they equals themselves
    TilePatternAttrs.tileCount = TilePatternAttrs.tileCount;
    TilePatternAttrs.seed = TilePatternAttrs.seed;
    instantiateTiles(this).then((tiles) => {
      this.tiles = tiles;
    });
    console.log("reset");
  }

  newTilePattern(firsTimeCalling = false) {
    // Make sure no tiles exist to start
    this.destroyAllTiles();

    // Update to a new tile pattern in a grid as a Promise (so that we can run this async)
    this.updateIntendedDifficuly(difficulty.EXPERT);
    this.updateIntendedSeed();
    this.updateActualTilePatternAttrs();

    instantiateTiles(this).then((tiles) => {
      this.tiles = tiles;
    });

    if (firsTimeCalling) {
      // After everything is loaded in, we can begin the game
      this.gameStarted = true;
    }
  }

  updateIntendedDifficuly(difficultyLevel = difficulty.HARD) {
    intendedNewTileAttrs.difficultyLevel = difficultyLevel;

    // Assign qty states etc based on difficulty
    if (difficultyLevel == difficulty.EASY) {
      intendedNewTileAttrs.qtyStatesBeingUsed = 2;
      intendedNewTileAttrs.tileCount = 4;
    } else if (difficultyLevel == difficulty.HARD) {
      intendedNewTileAttrs.qtyStatesBeingUsed = 2;
      intendedNewTileAttrs.tileCount = 9;
    } else {
      intendedNewTileAttrs.qtyStatesBeingUsed = 3;
      intendedNewTileAttrs.tileCount = 9;
    }
  }

  updateIntendedSeed(seedProvided = more_math.getRandomInt(1, 100000)) {
    intendedNewTileAttrs.seed = seedProvided;
  }

  updateActualTilePatternAttrs() {
    // Set actual to the intended values
    TilePatternAttrs.qtyStatesBeingUsed =
      intendedNewTileAttrs.qtyStatesBeingUsed;
    TilePatternAttrs.tileCount = intendedNewTileAttrs.tileCount;
    TilePatternAttrs.seed = intendedNewTileAttrs.seed;
    TilePatternAttrs.difficultyLevel = intendedNewTileAttrs.difficultyLevel;
  }

  destroyAllTiles() {
    // Clear the existing tiles
    for (let row = 0; row < this.tiles.length; row++) {
      for (let col = 0; col < this.tiles[row].length; col++) {
        this.tiles[row][col].destroy();
      }
    }
    this.tiles = [];
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

  subscribeToEvents() {
    // When we ask to change the tile grid, spawn a new tile pattern
    document.addEventListener(
      "onTilegridChange",
      function (event) {
        this.newTilePattern();
      }.bind(this)
    );

    // When we ask to change the tile grid, spawn a new tile pattern
    document.addEventListener(
      "onTilegridReset",
      function (event) {
        this.resetCurrentTilePattern();
      }.bind(this)
    );
  }

  // Function to handle window resize event
  handleWindowResize() {
    // Handle tiles for window resize
    for (let row = 0; row < this.tiles.length; row++) {
      for (let col = 0; col < this.tiles[row].length; col++) {
        let tile = this.tiles[row][col];

        // Make sure tile exists
        if (tile) {
          tile.handleWindowResize();
        }
      }
    }
  }
}
