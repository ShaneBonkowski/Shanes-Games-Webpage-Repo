import { moduloArith } from "./mod.js";

/**
 * Creates a 2D array with the specified number of rows and columns.
 * @param {number} rows - The number of rows in the 2D array.
 * @param {number} cols - The number of columns in the 2D array.
 * @returns {Array[]} The newly created 2D array.
 */

function create2DArray(rows, cols) {
  let arr = new Array(rows);
  for (let i = 0; i < rows; i++) {
    arr[i] = new Array(cols);
  }
  return arr;
}

/**
 * Class that a matrix and provides operations for matrix manipulation.
 */
export class Matrix {
  /**
   * Constructor to create a new Matrix instance.
   * Expanded upon from https://editor.p5js.org/hanxyn888@gmail.com/sketches/1HcjVvYUz
   * @param {number[][]} arr - The array representing the matrix.
   * Each inner array represents a row of the matrix.
   */
  constructor(arr) {
    /**
     * Indicates whether the matrix is valid.
     * A matrix is considered valid if all its rows have the same number of columns.
     * @type {boolean}
     */
    this.valid = true;
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i].length != arr[i + 1].length) {
        console.log("INVALID MATRIX GIVEN");
        this.rows = 0;
        this.cols = 0;
        this.valid = false;
      }
    }
    if (this.valid) {
      /**
       * The number of rows in the matrix.
       * @type {number}
       */
      this.rows = arr.length;
      /**
       * The number of columns in the matrix.
       * @type {number}
       */
      this.cols = arr[0].length;
      /**
       * The array representation of the matrix.
       * Each inner array represents a row of the matrix.
       * @type {number[][]}
       */
      this.mat = arr;
    }
  }

  /**
   * Prints the actual matrix in the order it's indexed.
   */
  printActual() {
    var matString = "";
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        matString += this.mat[i][j];
        matString += ", ";
      }
      matString += "\n";
    }

    console.log(matString);
  }

  /**
   * Prints the matrix in the orientation that the tiles visibly appear in a flip tile game.
   */
  printHowItAppearsInFlipTile() {
    var matString = "";
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        matString += this.mat[j][i]; // print j, i instead of i, j
        matString += ", ";
      }
      matString += "\n";
    }

    console.log(matString);
  }

  /**
   * Prints the matrix in array format.
   */
  printInArrayFormat() {
    var matString = "";
    matString += "[";
    for (let i = 0; i < this.rows; i++) {
      matString += "[";
      for (let j = 0; j < this.cols; j++) {
        matString += this.mat[j][i]; // print j, i instead of i, j
        matString += ", ";
      }
      matString += "],";
    }
    matString += "]";

    console.log(matString);
  }

  /**
   * Adds another matrix to the current matrix by performing element-wise addition.
   * @param {Matrix} b - The matrix to be added.
   * @returns {Matrix} The resulting matrix after addition.
   */
  add(b) {
    let newMatrix = create2DArray(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        newMatrix[i][j] = this.mat[i][j] + b.mat[i][j];
      }
    }
    return new Matrix(newMatrix);
  }

  /**
   * Subtracts another matrix from the current matrix by performing element-wise subtraction.
   * @param {Matrix} b - The matrix to be subtracted.
   * @returns {Matrix} The resulting matrix after subtraction.
   */
  subtract(b) {
    let newMatrix = create2DArray(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        newMatrix[i][j] = this.mat[i][j] - b.mat[i][j];
      }
    }
    return new Matrix(newMatrix);
  }

  /**
   * Subtracts another matrix from the current matrix using modulo arithmetic and element-wise subtraction.
   * @param {Matrix} b - The matrix to be subtracted.
   * @param {number} modulus - The modulus value for the modular arithmetic.
   * @returns {Matrix} The resulting matrix after subtraction.
   */
  matModSubtract(b, modulus) {
    // Create a new matrix to store the result of the subtraction
    let newMatrix = create2DArray(this.rows, this.cols);

    // Perform element-wise subtraction with modulo arithmetic
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        // Subtract the corresponding elements and apply modulo operation
        newMatrix[i][j] = moduloArith.modSubtract(
          this.mat[i][j],
          b.mat[i][j],
          modulus
        );
      }
    }

    // Return a new matrix containing the result of the subtraction
    return new Matrix(newMatrix);
  }

  /**
   * Multiplies the matrix by a scalar value.
   * @param {number} f - The scalar value to multiply by.
   * @returns {Matrix} The resulting matrix after scalar multiplication.
   */
  multiplyScalar(f) {
    let newMatrix = create2DArray(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        newMatrix[i][j] = this.mat[i][j] * f;
      }
    }
    return new Matrix(newMatrix);
  }

  /**
   * Divides the matrix by a scalar value.
   * @param {number} f - The scalar value to divide by.
   * @returns {Matrix} The resulting matrix after scalar division.
   */
  divideScalar(f) {
    let newMatrix = create2DArray(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        newMatrix[i][j] = this.mat[i][j] / f;
      }
    }
    return new Matrix(newMatrix);
  }

  /**
   * Returns a new matrix obtained at the specified row and column from the current matrix.
   * The original matrix remains unchanged.
   * @param {number} x - The index of the row to be removed.
   * @param {number} y - The index of the column to be removed.
   * @returns {Matrix} The minor matrix obtained from the specified row and column of the original matrix.
   */
  minor(x, y) {
    let newMatrix = create2DArray(this.rows - 1, this.cols - 1);
    for (let i = 0; i < this.rows - 1; i++) {
      for (let j = 0; j < this.cols - 1; j++) {
        let setI = i;
        let setJ = j;
        if (i >= x) {
          setI = i + 1;
        }
        if (j >= y) {
          setJ = j + 1;
        }
        newMatrix[i][j] = this.mat[setI][setJ];
      }
    }
    return new Matrix(newMatrix);
  }

  /**
   * Calculates the determinant of the matrix.
   * @returns {number} The determinant value.
   */
  determinant() {
    if (this.rows == 1 && this.cols == 1) {
      return this.mat[0][0];
    } else {
      let sum = 0;
      for (let j = 0; j < this.cols; j++) {
        sum +=
          Math.pow(-1, j) * this.mat[0][j] * this.minor(0, j).determinant();
      }
      return sum;
    }
  }

  /**
   * Transposes the matrix, swapping its rows and columns.
   * @returns {Matrix} The transposed matrix.
   */
  transpose() {
    let newMatrix = create2DArray(this.cols, this.rows);
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        newMatrix[i][j] = this.mat[j][i];
      }
    }
    return new Matrix(newMatrix);
  }

  /**
   * Multiplies the matrix by another matrix.
   * @param {Matrix} b - The matrix to be multiplied.
   * @returns {Matrix} The resulting matrix after multiplication.
   */
  multiply(b) {
    let newMatrix = create2DArray(this.rows, b.cols);
    // follow multiplication algorithm
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < b.cols; j++) {
        let aRow = this.mat[i];
        let bCol = [];
        for (let x = 0; x < b.rows; x++) {
          bCol.push(b.mat[x][j]);
        }
        let sum = 0;
        for (let x = 0; x < this.cols; x++) {
          sum += aRow[x] * bCol[x];
        }
        newMatrix[i][j] = sum;
      }
    }
    return new Matrix(newMatrix);
  }

  /**
   * Multiplies the matrix by another matrix using modulo arithmetic.
   * @param {Matrix} b - The matrix to be multiplied.
   * @param {number} modulus - The modulus value for the modular arithmetic.
   * @returns {Matrix} The resulting matrix after multiplication.
   */
  modMultiply(b, modulus) {
    let newMatrix = create2DArray(this.rows, b.cols);
    // follow multiplication algorithm
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < b.cols; j++) {
        let aRow = this.mat[i];
        let bCol = [];
        for (let x = 0; x < b.rows; x++) {
          bCol.push(b.mat[x][j]);
        }
        let sum = 0;
        for (let x = 0; x < this.cols; x++) {
          sum = moduloArith.modAdd(
            sum,
            moduloArith.modMultiply(aRow[x], bCol[x], modulus),
            modulus
          );
        }
        newMatrix[i][j] = sum;
      }
    }
    return new Matrix(newMatrix);
  }

  /**
   * Calculates the inverse of the matrix using the adjugate method.
   * @returns {Matrix} The inverse matrix, or undefined if the matrix is not invertible.
   */
  inverse() {
    // Step 1: Find the minor matrix
    // Step 2: Find the cofactor matrix
    // Step 3: Find adj(A)
    // Step 4: Find det(A)
    // Step 5: adj(A) / det(A) = A^-1

    // Step 1
    let minorMatrix = create2DArray(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        minorMatrix[i][j] = this.minor(i, j).determinant();
      }
    }
    // Step 2
    let cofactorMatrix = create2DArray(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        cofactorMatrix[i][j] = Math.pow(-1, i + j) * minorMatrix[i][j];
      }
    }
    // Step 3
    let adj = new Matrix(cofactorMatrix).transpose();
    let det = this.determinant();
    return adj.divideScalar(det);
  }

  /**
   * Calculates the modular inverse of the matrix for a given modulus.
   * @param {number} modulus - The modulus value for the modular arithmetic.
   * @returns {Matrix|undefined} The matrix representing the modular inverse, or undefined if the matrix is not invertible modulo the given modulus.
   */
  modInverse(modulus) {
    // Step 1: Find the minor matrix
    let minorMatrix = create2DArray(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        minorMatrix[i][j] = moduloArith.mod(
          this.minor(i, j).determinant(),
          modulus
        );
      }
    }

    // Step 2: Find the cofactor matrix
    let cofactorMatrix = create2DArray(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        // Corrected order of operations: modPow(-1, i + j) should be wrapped in mod()
        cofactorMatrix[i][j] = moduloArith.mod(
          moduloArith.modPow(-1, i + j, modulus) * minorMatrix[i][j],
          modulus
        );
      }
    }

    // Step 3: Find adj(A)
    let adj = new Matrix(cofactorMatrix).transpose();

    // Step 4: Find det(A)
    let det = moduloArith.mod(this.determinant(), modulus);

    // Step 5: Check if determinant is invertible
    if (det === 0) {
      console.error("Matrix is not invertible modulo " + modulus);
      return undefined;
    }

    // Step 6: Calculate the modular inverse of the determinant
    let detInverse = moduloArith.modInverse(det, modulus);
    if (Number.isNaN(detInverse)) {
      console.error(
        "Modular inverse does not exist for the determinant modulo " + modulus
      );
      return undefined;
    }

    // Step 7: Multiply the adjugate by the modular inverse of the determinant
    let inverseMatrix = adj.multiplyScalar(detInverse);

    // Ensure all elements of the inverse matrix are modulo 'modulus'
    for (let i = 0; i < inverseMatrix.rows; i++) {
      for (let j = 0; j < inverseMatrix.cols; j++) {
        inverseMatrix.mat[i][j] = moduloArith.mod(
          inverseMatrix.mat[i][j],
          modulus
        );
      }
    }

    return inverseMatrix;
  }

  /**
   * Flattens a square matrix into a flat line.
   * For example, a 3x3 matrix would become a 1x9 vertical matrix.
   * @returns {Matrix|undefined} The flattened matrix, or undefined if the matrix is not square.
   */
  flatten() {
    // Check if the matrix is square
    if (this.rows !== this.cols) {
      console.error("Matrix must be square to flatten.");
      return undefined;
    }

    // 1D list
    const result = [];

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        result.push(this.mat[row][col]);
      }
    }

    // 1D list to 2D list so matrix function works as expected
    const resultMatrix = [];
    for (let i = 0; i < result.length; i++) {
      resultMatrix.push([result[i]]);
    }

    return new Matrix(resultMatrix);
  }

  /**
   * Unflattens a flat line matrix back into a square matrix of the given size.
   * @param {number} size - The size of the square matrix (number of rows/columns).
   * @returns {Matrix|undefined} The unflattened square matrix, or undefined if there's a size mismatch.
   */

  unflatten(size) {
    if (this.mat.length !== size * size) {
      console.error("Matrix size mismatch.");
      return undefined;
    }

    const result = [];
    let index = 0;

    for (let i = 0; i < size; i++) {
      result[i] = [];
      for (let j = 0; j < size; j++) {
        result[i][j] = this.mat[index++][0];
      }
    }

    return new Matrix(result);
  }
}
