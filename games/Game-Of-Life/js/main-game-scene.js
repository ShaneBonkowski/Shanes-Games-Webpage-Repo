import { setZOrderForMainGameElements } from "./z-ordering.js";
import { Generic2DGameScene } from "../../Shared-Game-Assets/js/game-scene-2d.js";
import {
  instantiateTiles,
  TileGridAttrs,
  tileGridWidthComputer,
  tileGridHeightComputer,
  tileGridWidthPhone,
  tileGridHeightPhone,
  tileColors,
  TileAndBackgroundColors,
} from "./tile-utils.js";
import { gameOfLifeEventNames } from "./init-ui.js";

export const tiles = [];

export class MainGameScene extends Generic2DGameScene {
  constructor() {
    super({ key: "MainGameScene" });

    this.lastUpdateTime = 0;
    this.currentColorThemeIndex = 0;
    this.partyMode = true;
    this.partyModeCounter = 0;
    this.partModeUpdateInterval = 6;
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

    // Initialize the game (setting tile layout creates the tiles)
    let isPortrait = window.matchMedia("(orientation: portrait)").matches;

    if (window.innerWidth <= 600 || isPortrait) {
      this.setTileLayoutForPhone();
    } else {
      this.setLayoutForComputer();
    }

    this.updateColorTheme();

    // After everything is loaded in, we can begin the game
    this.gameStarted = true;
    this.paused = true; // start off paused
    this.handleTogglePauseUpdates();
  }

  update(time, delta) {
    if (this.gameStarted) {
      if (this.paused == false) {
        // Perform tile grid updates on TileGridAttrs.updateInterval
        if (time - this.lastUpdateTime >= TileGridAttrs.updateInterval) {
          this.lastUpdateTime = time;
          this.runClassicConwayGameOfLifeIteration();

          // Party mode: switch color theme every x iterations
          if (this.partyMode) {
            this.partyModeCounter++;
            if (this.partyModeCounter >= this.partModeUpdateInterval) {
              this.advanceToNextColorTheme();
              this.partyModeCounter = 0;
            }
          }
        }
      }
    }
  }

  runClassicConwayGameOfLifeIteration() {
    this.checkForNeighborTiles(true, true);
    this.handleConwayLifeIteration();
  }

  checkForNeighborTiles(countCorners, countTorusNeighbors) {
    for (let row = 0; row < tiles.length; row++) {
      for (let col = 0; col < tiles[row].length; col++) {
        let tile = tiles[row][col];
        tile.getQtyLivingNeighbors(tiles, countCorners, countTorusNeighbors);
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

    // If it switches from landscape to portrait (aka phone) or vice versa,
    // update the layout of the tile grid.
    let isPortrait = window.matchMedia("(orientation: portrait)").matches;

    if (window.innerWidth <= 600 || isPortrait) {
      // Only update layout if it changed!
      if (
        TileGridAttrs.tileGridWidth != tileGridWidthPhone ||
        TileGridAttrs.tileGridHeight != tileGridHeightPhone
      ) {
        this.setTileLayoutForPhone();
      }
    } else {
      // Only update layout if it changed!
      if (
        TileGridAttrs.tileGridWidth != tileGridWidthComputer ||
        TileGridAttrs.tileGridHeight != tileGridHeightComputer
      ) {
        this.setLayoutForComputer();
      }
    }
  }

  setTileLayoutForPhone() {
    // Update layout for phone
    TileGridAttrs.tileGridWidth = tileGridWidthPhone;
    TileGridAttrs.tileGridHeight = tileGridHeightPhone;

    // init or re-init all tiles
    this.destroyTiles();
    instantiateTiles(this).then((tiles_returned) => {
      // Push new tiles into tiles array
      tiles_returned.forEach((tile) => tiles.push(tile));
    });
  }

  setLayoutForComputer() {
    // Update layout for computer
    TileGridAttrs.tileGridWidth = tileGridWidthComputer;
    TileGridAttrs.tileGridHeight = tileGridHeightComputer;

    // init or re-init all tiles
    this.destroyTiles();
    instantiateTiles(this).then((tiles_returned) => {
      // Push new tiles into tiles array
      tiles_returned.forEach((tile) => tiles.push(tile));
    });
  }

  resetTiles() {
    for (let row = 0; row < tiles.length; row++) {
      for (let col = 0; col < tiles[row].length; col++) {
        tiles[row][col].resetTile();
      }
    }
  }

  subscribeToEvents() {
    document.addEventListener(
      gameOfLifeEventNames.togglePause,
      this.togglePause.bind(this)
    );

    document.addEventListener(
      gameOfLifeEventNames.clickAdvance,
      this.clickAdvance.bind(this)
    );

    document.addEventListener(
      gameOfLifeEventNames.resetTiles,
      this.resetTiles.bind(this)
    );
  }

  togglePause() {
    this.paused = !this.paused;
    this.handleTogglePauseUpdates();
  }

  handleTogglePauseUpdates() {
    // Update icon of togglePause button based on state
    const togglePauseButtonContainer = document.querySelector(
      ".toggle-pause-button-container"
    );
    const togglePauseButton =
      togglePauseButtonContainer.querySelector(".gol-button");
    const togglePauseButtonIcon = togglePauseButton.querySelector(".fas");

    togglePauseButtonIcon.classList.remove("fa-pause", "fa-play");
    if (this.paused) {
      // Show play if it is paused, so someone knows to press to play
      togglePauseButtonIcon.classList.add("fa-play");
    } else {
      togglePauseButtonIcon.classList.add("fa-pause");
    }

    // Disable the advance button if paused
    const advanceButtonContainer = document.querySelector(
      ".advance-button-container"
    );
    const advanceButton = advanceButtonContainer.querySelector(".gol-button");
    if (this.paused) {
      advanceButtonContainer.classList.remove("gol-disabled-button-container");
      advanceButton.classList.remove("gol-disabled-button");
    } else {
      advanceButtonContainer.classList.add("gol-disabled-button-container");
      advanceButton.classList.add("gol-disabled-button");
    }
  }

  clickAdvance() {
    if (this.paused) {
      this.runClassicConwayGameOfLifeIteration();
    }
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

  hexToCssColor(hex) {
    return `#${hex.toString(16).padStart(6, "0")}`;
  }

  advanceToNextColorTheme() {
    this.currentColorThemeIndex++;
    if (this.currentColorThemeIndex > TileAndBackgroundColors.length - 1) {
      this.currentColorThemeIndex = 0;
    }
    this.updateColorTheme();
  }

  decreaseToPreviousColorTheme() {
    this.currentColorThemeIndex--;
    if (this.currentColorThemeIndex < 0) {
      this.currentColorThemeIndex = TileAndBackgroundColors.length - 1;
    }
    this.updateColorTheme();
  }

  updateColorTheme() {
    // Tile color is ON == TileAndBackgroundColors[i][0], OFF == TileAndBackgroundColors[i][1]
    for (let row = 0; row < tiles.length; row++) {
      for (let col = 0; col < tiles[row].length; col++) {
        // Update the ON/OFF colors
        tileColors.ON = TileAndBackgroundColors[this.currentColorThemeIndex][0];
        tileColors.OFF =
          TileAndBackgroundColors[this.currentColorThemeIndex][1];

        tiles[row][col].updateColor();
      }
    }

    // Background color is TileAndBackgroundColors[i][2]
    document.body.style.backgroundColor = this.hexToCssColor(
      TileAndBackgroundColors[this.currentColorThemeIndex][2]
    );
  }
}
