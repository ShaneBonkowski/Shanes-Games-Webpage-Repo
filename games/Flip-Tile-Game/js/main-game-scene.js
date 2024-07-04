/**
 * @module TileMainGameScene
 *
 * @author Shane Bonkowski
 */

import {
  instantiateTiles,
  TilePatternAttrs,
  sharedTileAttrs,
  difficulty,
  checkIfTileGridSolved,
  tilesToTilespaceMatrix,
  customEvents,
  scoring,
} from "./tile-utils.js";
import { setZOrderForMainGameElements } from "./zOrdering.js";
import { Physics } from "../../Shared-Game-Assets/js/physics.js";
import { more_math } from "../../Shared-Game-Assets/js/more_math.js";
import { ui_vars } from "./init-ui.js";

export const intendedNewTileAttrs = {
  tileCount: 9, // initial values
  seed: more_math.getRandomInt(1, 10000), // UNSEEDED getRandomInt func from more_math isnstead of Seedable_Random
  qtyStatesBeingUsed: 2, // init
  difficultyLevel: difficulty.EASY,
};

export const tiles = [];

// Export so other scripts can access this
export class MainGameScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainGameScene" });
    this.gameStarted = false;
    this.isInteracting = false; // is the  player actively interacting with the game?
    this.canClickTile = true; // can the player click a tile?
    this.disableClickID = 0;
    this.uiMenuOpen = false;
    this.score = 0;
    this.revealedAtLeastOnceThisLevel = false;
  }

  preload() {
    // Preload assets if needed
    this.load.image("Tile Blue", "./webps/Flip_Tile_Blue.webp");
    this.load.image("Tile Red", "./webps/Flip_Tile_Red.webp");
    this.load.image("Tile Green", "./webps/Flip_Tile_Green.webp");
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

  tryToDisableClick() {
    if (this.canClickTile == true) {
      this.canClickTile = false;
    }
  }

  tryToEnableClick() {
    // Can only re-enable click if all tile's animations are done playing
    let canEnable = true;
    let finishedSearch = false;

    // Play celebration anim for all tiles
    for (let row = 0; row < tiles.length; row++) {
      for (let col = 0; col < tiles[row].length; col++) {
        let tile = tiles[row][col];

        // Make sure tile exists
        if (tile) {
          // if any tile's anim is playing, you cannot enable clicking
          if (tile.animationPlaying) {
            canEnable = false;
            finishedSearch = true;
            break;
          }
        }
      }

      if (finishedSearch) {
        break;
      }
    }

    if (canEnable) {
      this.canClickTile = true;
    }

    return canEnable;
  }

  reset_reveal_solution_toggle() {
    const toggleInput = document.querySelector(".flip-tile-sol-toggle-input");

    if (toggleInput) {
      toggleInput.checked = false;
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
    instantiateTiles(this).then((tiles_returned) => {
      // Push new tiles into tiles array.
      // We destroy tiles before this, so its safe
      // to assume tiles is empty []
      tiles_returned.forEach((tile) => tiles.push(tile));
    });
    console.log("reset");

    this.reset_reveal_solution_toggle();
  }

  newTilePattern(firstTimeCalling = false) {
    // Make sure no tiles exist to start
    this.destroyAllTiles();

    // Update to a new tile pattern in a grid as a Promise (so that we can run this async)
    for (let i = 1; i <= ui_vars.numCheckboxes; i++) {
      let className = `.flip-tile-toggle-input-${i}`;
      const checkbox = document.querySelector(className);
      if (checkbox.checked) {
        if (i == 1) {
          this.updateIntendedDifficuly(difficulty.EASY);
        } else if (i == 2) {
          this.updateIntendedDifficuly(difficulty.HARD);
        } else if (i == 3) {
          this.updateIntendedDifficuly(difficulty.EXPERT);
        } else {
          this.updateIntendedDifficuly(TilePatternAttrs.difficulty);
        }
      }
    }

    this.updateIntendedSeed();
    this.updateActualTilePatternAttrs();

    instantiateTiles(this).then((tiles_returned) => {
      // Push new tiles into tiles array.
      // We destroy tiles before this, so its safe
      // to assume tiles is empty []
      tiles_returned.forEach((tile) => tiles.push(tile));
    });

    if (firstTimeCalling) {
      // After everything is loaded in, we can begin the game
      this.gameStarted = true;
    }

    // Reset solution revealed info for this level
    this.reset_reveal_solution_toggle();
    this.revealedAtLeastOnceThisLevel = false;
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
    for (let row = 0; row < tiles.length; row++) {
      for (let col = 0; col < tiles[row].length; col++) {
        tiles[row][col].destroy();
      }
    }
    tiles.length = 0; // Clear the tiles array
  }

  nextPuzzleIfSolved() {
    let solved = checkIfTileGridSolved(tilesToTilespaceMatrix(tiles));

    if (solved) {
      // Play celebration anim for all tiles
      for (let row = 0; row < tiles.length; row++) {
        for (let col = 0; col < tiles[row].length; col++) {
          let tile = tiles[row][col];

          // Make sure tile exists
          if (tile) {
            tile.celebrateTileAnim();
          }
        }
      }

      // Update score..
      // Only give score if solution is not revealed
      const toggleInput = document.querySelector(".flip-tile-sol-toggle-input");

      if (
        toggleInput &&
        !toggleInput.checked &&
        !this.revealedAtLeastOnceThisLevel
      ) {
        document.dispatchEvent(customEvents.scoreUpdateEvent);
        if (TilePatternAttrs.difficultyLevel == difficulty.EASY) {
          this.score += scoring.EASY;
        } else if (TilePatternAttrs.difficultyLevel == difficulty.HARD) {
          this.score += scoring.HARD;
        } else if (TilePatternAttrs.difficultyLevel == difficulty.EXPERT) {
          this.score += scoring.EXPERT;
        } else {
          console.log("ERROR: difficulty not listed");
        }
      }

      // After x seconds, reveal the next puzzle
      setTimeout(
        function () {
          this.newTilePattern();
        }.bind(this),
        sharedTileAttrs.solvedTimer * 1.1 * 1000 // slightly longer than tile celebration anim
      );
    }
  }

  // Disable scrolling
  disableScroll() {
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
    // Event listener for ui menu open / closed
    document.addEventListener(
      "uiMenuOpen",
      function (event) {
        if (this.uiMenuOpen == false) {
          this.uiMenuOpen = true;
        }
      }.bind(this)
    ); // Bind 'this' to refer to the class instance
    document.addEventListener(
      "uiMenuClosed",
      function (event) {
        if (this.uiMenuOpen == true) {
          this.uiMenuOpen = false;
        }
      }.bind(this)
    ); // Bind 'this' to refer to the class instance

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
}
