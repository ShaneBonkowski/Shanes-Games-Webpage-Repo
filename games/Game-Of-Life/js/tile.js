import { GameObject } from "/games/Shared-Game-Assets/js/game-object.js";
import { Vec2 } from "../../Shared-Game-Assets/js/vector.js";
import { tileStates, TileGridAttrs, tileColors } from "./tile-utils.js";

export class Tile extends GameObject {
  constructor(scene, gridX, gridY) {
    super(
      "Tile",
      // init size just so its set, will reset to something else later
      new Vec2(1, 1),
      // Add physicsBody2D (even though it doesnt "move", it still has a position
      // when screen resizes occur etc.)
      true,
      false
    );

    this.scene = scene;

    this.graphic = null;
    this.gridSpaceLoc = new Vec2(gridX, gridY);
    this.initTile();
    this.subscribeToEvents();
  }

  subscribeToEvents() {
    // Add an event listener for pointer down events using phaser's event system
    this.graphic.on("pointerdown", () => {
      // Cannot click a tile if ui menu is open!
      if (this.canClick && !this.scene.uiMenuOpen) {
        this.onClickToggleTileState();

        // If not paused, pause when a player clicks to interact with the tiles.
        // ONLY IF TileGridAttrs.autoPauseOnClick is true!
        if (!this.scene.paused && TileGridAttrs.autoPauseOnClick) {
          this.scene.togglePause();
        }
      }
    });

    // Update mouse on hover
    this.graphic.on("pointerover", () => {
      this.scene.game.canvas.style.cursor = "pointer";
    });
    this.graphic.on("pointerout", () => {
      this.scene.game.canvas.style.cursor = "default";
    });
  }

  initTile() {
    this.qtyLivingNeighbors = 0; // For storing qty of neighbors prior to update loop
    this.canClick = true;
    this.currentTileAnim = null;

    // Init the graphics
    let tileSpriteName = "Tile Blank";
    this.graphic = this.scene.add.sprite(0, 0, tileSpriteName); // spawn at 0,0 to start
    this.graphic.setOrigin(0.5, 0.5); // Set the anchor point to the center
    this.graphic.setInteractive(); // make it so this graphic can be clicked on etc.

    this.changeState(tileStates.OFF); // this will update the graphic, position, etc. too
  }

  resetTile() {
    this.qtyLivingNeighbors = 0;
    this.canClick = true;
    this.currentTileAnim = null;

    this.changeState(tileStates.OFF); // this will update the graphic too
  }

  updateSize() {
    this.size = this.calculateSize();
  }

  calculateSize() {
    let size = this.calculateDefaultSize();

    // Add extra for a tile in the ON state
    if (this.tileState == tileStates.ON) {
      size = this.calculateMaxSize(size);
    }

    return size;
  }

  calculateDefaultSize() {
    // Calculate the size based on the screen width
    let size = window.innerHeight * 0.035;
    let isPortrait = window.matchMedia("(orientation: portrait)").matches;

    // Phone screen has larger boids
    if (window.innerWidth <= 600 || isPortrait) {
      size = window.innerHeight * 0.018;
    }

    return size;
  }

  calculateMaxSize(size) {
    // "max" size is just the size of an ON state tile since it is larger
    return size * 1.15;
  }

  updatePosition() {
    let newPosition = this.calculateTilePosition();
    this.physicsBody2D.position.x = newPosition.x;
    this.physicsBody2D.position.y = newPosition.y;
  }

  calculateTilePosition() {
    // Get the tile location from the grid location and screen size
    let centerX = this.scene.game.canvas.width / 2;
    let centerY = this.scene.game.canvas.height / 2;
    let smallAmountForGrid = 0; // allows me to add small amount to create a buffer for the "grid"
    let isPortrait = window.matchMedia("(orientation: portrait)").matches;

    // for phones change the center location etc.
    if (this.scene.game.canvas.width <= 600 || isPortrait) {
      centerY = this.scene.game.canvas.height * 0.46;
      smallAmountForGrid = 0;
    }

    // Calculate the starting position for the bottom-left tile in the grid
    let maxSize = this.calculateMaxSize(this.calculateDefaultSize());
    let tileSpacing = maxSize + smallAmountForGrid;
    let startGridX, startGridY;

    if (TileGridAttrs.tileGridWidth % 2 === 0) {
      // Even grid size
      startGridX =
        centerX - (TileGridAttrs.tileGridWidth / 2 - 0.5) * tileSpacing;
    } else {
      // Odd grid size
      startGridX =
        centerX - ((TileGridAttrs.tileGridWidth - 1) / 2) * tileSpacing;
    }

    if (TileGridAttrs.tileGridHeight % 2 === 0) {
      // Even grid size
      startGridY =
        centerY + (TileGridAttrs.tileGridHeight / 2 - 0.5) * tileSpacing;
    } else {
      // Odd grid size
      startGridY =
        centerY + ((TileGridAttrs.tileGridHeight - 1) / 2) * tileSpacing;
    }

    // Calculate the position of the current tile in the grid
    let tileX = startGridX + this.gridSpaceLoc.x * tileSpacing;
    let tileY = startGridY - this.gridSpaceLoc.y * tileSpacing;

    return new Vec2(tileX, tileY);
  }

