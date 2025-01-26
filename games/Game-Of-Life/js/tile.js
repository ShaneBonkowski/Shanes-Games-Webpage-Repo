import { GameObject } from "/games/Shared-Game-Assets/js/game-object.js";
import { Vec2 } from "../../Shared-Game-Assets/js/vector.js";
import { MoreMath } from "../../Shared-Game-Assets/js/more-math.js";
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

  onPointerUp(pointer) {
    if (
      this.canClick &&
      !this.scene.uiMenuOpen &&
      this.initialClickOnThisTile
    ) {
      // Toggle tile state only if the click started and ended on this tile
      this.onClickToggleTileState();

      // Autopause the game if specified to do such
      if (!this.scene.paused && TileGridAttrs.autoPauseOnClick) {
        this.scene.togglePause();
      }
    }

    this.initialClickOnThisTile = false; // Reset state
  }

  subscribeToEvents() {
    // Click must start and end on the same tile to count as a tile click...
    // This helps ensure dragging doesnt accidentally trigger tiles.
    this.graphic.on("pointerdown", (pointer) => {
      if (this.canClick && !this.scene.uiMenuOpen) {
        this.initialClickOnThisTile = true;
      }
    });

    this.graphic.on("pointerup", (pointer) => {
      this.onPointerUp(pointer);
    });
    this.graphic.on("pointercancel", (pointer) => {
      this.onPointerUp(pointer);
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
    this.initialClickOnThisTile = false;
    this.qtyLivingNeighbors = 0; // For storing qty of neighbors prior to update loop
    this.canClick = true;
    this.currentTileAnim = null;

    // Init the graphics
    let tileSpriteName = "Tile Blank";
    this.graphic = this.scene.add.sprite(0, 0, tileSpriteName); // spawn at 0,0 to start
    this.graphic.setOrigin(0.5, 0.5); // Set the anchor point to the center
    this.graphic.setInteractive(); // make it so this graphic can be clicked on etc.

    // Start in off and then change to off. This is so that any necc. vars are updated, without
    // the game thinking the state "changed" from ON to OFF for e.g.
    this.tileState = tileStates.OFF;
    this.changeState(tileStates.OFF);
  }

  resetTile() {
    this.qtyLivingNeighbors = 0;
    this.canClick = true;
    this.currentTileAnim = null;

    // Start in off and then change to off. This is so that any necc. vars are updated, without
    // the game thinking the state "changed" from ON to OFF for e.g.
    this.tileState = tileStates.OFF;
    this.changeState(tileStates.OFF);
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

    // Phone screen has larger
    if (window.innerWidth <= 600 || isPortrait) {
      size = window.innerHeight * 0.022;
    }

    // Scale according to zoom!
    size = size * this.scene.gestureManager.zoomOffset;

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
    let centerX = window.innerWidth / 2;
    let centerY = window.innerHeight / 2;
    let smallAmountForGrid = 0; // allows me to add small amount to create a buffer for the "grid"
    let isPortrait = window.matchMedia("(orientation: portrait)").matches;

    // for phones change the center location etc.
    if (window.innerWidth <= 600 || isPortrait) {
      centerY = window.innerHeight * 0.47;
      smallAmountForGrid = 0;
    }

    // Add in any drag offset, but clamp to within screen bounds
    centerX = MoreMath.clamp(
      centerX + this.scene.gestureManager.dragOffsetX,
      0,
      window.innerWidth
    );
    centerY = MoreMath.clamp(
      centerY + this.scene.gestureManager.dragOffsetY,
      0,
      window.innerHeight
    );

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

  getNeighbors(
    tiles,
    countCorners = true,
    countTorusNeighbors = false,
    onNeighborTile = null
  ) {
    let xWidth = tiles.length;
    let yWidth = tiles[0].length;
    let neighborTiles = [];

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
        neighborTiles.push(tiles[row][col]);

        if (onNeighborTile) {
          onNeighborTile(tiles[row][col]);
        }
      } else if (countTorusNeighbors) {
        // Wrap around the grid
        let wrappedRow = (row + xWidth) % xWidth;
        let wrappedCol = (col + yWidth) % yWidth;
        neighborTiles.push(tiles[wrappedRow][wrappedCol]);

        if (onNeighborTile) {
          onNeighborTile(tiles[wrappedRow][wrappedCol]);
        }
      }
    }

    return neighborTiles;
  }

  getQtyLivingNeighbors(
    tiles,
    countCorners = true,
    countTorusNeighbors = false
  ) {
    this.qtyLivingNeighbors = 0;

    this.getNeighbors(
      tiles,
      countCorners,
      countTorusNeighbors,
      this.updateLivingNeighborCount.bind(this)
    );
  }

  updateLivingNeighborCount(otherTile) {
    // If the neighbor is living, add to this tile's qty
    if (otherTile.tileState == tileStates.ON) {
      this.qtyLivingNeighbors++;
    }
  }

  handleConwayLifeIteration() {
    // Classic Conway's Game of Life rules:
    // - Live cell with fewer than 2 live neighbors dies (underpopulation).
    // - Live cell with more than 3 live neighbors dies (overpopulation).
    // - Live cell with 2 or 3 neighbors survives.
    // - Dead cell with 3 neighbors becomes alive (reproduction).
    if (this.tileState == tileStates.ON) {
      if (
        this.qtyLivingNeighbors < TileGridAttrs.golUnderpopulationCriteria ||
        this.qtyLivingNeighbors > TileGridAttrs.golOverpopulationCriteria
      ) {
        this.changeState(tileStates.OFF);
      }
    } else if (this.tileState == tileStates.OFF) {
      if (this.qtyLivingNeighbors == TileGridAttrs.golRepoductionCritera) {
        this.changeState(tileStates.ON);
      }
    }

    return this.tileState;
  }

  onClickToggleTileState() {
    // Change from on to off and vice versa
    if (this.tileState == tileStates.ON) {
      this.changeState(tileStates.OFF);
    } else {
      this.changeState(tileStates.ON);
    }
  }

  changeState(newState) {
    // Make sure no anim is playing prior to updating tile state!
    this.stopCurrentTileAnim();

    // If state changed, update population.
    if (this.tileState != newState) {
      if (newState == tileStates.ON) {
        this.scene.updatePopulation(this.scene.population + 1);
      } else {
        this.scene.updatePopulation(this.scene.population - 1);
      }
    }

    // Change the state
    this.tileState = newState;
    this.scene.livingTilespaceSet.updateLivingTilespace(this);
  }

  renderTileGraphics() {
    this.updateVisualAttrs();
    if (this.tileState == tileStates.OFF) {
      this.updateGraphic(tileColors.OFF);
    } else {
      this.updateGraphic(tileColors.ON);
    }
  }

  updateVisualAttrs() {
    this.updatePosition();
    this.updateSize();
  }

  playSpinAnim() {
    this.stopCurrentTileAnim();
    this.canClick = false;

    // Rotate the graphic 360 degrees
    this.currentTileAnim = this.scene.tweens.add({
      targets: this.graphic,
      angle: "+=360",
      duration: 220,
      ease: "Linear",
      repeat: 0, // Do not repeat
      onComplete: () => {
        this.stopCurrentTileAnim();
      },
    });
  }

  stopCurrentTileAnim() {
    // Stop the anim if there is one
    if (this.currentTileAnim) {
      this.currentTileAnim.stop();
      this.currentTileAnim = null;

      // Ensure attrs that may have changed in the anim are reset
      this.graphic.angle = 0;
      this.graphic.scale = 1;
      this.canClick = true;
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
