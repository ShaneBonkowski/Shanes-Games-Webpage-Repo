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
  cgolTileShapes,
  gameOfLifeShape,
  tilespaceSet,
  LivingTilespaceSet,
} from "./tile-utils.js";
import { gameOfLifeEventNames } from "./init-ui.js";
import { SeededRandom } from "../../Shared-Game-Assets/js/seedable-random.js";
import { GestureManager } from "../../Shared-Game-Assets/js/gesture-manager.js";

export const tiles = [];

const unseededRandom = new SeededRandom();

export class MainGameScene extends Generic2DGameScene {
  constructor() {
    super({ key: "MainGameScene" });

    this.renderUpdateInterval = 16.67; // ~= 60hz
    this.lastRenderUpdateTime = 0;
    this.lastGameStateUpdateTime = 0;

    this.gameOfLifeType = gameOfLifeTypes.CONWAY;
    this.discoMode = false;
    this.discoModeLastUpdateTime = 0;
    this.autoPlayMode = false;
    this.autoPlayModeLastUpdateTime = 0;

    this.livingTilespaceSet = new LivingTilespaceSet();
    this.updatePopulation(0);
    this.updateGeneration(0);

    this.gestureManager = new GestureManager();

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
    // TileGridAttrs.currentColorThemeIndex to that to start!
    if (localStorage.getItem("currentColorThemeIndex")) {
      TileGridAttrs.currentColorThemeIndex = parseInt(
        localStorage.getItem("currentColorThemeIndex")
      );
    }
    this.updateColorThemeAttrs();

    // Dispatch a custom event saying that color change just occured
    // due to the game class, not the slider.
    document.dispatchEvent(
      new Event(gameOfLifeEventNames.changeColorThemeFromMainGame)
    );

    // After everything is loaded in, we can begin the game
    this.gameStarted = true;
    this.paused = true; // start off paused
    this.handleTogglePauseUpdates();
  }

  update(time, delta) {
    if (this.gameStarted) {
      if (this.paused == false) {
        // Perform tile grid updates on TileGridAttrs.updateInterval
        if (
          time - this.lastGameStateUpdateTime >=
          TileGridAttrs.updateInterval
        ) {
          this.lastGameStateUpdateTime = time;

          // Auto mode: automatically place shapes if the criteria fits
          if (this.autoPlayMode) {
            // Every 2 seconds, if the population is below some threshold, place a shape
            if (
              time - this.autoPlayModeLastUpdateTime >= 2000 &&
              this.population < 30
            ) {
              this.autoPlayModeLastUpdateTime = time;
              this.placeRandomShape();
            }
            // Otherwise, in case the population has grown static, place a shape no matter what
            // after 5 seconds
            else if (time - this.autoPlayModeLastUpdateTime >= 5000) {
              this.autoPlayModeLastUpdateTime = time;
              this.placeRandomShape();
            }
          }

          // Disco mode: switch color theme every after discoModeUpdateInterval ms
          if (this.discoMode) {
            if (
              time - this.discoModeLastUpdateTime >=
              TileGridAttrs.discoModeUpdateInterval
            ) {
              this.discoModeLastUpdateTime = time;
              this.advanceToNextColorTheme();

              // Dispatch a custom event saying that disco mode just caused
              // a color change.
              document.dispatchEvent(
                new Event(gameOfLifeEventNames.changeColorThemeFromMainGame)
              );

              // // Play a vignette animation (make it nearly as long as the disco mode interval)
              // vignetteFade(TileGridAttrs.discoModeUpdateInterval); // ms
            }
          }

          // Run the iteration last so it can handle things like population count etc.
          this.runGameOfLifeIteration();
        }
      }

      // "render" pass to update all visuals
      if (time - this.lastRenderUpdateTime >= this.renderUpdateInterval) {
        this.lastRenderUpdateTime = time;

        this.renderPass();
      }
    }
  }

  renderPass() {
    // Update tile graphics / color etc.
    for (let row = 0; row < tiles.length; row++) {
      for (let col = 0; col < tiles[row].length; col++) {
        tiles[row][col].renderTileGraphics();
      }
    }

    // Set background color -> TileAndBackgroundColors[i][2]
    document.body.style.backgroundColor = this.hexToCssColor(
      TileAndBackgroundColors[TileGridAttrs.currentColorThemeIndex][2]
    );
  }

