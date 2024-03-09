import { Tile } from "./Tile.js";
import { more_math } from "../../Shared-Game-Assets/js/more_math.js";
import { Matrix } from "../../Shared-Game-Assets/js/matrix.js";

export const tileStates = {
  RED: 0,
  BLUE: 1,
};

export const customEvents = {
  tileUpdateEvent: new Event("onTileUpdate"),
};

export function instantiateTiles(scene, tileCount) {
  // Allows for async behavior
  return new Promise((resolve, reject) => {
    let tiles = []; // 2D array

    // Spawn in tiles in a grid.. tileCount can only be an odd square
    if (tileCount % 2 !== 0 && Math.sqrt(tileCount) % 1 === 0) {
      // gridSize is the number of tiles per row and column in the grid (side length of the box the tiles make)
      const gridSize = Math.sqrt(tileCount);

      // Try to find a solvable config of tiles
      tiles = findSolvableTileGrid(gridSize, scene);

      // Resolve the Promise with the array of tiles
      resolve(tiles);
    } else {
      console.log(
        `Not spawning in tiles, tileCount of ${tileCount} is not an odd square as desired`
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

  return Matrix(tileSpace);
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
  while (!solveableTileConfigFound) {
    // Convert tileSpaceMatrix to desired format
    var tileSpaceMatrix = createRandomTileSpaceMatrix(gridSize);
    console.log("tileSpaceMatrix");
    tileSpaceMatrix.printHowItAppearsInFlipTile();
    var flattenedTileSpaceMatrix = tileSpaceMatrix.flatten();

    // Find solved and inverted toggle matrix for this size
    var flattenedsolvedMatrix = createSolvedMatrix(gridSize).flatten();
    var toggleMatrix = createToggleMatrix(gridSize);
    var matModInverseToggleMatrix = toggleMatrix.modInverse(2); // 2 possible choices for tiles, 0 or 1

    // Compute the strategyMatrix
    var finalMinusInitial = flattenedsolvedMatrix.matModSubtract(
      flattenedTileSpaceMatrix,
      2
    );
    var flattenedStrategyMatrix = matModInverseToggleMatrix.modMultiply(
      finalMinusInitial,
      2
    );
    var strategyMatrix = flattenedStrategyMatrix.unflatten(gridSize);
    console.log("strategyMatrix");
    strategyMatrix.printHowItAppearsInFlipTile();

    solveableTileConfigFound = true;
  }

  return tileSpaceMatrixToTiles(tileSpaceMatrix, gridSize, scene);
}

function createRandomTileSpaceMatrix(gridSize) {
  let tileSpace = []; // 2D array
  for (let row = 0; row < gridSize; row++) {
    tileSpace[row] = [];
    for (let col = 0; col < gridSize; col++) {
      var rand_val = more_math.getRandomFloat(0, 1);
      var tileState = tileStates.BLUE;
      if (rand_val <= 0.5) {
        tileState = tileStates.RED;
      } else {
        tileState = tileStates.BLUE;
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

function createToggleMatrix(gridSize) {
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
      currentTileArray[row][col] = 1 - currentTileArray[row][col]; // 1 -> 0, and 0 -> 1

      // Toggle all neighboring tiles
      // Toggle top neighbor
      if (row - 1 >= 0) {
        currentTileArray[row - 1][col] = 1 - currentTileArray[row - 1][col];
      }
      // Toggle down neighbor
      if (row + 1 < gridSize) {
        currentTileArray[row + 1][col] = 1 - currentTileArray[row + 1][col];
      }
      // Toggle left neighbor
      if (col - 1 >= 0) {
        currentTileArray[row][col - 1] = 1 - currentTileArray[row][col - 1];
      }
      // Toggle right neighbor
      if (col + 1 < gridSize) {
        currentTileArray[row][col + 1] = 1 - currentTileArray[row][col + 1];
      }

      // Flatten the current tile array
      let flattenedArray = currentTileArray.flat();

      // Add the flattened array to the toggle matrix array
      toggleMatrixArray.push(flattenedArray);
    }
  }

  return new Matrix(toggleMatrixArray);
}
