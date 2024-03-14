import { Tile } from "./Tile.js";
import { more_math } from "../../Shared-Game-Assets/js/more_math.js";
import { Matrix } from "../../Shared-Game-Assets/js/matrix.js";
import {
  SeededRandom,
  randomType,
} from "../../Shared-Game-Assets/js/Seedable_Random.js";
import { intendedNewTileAttrs } from "./main-game-scene.js";

export const tileStates = {
  RED: 0,
  BLUE: 1,
  GREEN: 2,
};

export const difficulty = {
  EASY: 0,
  HARD: 1,
  EXPERT: 2,
};

export var TilePatternAttrs = {
  tileCount: 9, // initial values
  seed: more_math.getRandomInt(1, 10000), // UNSEEDED getRandomInt func from more_math isnstead of Seedable_Random
  qtyStatesBeingUsed: 2, // init
  difficultyLevel: difficulty.EASY,
};

export const customEvents = {
  tileUpdateEvent: new Event("onTileUpdate"),
  tileGridChangeEvent: new Event("onTilegridChange"),
  tileGridResetEvent: new Event("onTilegridReset"),
};

// Pre-computed using \Python-Utils\matInvMod.py, calling python .\matInvMod.py from terminal
export const inverseToggleMatrixLookupMod2 = {
  TWO_BY_TWO: [
    [1, 1, 1, 0],
    [1, 1, 0, 1],
    [1, 0, 1, 1],
    [0, 1, 1, 1],
  ],
  THREE_BY_THREE: [
    [1, 0, 1, 0, 0, 1, 1, 1, 0],
    [0, 0, 0, 0, 1, 0, 1, 1, 1],
    [1, 0, 1, 1, 0, 0, 0, 1, 1],
    [0, 0, 1, 0, 1, 1, 0, 0, 1],
    [0, 1, 0, 1, 1, 1, 0, 1, 0],
    [1, 0, 0, 1, 1, 0, 1, 0, 0],
    [1, 1, 0, 0, 0, 1, 1, 0, 1],
    [1, 1, 1, 0, 1, 0, 0, 0, 0],
    [0, 1, 1, 1, 0, 0, 1, 0, 1],
  ],
};

export const inverseToggleMatrixLookupMod3 = {
  THREE_BY_THREE: [
    [2, 1, 2, 1, 1, 0, 2, 0, 0],
    [1, 1, 1, 1, 1, 1, 0, 2, 0],
    [2, 1, 2, 0, 1, 1, 0, 0, 2],
    [1, 1, 0, 1, 1, 2, 1, 1, 0],
    [1, 1, 1, 1, 0, 1, 1, 1, 1],
    [0, 1, 1, 2, 1, 1, 0, 1, 1],
    [2, 0, 0, 1, 1, 0, 2, 1, 2],
    [0, 2, 0, 1, 1, 1, 1, 1, 1],
    [0, 0, 2, 0, 1, 1, 2, 1, 2],
  ],
};

var seededRandom = 0; // init

export function instantiateTiles(scene) {
  // Allows for async behavior
  return new Promise((resolve, reject) => {
    seededRandom = new SeededRandom(TilePatternAttrs.seed);

    let tiles = []; // 2D array

    // Spawn in tiles in a grid.. tileCount can only be a square
    if (Math.sqrt(TilePatternAttrs.tileCount) % 1 === 0) {
      // gridSize is the number of tiles per row and column in the grid (side length of the box the tiles make)
      const gridSize = Math.sqrt(TilePatternAttrs.tileCount);

      // Try to find a solvable config of tiles
      tiles = findSolvableTileGrid(gridSize, scene);

      // Resolve the Promise with the array of tiles
      resolve(tiles);
    } else {
      console.log(
        `Not spawning in tiles, tileCount of ${TilePatternAttrs.tileCount} is not an odd square as desired`
      );
      // Resolve the Promise with the array of EMPTY tiles
      resolve(tiles);
    }
  });
}

function tilesToTilespaceMatrix(tiles) {
  let tileSpace = [];
  for (let row = 0; row < tiles.length; row++) {
    tileSpace[row] = [];
    for (let col = 0; col < tiles[row].length; col++) {
      tileSpace[row][col] = tiles[row][col].tileState;
    }
  }

  return new Matrix(tileSpace);
}