  runGameOfLifeIteration() {
    // Run the life iteration
    let toCheckTileGridSpaceLocs = this.checkForNeighborTiles(
      TileGridAttrs.countCornersAsNeighbors,
      TileGridAttrs.infiniteEdges
    );

    if (this.gameOfLifeType == gameOfLifeTypes.CONWAY) {
      this.handleConwayLifeIteration(toCheckTileGridSpaceLocs);
    } else {
      console.error(`Unknown game of life type: ${gameOfLifeType}`);
    }

    // Update the generation count
    this.updateGeneration(this.generation + 1);
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

    // If the population is 0, pause the game if it is not already.
    // ONLY IF NOT IN AUTOPLAY MODE!
    if (this.population == 0 && !this.autoPlayMode) {
      if (!this.paused) {
        this.togglePause();
      }
    }

    // Advance button may need changed if population/pause state changes!
    this.handleAdvanceButtonState();
  }

  checkForNeighborTiles(countCorners, countTorusNeighbors) {
    // Check all living tiles and their surrounding neighbors to see how many living
    // neighbors they have. This is the optimal way of checking, since vast spans of
    // dead cells will never change state, so we can skip them.
    let livingTileGridSpaceLocs = this.livingTilespaceSet.getTilespaceArray();
    let toCheckTilespaceSet = new tilespaceSet();

    // Add living tiles and their neighbors to the toCheckTilespaceSet
    for (let loc of livingTileGridSpaceLocs) {
      let [x, y] = loc;

      // Add the living tile itself
      toCheckTilespaceSet.add(tiles[x][y]);

      // Add its neighbors
      let neighborTiles = tiles[x][y].getNeighbors(
        tiles,
        countCorners,
        countTorusNeighbors
      );

      for (let neighborTile of neighborTiles) {
        toCheckTilespaceSet.add(neighborTile);
      }
    }

    // Iterate over tiles to check and get their qty living neighbors
    let toCheckTileGridSpaceLocs = toCheckTilespaceSet.getTilespaceArray();
    for (let loc of toCheckTileGridSpaceLocs) {
      let [x, y] = loc;
      tiles[x][y].getQtyLivingNeighbors(
        tiles,
        countCorners,
        countTorusNeighbors
      );
    }

    // Only check these tiles for game of life changes (more efficient)
    return toCheckTileGridSpaceLocs;
  }

  handleConwayLifeIteration(toCheckTileGridSpaceLocs) {
    for (let loc of toCheckTileGridSpaceLocs) {
      let [x, y] = loc;
      let tile = tiles[x][y];
      tile.handleConwayLifeIteration();
    }
  }

  setUpWindowResizeHandling() {
    // Observe window resizing with ResizeObserver since it
    // is good for snappy changes
    const resizeObserver = new ResizeObserver((entries) => {
      this.onWindowResize();
    });
    resizeObserver.observe(document.documentElement);

    // Also checking for resize or orientation change to try
    // to handle edge cases that ResizeObserver misses!
    window.addEventListener("resize", this.onWindowResize.bind(this));
    window.addEventListener(
      "orientationchange",
      this.onWindowResize.bind(this)
    );
  }

  onWindowResize() {
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
    // reset zoom and drag to 0
    this.gestureManager.resetDrag();
    this.gestureManager.resetZoom();

    for (let row = 0; row < tiles.length; row++) {
      for (let col = 0; col < tiles[row].length; col++) {
        tiles[row][col].resetTile();
      }
    }

    // Fresh reset on generation and population as well
    this.livingTilespaceSet.clear();
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
      gameOfLifeEventNames.toggleAutomatic,
      this.toggleAutoPlay.bind(this)
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

    // Update color theme if color theme changes via slider
    document.addEventListener(
      gameOfLifeEventNames.changeColorThemeFromSlider,
      function (event) {
        this.onSetColorThemeSlider();
      }.bind(this)
    );
  }

  onUiMenuOpen() {
    this.uiMenuOpen = true;
    this.gestureManager.blockDrag();
    this.gestureManager.blockZoom();
  }

