import { Tile } from "/games/Game-Of-Life/js/tile.js";

export const tileStates = {
  OFF: 0,
  ON: 1,
};

export const tileColors = {
  OFF: 0xffffff, // init to White
  ON: 0xffa500, // init to Orange
};

export const TileGridAttrs = {
  updateInterval: 5000, // ms
  tileGridWidth: 20, // initial values
  tileGridHeight: 10,
};

export function instantiateTiles(scene) {
  // Allows for async behavior
  return new Promise((resolve, reject) => {
    let tiles = []; // 2D array

    if (TileGridAttrs.tileGridWidth > 0 && TileGridAttrs.tileGridHeight > 0) {
      tiles = createTilegrid(scene);
      resolve(tiles);
    } else {
      console.log(
        `Not spawning in tiles, tileCount of ${TilePatternAttrs.tileCount} is <= 0`
      );
      resolve(tiles);
    }
  });
}

function createTilegrid(scene) {
  let tiles = []; // 2D array

  for (let i = 0; i < TileGridAttrs.tileGridWidth; i++) {
    tiles[i] = []; // Initialize an array for the current row
    for (let j = 0; j < TileGridAttrs.tileGridHeight; j++) {
      let tile = new Tile(scene, i, j);
      tiles[i][j] = tile;
    }
  }

  return tiles;
}
