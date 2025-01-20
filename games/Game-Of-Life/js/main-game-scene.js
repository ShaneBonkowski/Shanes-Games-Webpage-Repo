import { setZOrderForMainGameElements } from "./z-ordering.js";
import {
  Generic2DGameScene,
  genericGameEventNames,
} from "../../Shared-Game-Assets/js/game-scene-2d.js";
import {
  instantiateTiles,
  TileGridAttrs,
  tileGridWidthComputer,
  tileGridHeightComputer,
  tileGridWidthPhone,
  tileGridHeightPhone,
  tileColors,
  TileAndBackgroundColors,
  tileStates,
  gameOfLifeTypes,
} from "./tile-utils.js";
import { gameOfLifeEventNames } from "./init-ui.js";

export const tiles = [];

export class MainGameScene extends Generic2DGameScene {
  constructor() {
    super({ key: "MainGameScene" });

    this.lastUpdateTime = 0;
    this.gameOfLifeType = gameOfLifeTypes.CONWAY;
    this.currentColorThemeIndex = 0;

    this.discoMode = false;
    this.discoModeCounter = 0;
    this.partModeUpdateInterval = 6;

    this.updatePopulation(0);
    this.updateGeneration(0);

    // Let game know ui menu closed to start
    this.onUiMenuClosed();
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

    // If there is local storage with currentColorThemeIndex, set
    // this.currentColorThemeIndex to that to start!
    if (localStorage.getItem("currentColorThemeIndex")) {
      this.currentColorThemeIndex = parseInt(
        localStorage.getItem("currentColorThemeIndex")
      );
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
          this.runGameOfLifeIteration();

          // Disco mode: switch color theme every x iterations
          if (this.discoMode) {
            this.discoModeCounter++;
            if (this.discoModeCounter >= this.partModeUpdateInterval) {
              this.advanceToNextColorTheme();
              this.discoModeCounter = 0;
            }
          }
        }
      }
    }
  }

  runGameOfLifeIteration() {
    // Run the life iteration
    this.checkForNeighborTiles(
      TileGridAttrs.countCornersAsNeighbors,
      TileGridAttrs.infiniteEdges
    );
    if (this.gameOfLifeType == gameOfLifeTypes.CONWAY) {
      this.handleConwayLifeIteration();
    } else {
      console.error(`Unknown game of life type: ${gameOfLifeType}`);
    }

    // Update the populalation and generation count
    this.updateGeneration(this.generation + 1);

    let newPopulation = 0;
    for (let row = 0; row < tiles.length; row++) {
      for (let col = 0; col < tiles[row].length; col++) {
        if (tiles[row][col].tileState == tileStates.ON) {
          newPopulation++;
        }
      }
    }
    this.updatePopulation(newPopulation);
  }

  updateGeneration(newGenerationVal) {
    // Cap to safe values
    if (newGenerationVal > Number.MAX_SAFE_INTEGER - 10) {
      newGenerationVal = 0;
    }

    // Only fire an event if the generation value actually changed
    if (newGenerationVal != this.generation) {
      document.dispatchEvent(
        new CustomEvent(gameOfLifeEventNames.onGenChange, {
          detail: { message: newGenerationVal.toString() },
        })
      );
    }

    this.generation = newGenerationVal;
  }

  updatePopulation(newPopulationVal) {
    // Cap to safe values
    if (newPopulationVal > Number.MAX_SAFE_INTEGER - 10) {
      newPopulationVal = 0;
    }

    // Only fire an event if the population value actually changed
    if (newPopulationVal != this.population) {
      document.dispatchEvent(
        new CustomEvent(gameOfLifeEventNames.onPopChange, {
          detail: { message: newPopulationVal.toString() },
        })
      );
    }

    this.population = newPopulationVal;

    if (this.population == 0) {
      // If the population is 0, pause the game if it is not already
      if (!this.paused) {
        this.togglePause();
      }
    }

    // Advance button may need changed if population/pause state changes!
    this.handleAdvanceButtonState();
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

    // Fresh reset on generation and population as well
    this.updatePopulation(0);
    this.updateGeneration(0);
  }

  subscribeToEvents() {
    document.addEventListener(
      gameOfLifeEventNames.togglePause,
      this.togglePause.bind(this)
    );

    document.addEventListener(
      gameOfLifeEventNames.toggleDisco,
      this.toggleDisco.bind(this)
    );

    document.addEventListener(
      gameOfLifeEventNames.clickAdvance,
      this.clickAdvance.bind(this)
    );

    document.addEventListener(
      gameOfLifeEventNames.resetTiles,
      this.resetTiles.bind(this)
    );

    document.addEventListener(
      genericGameEventNames.uiMenuOpen,
      this.onUiMenuOpen.bind(this)
    );
    document.addEventListener(
      genericGameEventNames.uiMenuClosed,
      this.onUiMenuClosed.bind(this)
    );
  }

  onUiMenuOpen() {
    this.uiMenuOpen = true;
  }

  onUiMenuClosed() {
    this.uiMenuOpen = false;
  }

  togglePause() {
    this.paused = !this.paused;
    this.handleTogglePauseUpdates();
  }

  handleTogglePauseUpdates() {
    this.handlePauseButtonVisual();
    this.handleAdvanceButtonState();
  }

  handlePauseButtonVisual() {
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
  }

  handleAdvanceButtonState() {
    // Can only advance while game is NOT running, and while there is > 0 population.
    if (this.paused && this.population > 0) {
      this.enableAdvanceButton();
    } else {
      this.disableAdvanceButton();
    }
  }

  disableAdvanceButton() {
    const advanceButtonContainer = document.querySelector(
      ".advance-button-container"
    );
    const advanceButton = advanceButtonContainer.querySelector(".gol-button");
    advanceButtonContainer.classList.add("gol-disabled-button-container");
    advanceButton.classList.add("gol-disabled-button");
  }

  enableAdvanceButton() {
    const advanceButtonContainer = document.querySelector(
      ".advance-button-container"
    );
    const advanceButton = advanceButtonContainer.querySelector(".gol-button");
    advanceButtonContainer.classList.remove("gol-disabled-button-container");
    advanceButton.classList.remove("gol-disabled-button");
  }

  clickAdvance() {
    if (this.paused) {
      this.runGameOfLifeIteration();
    }
  }

  toggleDisco() {
    this.discoMode = !this.discoMode;
    this.handleDiscoButtonVisual();
  }

  handleDiscoButtonVisual() {
    // Update icon of togglePause button based on state
    const toggleDiscoButtonContainer = document.querySelector(
      ".toggle-disco-button-container"
    );
    const toggleDiscoButton =
      toggleDiscoButtonContainer.querySelector(".gol-button");
    const toggleDiscoButtonIcon = toggleDiscoButton.querySelector(".fas");

    toggleDiscoButtonIcon.classList.remove("fa-circle-stop", "fa-gift");
    if (this.discoMode) {
      // Show "turn off" icon if disco is playing
      toggleDiscoButtonIcon.classList.add("fa-circle-stop");
    } else {
      toggleDiscoButtonIcon.classList.add("fa-gift");
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
    // Update the ON/OFF colors
    tileColors.ON = TileAndBackgroundColors[this.currentColorThemeIndex][0];
    tileColors.OFF = TileAndBackgroundColors[this.currentColorThemeIndex][1];

    // Write this.currentColorThemeIndex to localStorage so that
    // the color theme persists on page reload etc.
    localStorage.setItem(
      "currentColorThemeIndex",
      this.currentColorThemeIndex.toString()
    );

    // Tile color is ON == TileAndBackgroundColors[i][0], OFF == TileAndBackgroundColors[i][1]
    for (let row = 0; row < tiles.length; row++) {
      for (let col = 0; col < tiles[row].length; col++) {
        tiles[row][col].updateColor();
        tiles[row][col].playSpinAnim();
      }
    }

    // Background color is TileAndBackgroundColors[i][2]
    document.body.style.backgroundColor = this.hexToCssColor(
      TileAndBackgroundColors[this.currentColorThemeIndex][2]
    );
  }
}