  onUiMenuClosed() {
    this.uiMenuOpen = false;
    this.gestureManager.unblockDrag();
    this.gestureManager.unblockZoom();
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

  placeRandomShape() {
    // Get a random shape
    let cgolTileShapeKeys = Object.keys(cgolTileShapes);
    let randomShapeIndex = unseededRandom.getRandomInt(
      0,
      cgolTileShapeKeys.length - 1
    );
    let randomShape = new gameOfLifeShape(cgolTileShapeKeys[randomShapeIndex]);

    // console.log(cgolTileShapeKeys[randomShapeIndex]);
    // console.log(randomShape.shapeTileSpace);

    // Random shape has a shapeTileSpace indicating which tiles to turn on/off,
    // starting from the top left. Need to find a random location on the real tileGridSpace
    // that can fit the shape!
    let tileSpaceWidth = tiles.length;
    let tileSpaceHeight = tiles[0].length;

    let shapeWidth = randomShape.getWidth();
    let shapeHeight = randomShape.getHeight();

    // Pick a random x coordinate between 0 and tileSpaceWidth - shapeWidth, so that the shape
    // can always fit. Do similar for the y coordinate, but bound the lower bound since y counts downward.
    // This logic works because we draw the tile from top left to bottom right.
    let upperBoundX = tileSpaceWidth - shapeWidth;
    if (upperBoundX <= 0) {
      console.error("Shape is larger than the tile grid! Not placing shape.");
      return;
    }
    let randomX = unseededRandom.getRandomInt(0, upperBoundX);

    let lowerBoundY = shapeHeight;
    if (lowerBoundY >= tileSpaceHeight) {
      console.error("Shape is larger than the tile grid! Not placing shape.");
      return;
    }
    let randomY = unseededRandom.getRandomInt(lowerBoundY - 1, tileSpaceHeight);

    // Spawn in the shape from the randomX and randomY location!
    randomShape.iterateOverTileSpace((shape, shapeX, shapeY) => {
      let tileSpawnLocX = randomX + shapeX;
      let tileSpawnLocY = randomY - shapeY; // minus since it goes top left to bottom right

      if (tileSpawnLocX >= tileSpaceWidth || tileSpawnLocY >= tileSpaceHeight) {
        // Skip this iteration
        console.error(
          "Shape placement out of bounds. Cannot place at",
          tileSpawnLocX,
          tileSpawnLocY
        );
        console.log("Debug info about the shape:");
        console.log("Top left coordinate x, y: ", randomX, randomY);
        console.log("Shape width, height", shapeWidth, shapeHeight);
        console.log(
          "Tile Gridspace Width, height",
          tileSpaceWidth,
          tileSpaceHeight
        );
        return;
      }

      // Only add to the grid, dont remove anything!
      let tile = tiles[tileSpawnLocX][tileSpawnLocY];
      if (
        tile.tileState == tileStates.OFF &&
        shape.getStateAtCoords(shapeX, shapeY) == tileStates.ON
      ) {
        tile.changeState(tileStates.ON);
      }
    });
  }

  toggleAutoPlay() {
    this.autoPlayMode = !this.autoPlayMode;
    this.handleAutoPlayButtonVisual();

    // If the game is paused, unpause it if autoplay is turned on
    if (this.paused && this.autoPlayMode) {
      this.togglePause();
    }
  }

  handleAutoPlayButtonVisual() {
    // Update icon of toggleAutomatic button based on state
    const toggleAutomaticButtonContainer = document.querySelector(
      ".toggle-automatic-button-container"
    );
    const toggleAutomaticButton =
      toggleAutomaticButtonContainer.querySelector(".gol-button");
    const toggleAutomaticButtonIcon =
      toggleAutomaticButton.querySelector(".fas");

    toggleAutomaticButtonIcon.classList.remove("fa-circle-stop", "fa-robot");
    if (this.autoPlayMode) {
      // Show "turn off" icon if automatic is playing
      toggleAutomaticButtonIcon.classList.add("fa-circle-stop");
    } else {
      toggleAutomaticButtonIcon.classList.add("fa-robot");
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

    toggleDiscoButtonIcon.classList.remove("fa-ban", "fa-gift");
    if (this.discoMode) {
      // Show "turn off" icon if disco is playing
      toggleDiscoButtonIcon.classList.add("fa-ban");
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

  onSetColorThemeSlider() {
    // Turn off disco mode if its on already, since if a player is using the slider
    // then they dont want disco mode to be playing
    if (this.discoMode) {
      this.toggleDisco();
    }

    this.updateColorThemeAttrs();
  }

  advanceToNextColorTheme() {
    TileGridAttrs.currentColorThemeIndex++;
    if (
      TileGridAttrs.currentColorThemeIndex >
      TileAndBackgroundColors.length - 1
    ) {
      TileGridAttrs.currentColorThemeIndex = 0;
    }
    this.updateColorThemeAttrs();
  }

  decreaseToPreviousColorTheme() {
    TileGridAttrs.currentColorThemeIndex--;
    if (TileGridAttrs.currentColorThemeIndex < 0) {
      TileGridAttrs.currentColorThemeIndex = TileAndBackgroundColors.length - 1;
    }
    this.updateColorThemeAttrs();
  }

  updateColorThemeAttrs() {
    // Set values for the color theme on change... note rendering to actually update the colors
    //  is handled in the render pass.

    // Update the ON/OFF colors
    tileColors.ON =
      TileAndBackgroundColors[TileGridAttrs.currentColorThemeIndex][0];
    tileColors.OFF =
      TileAndBackgroundColors[TileGridAttrs.currentColorThemeIndex][1];

    // Write TileGridAttrs.currentColorThemeIndex to localStorage so that
    // the color theme persists on page reload etc.
    localStorage.setItem(
      "currentColorThemeIndex",
      TileGridAttrs.currentColorThemeIndex.toString()
    );
  }
}
