import { Tile } from "/games/Game-Of-Life/js/tile.js";

export const tileStates = {
  ON: 1,
  OFF: 0,
};

export const tileGridWidthPhone = 15;
export const tileGridHeightPhone = 30;
export const tileGridWidthComputer = 40;
export const tileGridHeightComputer = 15;

export const TileGridAttrs = {
  updateInterval: 200, // ms
  tileGridWidth: tileGridWidthComputer,
  tileGridHeight: tileGridHeightComputer,
};

export const TileAndBackgroundColors = [
  // Each sub-array contains [ON color, OFF color, background color]
  [0xffffff, 0x808080, 0x000000], // White on grey, black background
  [0x00ff00, 0x008000, 0x808080], // Green on dark green, grey background
  [0xffff00, 0x808000, 0x000000], // Yellow on olive, black background
  [0x800080, 0xff69b4, 0xffc0cb], // Purple on hot pink, pink background
  [0xffa500, 0xcd853f, 0x808080], // Orange on peru, grey background
  [0x00ffff, 0x008b8b, 0x00008b], // Cyan on dark cyan, dark blue background
  [0xff00ff, 0x8b008b, 0x000080], // Magenta on dark magenta, navy background
  [0xffffff, 0x2e8b57, 0x006400], // White on sea green, dark green background
  [0x000000, 0xa9a9a9, 0xd3d3d3], // Black on dark grey, light grey background
];

export const tileColors = {
  ON: TileAndBackgroundColors[0][0],
  OFF: TileAndBackgroundColors[0][1],
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
