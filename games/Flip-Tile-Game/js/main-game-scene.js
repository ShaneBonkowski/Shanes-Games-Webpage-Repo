import {
  instantiateTiles,
  TilePatternAttrs,
  sharedTileAttrs,
  difficulty,
  checkIfTileGridSolved,
  tilesToTilespaceMatrix,
  tileGridEventNames,
  scoring,
} from "./tile-utils.js";
import { setZOrderForMainGameElements } from "./z-ordering.js";
import { Physics } from "../../Shared-Game-Assets/js/physics.js";
import { more_math } from "../../Shared-Game-Assets/js/more-math.js";
import { ui_vars } from "./init-ui.js";
import { showMessage } from "../../Shared-Game-Assets/js/phaser-message.js";
import { Generic2DGameScene } from "../../Shared-Game-Assets/js/game-scene-2d.js";
import { genericGameEventNames } from "/games/Shared-Game-Assets/js/game-scene-2d.js";

export const intendedNewTileAttrs = {
  tileCount: 9, // initial values
  seed: more_math.getRandomInt(1, 10000), // UNSEEDED getRandomInt func from more-math instead of seedable-random
  qtyStatesBeingUsed: 2, // init
  difficultyLevel: difficulty.EASY,
};

export const tiles = [];

// Export so other scripts can access this
export class MainGameScene extends Generic2DGameScene {
  constructor() {
    super({ key: "MainGameScene" });
    this.canClickTile = true; // can the player click a tile?
    this.disableClickID = 0;
    this.score = 0;
    this.revealedAtLeastOnceThisLevel = false;

    // Bind "this" to refer to the scene for necc. functions
    this.onClickMuteSound = this.onClickMuteSound.bind(this);
  }

  preload() {
    // Preload assets if needed
    this.load.image("Tile Blue", "./webps/Flip-Tile-Blue.webp");
    this.load.image("Tile Red", "./webps/Flip-Tile-Red.webp");
    this.load.image("Tile Green", "./webps/Flip-Tile-Green.webp");

    // Audio
    this.load.audio("Button Click", [
      "/games/Shared-Game-Assets/audio/ui-button-click.mp3",
    ]);
    this.load.audio("Success", ["/games/Shared-Game-Assets/audio/success.mp3"]);
    this.load.audio("Tile Spin", [
      "/games/Shared-Game-Assets/audio/stone-push.mp3",
    ]);
  }

  create() {
    // Set the Z order of all elements
    setZOrderForMainGameElements(this.game);
    this.initSounds();

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

    // Final setup for main game
    this.subscribeToEvents();
    this.disableScroll();

    // Spawn in tiles in a grid as a Promise (so that we can run this async), and then
    // when that promise is fufilled, we can move on to other init logic
    this.newTilePattern(true); // first time calling this
  }

  update(time, delta) {
    if (this.gameStarted) {
      // Handle the graphic updates
      for (let row = 0; row < tiles.length; row++) {
        for (let col = 0; col < tiles[row].length; col++) {
          let tile = tiles[row][col];
          tile.updateGraphic();
        }
      }
    }
  }

  // Sounds
  initSounds() {
    // UI sounds
    let uiButtonClickSound = this.sound.add("Button Click");
    uiButtonClickSound.setVolume(0.1);
    uiButtonClickSound.mute = true; // mute to start
    this.sound_array.push({ sound: uiButtonClickSound, type: "UI" });

    let successSound = this.sound.add("Success");
    successSound.setVolume(0.15);
    successSound.mute = true; // mute to start
    this.sound_array.push({ sound: successSound, type: "UI" });

    let tileSpinSound = this.sound.add("Tile Spin");
    tileSpinSound.setVolume(1.0);
    tileSpinSound.mute = true; // mute to start
    this.sound_array.push({ sound: tileSpinSound, type: "UI" });
  }

  onClickMuteSound() {
    // Toggle mute
    this.audioMuted = !this.audioMuted;
    this.toggleMuteAllAudio();

    if (!this.audioMuted) {
      showMessage(this, "May need to turn off silent mode to hear audio!");
    }

    // Update icon of mute button based on state
    const muteSoundButtonContainer = document.querySelector(
      ".mute-button-container"
    );
    const muteSoundButton =
      muteSoundButtonContainer.querySelector(".fliptile-button");
    const muteSoundButtonIcon = muteSoundButton.querySelector(".fas");

    muteSoundButtonIcon.classList.remove("fa-volume-xmark", "fa-volume-high");
    if (!this.audioMuted) {
      muteSoundButtonIcon.classList.add("fa-volume-high");
    } else {
      muteSoundButtonIcon.classList.add("fa-volume-xmark");
    }

    // Play sound!
    this.playDesiredSound("Button Click");
  }

  // Enable / disable click
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
        document.dispatchEvent(new Event(tileGridEventNames.onScoreChange));
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
      genericGameEventNames.uiMenuOpen,
      function (event) {
        if (this.uiMenuOpen == false) {
          this.uiMenuOpen = true;

          // Play sound!
          this.playDesiredSound("Button Click");
        }
      }.bind(this)
    ); // Bind 'this' to refer to the class instance
    document.addEventListener(
      genericGameEventNames.uiMenuClosed,
      function (event) {
        if (this.uiMenuOpen == true) {
          this.uiMenuOpen = false;

          // Play sound!
          this.playDesiredSound("Button Click");
        }
      }.bind(this)
    ); // Bind 'this' to refer to the class instance

    // Mute when event occurs
    document.addEventListener(
      genericGameEventNames.mute,
      function (event) {
        this.onClickMuteSound();
      }.bind(this)
    ); // Bind 'this' to refer to the class instance

    // When we ask to change the tile grid, spawn a new tile pattern
    document.addEventListener(
      tileGridEventNames.onTilegridChange,
      function (event) {
        this.newTilePattern();

        // Play sound!
        this.playDesiredSound("Button Click");
      }.bind(this)
    );

    // When we ask to change the tile grid, spawn a new tile pattern
    document.addEventListener(
      tileGridEventNames.onTilegridReset,
      function (event) {
        this.resetCurrentTilePattern();

        // Play sound!
        this.playDesiredSound("Button Click");
      }.bind(this)
    );

    // When solved play a sound!
    document.addEventListener(
      tileGridEventNames.onScoreChange,
      function (event) {
        // Play sound!
        this.playDesiredSound("Success");
      }.bind(this)
    );

    // When solved play a sound!
    document.addEventListener(
      tileGridEventNames.onTileSpin,
      function (event) {
        // Play sound!
        this.playDesiredSound("Tile Spin");
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
