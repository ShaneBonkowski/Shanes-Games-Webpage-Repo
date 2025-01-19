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
      this.updateTileState();

      // If not paused, pause when a player clicks to interact with the tiles
      if (!this.scene.paused) {
        this.scene.togglePause();
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

    // Init the graphics
    let tileSpriteName = "Tile Blank";
    this.graphic = this.scene.add.sprite(0, 0, tileSpriteName); // spawn at 0,0 to start
    this.graphic.setOrigin(0.5, 0.5); // Set the anchor point to the center
    this.graphic.setInteractive(); // make it so this graphic can be clicked on etc.

    this.updateSize();
    this.updatePosition();
    this.changeState(tileStates.OFF); // this will update the graphic too
  }

  resetTile() {
    this.qtyLivingNeighbors = 0;

    this.updateSize();
    this.updatePosition();
    this.changeState(tileStates.OFF); // this will update the graphic too
  }

  updateSize() {
    this.size = this.calculateSize();
  }

  calculateSize() {
    // Calculate the size based on the screen width
    let size = window.innerHeight * 0.035;
    let isPortrait = window.matchMedia("(orientation: portrait)").matches;

    // Phone screen has larger boids
    if (window.innerWidth <= 600 || isPortrait) {
      size = window.innerHeight * 0.018;
    }

    return size;
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
    let smallAmountForGrid = 5; // add small amount to create a "grid"
    let isPortrait = window.matchMedia("(orientation: portrait)").matches;

    // for phones change the center location etc.
    if (this.scene.game.canvas.width <= 600 || isPortrait) {
      centerY = this.scene.game.canvas.height * 0.46;
      smallAmountForGrid = 6;
    }

    // Calculate the starting position for the bottom-left tile in the grid
    let tileSpacing = this.size + smallAmountForGrid;
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
    this.updateSize();
    this.updatePosition();
    this.updateGraphic();
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

  updateTileState() {
    if (this.tileState == tileStates.ON) {
      this.changeState(tileStates.OFF);
    } else {
      this.changeState(tileStates.ON);
    }
  }

  changeState(newState) {
    this.tileState = newState;
    this.updateColor();
  }

  updateColor() {
    if (this.tileState == tileStates.OFF) {
      this.updateGraphic(tileColors.OFF);
    } else {
      this.updateGraphic(tileColors.ON);
    }
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