function tileSpaceMatrixToTiles(tileSpaceMatrix, gridSize, scene) {
  let tiles = []; // 2D array

  for (let i = 0; i < tileSpaceMatrix.rows; i++) {
    tiles[i] = []; // Initialize an array for the current row
    for (let j = 0; j < tileSpaceMatrix.cols; j++) {
      // Place tile and add it to list 2D
      var tileState = tileSpaceMatrix.mat[i][j];
      let tile = new Tile(scene, i, j, gridSize, tileState);
      tiles[i][j] = tile; // store in 2D array
    }
  }

  return tiles;
}

function findSolvableTileGrid(gridSize, scene) {
  // We can figure out what series of inputs are required in order to solve a given tileSpace using this function:
  // b = Ax + p
  // b: finalConfiguration
  // A: matrix
  // x: strategy
  // p: initialConfiguration

  // Thus, we can solve for strategy by doing:
  // A^-1 * (b - p) = x

  // E.g. given a tileSpace of:
  // 1 0
  // 0 1

  // We do matrix math to solve for flattenedStrategyMatrix to figure out which tiles we need to flip

  // The following should hold true:
  // toggleMatrix * flattenedStrategyMatrix + flattenedTileSpaceMatrix = flattenedsolvedMatrix
  //  1, 1, 1, 0              1                 0                          1
  //  1, 1, 0, 1  *           0             +   1                      =   1
  //  1, 0, 1, 1              0                 1                          1
  //  0, 1, 1, 1              1                 0                          1

  // So our goal is to solve for flattenedStrategyMatrix.
  var solveableTileConfigFound = false;
  var tileSpaceMatrix = null;
  var strategyMatrix = null;
  while (!solveableTileConfigFound) {
    tileSpaceMatrix = createRandomTileSpaceMatrix(gridSize);
    strategyMatrix = solveTileSpaceMatrix(tileSpaceMatrix, gridSize);

    solveableTileConfigFound = isTileConfigSolvableAndInterestingEnough(
      tileSpaceMatrix,
      strategyMatrix
    );
  }

  // Create tiles
  var Tiles = tileSpaceMatrixToTiles(tileSpaceMatrix, gridSize, scene);

  // Update the text of the tiles with the strategyMatrix
  update_all_tiles_text(Tiles, gridSize, strategyMatrix);

  return Tiles;
}

export function update_all_tiles_text(Tiles, gridSize, strategyMatrix = null) {
  // Solve for strategyMatrix if not provided
  if (strategyMatrix == null) {
    strategyMatrix = solveTileSpaceMatrix(
      tilesToTilespaceMatrix(Tiles),
      gridSize
    );
  }

  // update text
  for (let row = 0; row < Tiles.length; row++) {
    for (let col = 0; col < Tiles[row].length; col++) {
      let tile = Tiles[row][col];

      // Make sure tile exists first
      if (tile) {
        tile.updateTextContent(strategyMatrix.mat[row][col]);
      }
    }
  }
}

function solveTileSpaceMatrix(tileSpaceMatrix, gridSize) {
  // Convert tileSpaceMatrix to desired format
  //tileSpaceMatrix.printHowItAppearsInFlipTile();
  var flattenedTileSpaceMatrix = tileSpaceMatrix.flatten();

  // Find solved and inverted toggle matrix for this size
  var flattenedsolvedMatrix = createSolvedMatrix(gridSize).flatten();
  var toggleMatrix = createToggleMatrix(
    gridSize,
    TilePatternAttrs.qtyStatesBeingUsed
  );
  //toggleMatrix.printHowItAppearsInFlipTile();
  //toggleMatrix.printInArrayFormat();

  var matModInverseToggleMatrix = new Matrix([[]]); // toggleMatrix.modInverse(2); // 2 possible choices for tiles, 0 or 1
  if (TilePatternAttrs.qtyStatesBeingUsed == 2) {
    if (gridSize == 2) {
      matModInverseToggleMatrix = new Matrix(
        inverseToggleMatrixLookupMod2.TWO_BY_TWO
      );
    } else if (gridSize == 3) {
      matModInverseToggleMatrix = new Matrix(
        inverseToggleMatrixLookupMod2.THREE_BY_THREE
      );
    } else {
      console.error(
        `No inverseToggleMatrixLookupMod2 exists for gridSize of ${gridSize}`
      );
    }
  } else {
    if (gridSize == 3) {
      matModInverseToggleMatrix = new Matrix(
        inverseToggleMatrixLookupMod3.THREE_BY_THREE
      );
    } else {
      console.error(
        `No inverseToggleMatrixLookupMod2 exists for gridSize of ${gridSize}`
      );
    }
  }

  // Compute the strategyMatrix
  var finalMinusInitial = flattenedsolvedMatrix.matModSubtract(
    flattenedTileSpaceMatrix,
    TilePatternAttrs.qtyStatesBeingUsed
  );
  var flattenedStrategyMatrix = matModInverseToggleMatrix.modMultiply(
    finalMinusInitial,
    TilePatternAttrs.qtyStatesBeingUsed
  );
  var strategyMatrix = flattenedStrategyMatrix.unflatten(gridSize);
  //strategyMatrix.printHowItAppearsInFlipTile();

  return strategyMatrix;
}

