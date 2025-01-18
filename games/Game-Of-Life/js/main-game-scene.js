import { setZOrderForMainGameElements } from "./z-ordering.js";
import { Generic2DGameScene } from "../../Shared-Game-Assets/js/game-scene-2d.js";
import { instantiateTiles, TileGridAttrs } from "./tile-utils.js";

export const tiles = [];

export class MainGameScene extends Generic2DGameScene {
  constructor() {
    super({ key: "MainGameScene" });

    this.lastUpdateTime = 0;
  }

  preload() {
    // Preload assets if needed
    this.load.image("Tile Blank", "/games/Game-Of-Life/webps/Tile-Blank.webp");
  }

  create() {
    setZOrderForMainGameElements(this.game);
    this.setUpWindowResizeHandling();
    this.subscribeToEvents();
    this.disableScroll();

    // Initialize the game
    if (tiles.length != 0) {
      console.log("Error: tiles array is already populated");
      this.destroyTiles();
    }

    instantiateTiles(this).then((tiles_returned) => {
      // Push new tiles into tiles array
      tiles_returned.forEach((tile) => tiles.push(tile));
    });

    // After everything is loaded in, we can begin the game
    this.gameStarted = true;
  }

  update(time, delta) {
    if (this.gameStarted) {
      // Perform tile grid updates on TileGridAttrs.updateInterval
      if (time - this.lastUpdateTime >= TileGridAttrs.updateInterval) {
        this.lastUpdateTime = time;
        this.runClassicConwayGameOfLifeIteration();
      }
    }
  }

  runClassicConwayGameOfLifeIteration() {
    this.checkForNeighborTiles(true);
    this.handleConwayLifeIteration();
  }

  checkForNeighborTiles(countCorners) {
    for (let row = 0; row < tiles.length; row++) {
      for (let col = 0; col < tiles[row].length; col++) {
        let tile = tiles[row][col];
        tile.getQtyLivingNeighbors(tiles, countCorners);
      }
    }
  }

  handleConwayLifeIteration() {
    for (let row = 0; row < tiles.length; row++) {
      for (let col = 0; col < tiles[row].length; col++) {
        let tile = tiles[row][col];
        tile.handleConwayLifeIteration();
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
    // Handle tiles for window resize
    for (let row = 0; row < tiles.length; row++) {
      for (let col = 0; col < tiles[row].length; col++) {
        let tile = tiles[row][col];

        // Make sure tile exists
        if (tile) {
          tile.handleWindowResize();
        }
      }
    }
  }

  subscribeToEvents() {
    // Subscribe to events here
  }

  destroyTiles() {
    // Clear the existing tiles
    for (let row = 0; row < tiles.length; row++) {
      for (let col = 0; col < tiles[row].length; col++) {
        tiles[row][col].destroy();
      }
    }
    tiles.length = 0; // Clear the tiles array
  }
}
