import { Vec2 } from "../../Shared-Game-Assets/js/vector.js";
import { more_math } from "../../Shared-Game-Assets/js/more_math.js";
import {
  tileStates,
  TilePatternAttrs,
  update_all_tiles_text,
} from "./tile-utils.js";
import { tiles } from "./main-game-scene.js";

export class Tile {
  constructor(scene, tileSpaceX, tileSpaceY, gridSize, tileState) {
    // Store some attributes about this tile
    this.scene = scene;
    this.tileSpaceCoord = new Vec2(tileSpaceX, tileSpaceY);
    this.gridSize = gridSize;
    this.tileState = tileState;

    // Create a graphics object for the tile
    this.graphic = null;
    this.text = null;
    this.initTile();

    // Init at provided location, and centered
    var spawnLoc = this.findTileLocFromTileSpace();
    this.graphic.x = spawnLoc.x;
    this.graphic.y = spawnLoc.y;

    this.addText();

    // Subscribe to relevant events
    this.subscribeToEvents();
  }

  initTile() {
    this.size = this.calculateTileSize();
    this.graphic = this.scene.add.sprite(0, 0, "Tile");
    this.graphic.setInteractive(); // make it so this graphic can be clicked on etc.
    this.updateTileColor();

    // Set the scale and origin
    this.graphic.setScale(this.size);
    this.graphic.setOrigin(0.5, 0.5); // Set the anchor point to the center

    // TODO: add particles or something when new is spawned in
    // ...
  }

  addText() {
    // Add text to the top right corner of the graphic
    this.text = this.scene.add.text(
      this.graphic.x + this.graphic.displayWidth / 2, // Position relative to graphic's top right corner
      this.graphic.y - this.graphic.displayHeight / 2, // Position relative to graphic's top right corner
      "1",
      { fontFamily: "Arial", fontSize: 16, color: "#000000" }
    );
    this.text.setOrigin(1, 0); // Origin on the top right corner of the text
    this.text.setDepth(10); // Ensure the text appears on top of the graphic
    this.hideText();
  }

  updateTextPos() {
    this.text.setPosition(
      this.graphic.x + this.graphic.displayWidth / 2,
      this.graphic.y - this.graphic.displayHeight / 2
    );
  }

  updateTextContent(text_content) {
    this.text.text = text_content;
  }

  hideText() {
    this.text.setVisible(false);
  }

  showText() {
    this.text.setVisible(true);
  }

  destroy() {
    // Remove the sprite from the scene
    this.graphic.destroy();
    this.graphic = null;

    // Remove text from the scene
    this.text.destroy();
    this.text = null;

    // TODO: add particles or something when destroyed
    // ...
  }

  updateTileColor() {
    if (this.tileState === tileStates.RED) {
      this.graphic.setTint(0xff0000); // RED color
    } else if (this.tileState === tileStates.BLUE) {
      this.graphic.setTint(0x0000ff); // BLUE color
    } else if (this.tileState === tileStates.GREEN) {
      this.graphic.setTint(0x00ff00); // GREEN color
    } else {
      console.log(`ERROR: tileState ${this.tileState} is not an expected one`);
    }
  }

  updateTileState(updateNeighbors = true) {
    // Advance forward one tile state
    let nextState = this.tileState + 1;

    // If the next state exceeds the maximum, loop back to the first state
    if (nextState > TilePatternAttrs.qtyStatesBeingUsed - 1) {
      nextState = 0;
    }

    // Update this tile
    this.tileState = nextState;
    this.updateTileColor();

    // Notify neighbors to update
    if (updateNeighbors) {
      // left neighbor
      if (this.tileSpaceCoord.x - 1 >= 0) {
        tiles[Math.round(this.tileSpaceCoord.x - 1)][
          Math.round(this.tileSpaceCoord.y)
        ].updateTileState(false); // do not let this one update neighbors since only the first clicked on should
      }
      // right
      if (this.tileSpaceCoord.x + 1 < this.gridSize) {
        tiles[Math.round(this.tileSpaceCoord.x + 1)][
          Math.round(this.tileSpaceCoord.y)
        ].updateTileState(false); // do not let this one update neighbors since only the first clicked on should
      }
      // below
      if (this.tileSpaceCoord.y - 1 >= 0) {
        tiles[Math.round(this.tileSpaceCoord.x)][
          Math.round(this.tileSpaceCoord.y - 1)
        ].updateTileState(false); // do not let this one update neighbors since only the first clicked on should
      }
      // above
      if (this.tileSpaceCoord.y + 1 < this.gridSize) {
        tiles[Math.round(this.tileSpaceCoord.x)][
          Math.round(this.tileSpaceCoord.y + 1)
        ].updateTileState(false); // do not let this one update neighbors since only the first clicked on should
      }
    }

    // Update text of all tiles
    update_all_tiles_text(tiles, Math.sqrt(TilePatternAttrs.tileCount));
  }

  findTileLocFromTileSpace() {
    const centerX = this.scene.game.canvas.width / 2;
    const centerY = this.scene.game.canvas.height / 2;
    let tileSpacing = this.scene.game.canvas.width / 10;

    // Calculate the starting position for the top-left tile in the grid
    let startGridX, startGridY;

    if (this.gridSize % 2 === 0) {
      // Even grid size
      startGridX = centerX - (this.gridSize / 2 - 0.5) * tileSpacing;
      startGridY = centerY - (this.gridSize / 2 - 0.5) * tileSpacing;
    } else {
      // Odd grid size
      startGridX = centerX - ((this.gridSize - 1) / 2) * tileSpacing;
      startGridY = centerY - ((this.gridSize - 1) / 2) * tileSpacing;
    }

    // Calculate the position of the current tile in the grid
    var tileX = startGridX + this.tileSpaceCoord.x * tileSpacing;
    var tileY = startGridY + this.tileSpaceCoord.y * tileSpacing;

    return new Vec2(tileX, tileY);
  }

  calculateTileSize() {
    // Calculate the tile size based on the screen width
    var screenWidth = window.innerWidth;
    var tileSize = screenWidth * 0.00009;

    // Phone screen has larger tile
    if (screenWidth <= 600) {
      tileSize = screenWidth * 0.00026;
    }

    return tileSize;
  }

  handleWindowResize() {
    // Reinitialize the tile and its graphic on resize
    this.size = this.calculateTileSize();
    this.graphic.setScale(this.size);

    // Init at provided location, and centered
    var spawnLoc = this.findTileLocFromTileSpace();
    this.graphic.x = spawnLoc.x;
    this.graphic.y = spawnLoc.y;

    // Update text
    this.updateTextPos();
  }

  subscribeToEvents() {
    // Add an event listener for pointer down events using phaser's event system
    this.graphic.on("pointerdown", () => {
      // updateTileState when the pointer clicks down on the tile
      this.updateTileState();
      console.log("clicked tile");
    });
  }
}