function isTileConfigSolvableAndInterestingEnough(
  tileSpaceMatrix,
  strategyMatrix
) {
  // TODO: figure out from the grid if the tile gris is interesting enough
  // e.g. there are enough flipped tiles for it to be fun, and it is not already solved.
  // Also use the solution matrix to see if this one is solvable in the first place.
  // ...
  return true;
}

function createRandomTileSpaceMatrix(gridSize) {
  let tileSpace = []; // 2D array
  for (let row = 0; row < gridSize; row++) {
    tileSpace[row] = [];
    for (let col = 0; col < gridSize; col++) {
      var rand_val = seededRandom.getRandomFloat(0, 1);
      var tileState = tileStates.BLUE;

      if (TilePatternAttrs.qtyStatesBeingUsed == 2) {
        if (rand_val <= 0.5) {
          tileState = tileStates.RED;
        } else {
          tileState = tileStates.BLUE;
        }
      } else {
        if (rand_val <= 0.33) {
          tileState = tileStates.RED;
        } else if (rand_val <= 0.66) {
          tileState = tileStates.BLUE;
        } else {
          tileState = tileStates.GREEN;
        }
      }

      tileSpace[row][col] = tileState;
    }
  }

  return new Matrix(tileSpace);
}

function createSolvedMatrix(gridSize) {
  // all 1's is a solved matrix (could be all 0's too, just picking 1 for simplicity)
  let solvedMatrix = [];

  for (let row = 0; row < gridSize; row++) {
    solvedMatrix[row] = [];
    for (let col = 0; col < gridSize; col++) {
      solvedMatrix[row][col] = 1;
    }
  }

  return new Matrix(solvedMatrix);
}

function createToggleMatrix(gridSize, modulo) {
  // Start off tile array as all zeros
  let tileArray2D = [];

  for (let row = 0; row < gridSize; row++) {
    tileArray2D[row] = [];
    for (let col = 0; col < gridSize; col++) {
      tileArray2D[row][col] = 0;
    }
  }

  // Simulate all possible outcomes of toggling each portion of the array.
  // E.g. if we touch top left of the array (the first possible tile),
  // what is the resulting state? Flatten this and make that the first row of the ToggleMatrix
  // Then do the second tile, and third and so on
  // This matrix defines how changes to a tile affect another tile.
  let toggleMatrixArray = [];

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      // Copy the initial tile array
      let currentTileArray = JSON.parse(JSON.stringify(tileArray2D));

      // Toggle the current tile
      currentTileArray[row][col] = (currentTileArray[row][col] + 1) % modulo;

      // Toggle all neighboring tiles
      // Toggle top neighbor
      if (row - 1 >= 0) {
        currentTileArray[row - 1][col] =
          (currentTileArray[row - 1][col] + 1) % modulo;
      }
      // Toggle down neighbor
      if (row + 1 < gridSize) {
        currentTileArray[row + 1][col] =
          (currentTileArray[row + 1][col] + 1) % modulo;
      }
      // Toggle left neighbor
      if (col - 1 >= 0) {
        currentTileArray[row][col - 1] =
          (currentTileArray[row][col - 1] + 1) % modulo;
      }
      // Toggle right neighbor
      if (col + 1 < gridSize) {
        currentTileArray[row][col + 1] =
          (currentTileArray[row][col + 1] + 1) % modulo;
      }

      // Flatten the current tile array
      let flattenedArray = currentTileArray.flat();

      // Add the flattened array to the toggle matrix array
      toggleMatrixArray.push(flattenedArray);
    }
  }

  return new Matrix(toggleMatrixArray);
}