  handleWindowResize() {
    // Reinitialize the object and graphic on resize
    this.updateVisuals();
  }

  getQtyLivingNeighbors(
    tiles,
    countCorners = true,
    countTorusNeighbors = false
  ) {
    let xWidth = tiles.length;
    let yWidth = tiles[0].length;
    this.qtyLivingNeighbors = 0;

    // Define the directions for the 8 possible neighbors
    const directions = countCorners
      ? [
          [-1, -1],
          [-1, 0],
          [-1, 1],
          [0, -1],
          [0, 1],
          [1, -1],
          [1, 0],
          [1, 1],
        ]
      : [
          [-1, 0],
          [1, 0],
          [0, -1],
          [0, 1],
        ];

    let thisRow = Math.floor(this.gridSpaceLoc.x);
    let thisCol = Math.floor(this.gridSpaceLoc.y);

    for (const [dx, dy] of directions) {
      let row = thisRow + dx;
      let col = thisCol + dy;

      if (row >= 0 && row < xWidth && col >= 0 && col < yWidth) {
        if (tiles[row][col].tileState == tileStates.ON) {
          this.qtyLivingNeighbors++;
        }
      } else if (countTorusNeighbors) {
        // Wrap around the grid
        let wrappedRow = (row + xWidth) % xWidth;
        let wrappedCol = (col + yWidth) % yWidth;
        if (tiles[wrappedRow][wrappedCol].tileState == tileStates.ON) {
          this.qtyLivingNeighbors++;
        }
      }
    }
  }

  handleConwayLifeIteration() {
    // Classic Conway's Game of Life rules:
    // Live cell with 2 or 3 neighbors survives.
    // i.e., a live cell with fewer than 2 live neighbors dies (underpopulation),
    // and a live cell with more than 3 live neighbors dies (overpopulation).
    if (this.tileState == tileStates.ON) {
      if (this.qtyLivingNeighbors < 2 || this.qtyLivingNeighbors > 3) {
        this.changeState(tileStates.OFF);
      }
    } else if (this.tileState == tileStates.OFF) {
      // Dead cell with 3 neighbors becomes alive (reproduction).
      if (this.qtyLivingNeighbors == 3) {
        this.changeState(tileStates.ON);
      }
    }
  }

  onClickToggleTileState() {
    // Change from on to off and vice versa
    if (this.tileState == tileStates.ON) {
      this.changeState(tileStates.OFF);
    } else {
      this.changeState(tileStates.ON);
    }

    // When a user clicks, update the population with the new state
    if (this.tileState == tileStates.ON) {
      this.scene.updatePopulation(this.scene.population + 1);
    } else {
      this.scene.updatePopulation(this.scene.population - 1);
    }
  }

  changeState(newState) {
    // Make sure no anim is playing prior to updating tile state!
    this.stopCurrentTileAnim();

    // Change the state
    this.tileState = newState;
    this.updateVisuals();
  }

  updateVisuals() {
    this.updateSize();
    this.updatePosition();
    this.updateColor();
  }

  updateColor() {
    if (this.tileState == tileStates.OFF) {
      this.updateGraphic(tileColors.OFF);
    } else {
      this.updateGraphic(tileColors.ON);
    }
  }

  playSpinAnim() {
    // cannot click during animation
    this.canClick = false;

    // Rotate the graphic 360 degrees
    this.currentTileAnim = this.scene.tweens.add({
      targets: this.graphic,
      angle: "+=360",
      // Must be slower than update interval! so it doesnt bleed over
      duration: TileGridAttrs.updateInterval * 0.8,
      ease: "Linear",
      repeat: 0, // Do not repeat
      onComplete: () => {
        this.stopCurrentTileAnim();
      },
    });
  }

  stopCurrentTileAnim() {
    if (this.currentTileAnim) {
      this.currentTileAnim.stop();
      this.currentTileAnim = null;
    }

    this.canClick = true;
  }

  destroy() {
    // Remove the sprite from the scene
    this.graphic.destroy();
    this.graphic = null;

    // // Remove text from the scene
    // this.text.destroy();
    // this.text = null;

    // TODO: add particles or something when destroyed?
    // ...
  }
}
