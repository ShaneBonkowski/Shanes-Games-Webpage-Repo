import { moduloArith } from "./mod.js";

// Expanded upon from https://editor.p5js.org/hanxyn888@gmail.com/sketches/1HcjVvYUz
function create2DArray(rows, cols) {
  let arr = new Array(rows);
  for (let i = 0; i < rows; i++) {
    arr[i] = new Array(cols);
  }
  return arr;
}

export class Matrix {
  constructor(arr) {
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
      this.rows = arr.length;
      this.cols = arr[0].length;
      this.mat = arr;
    }
  }

  printActual() {
    // Print the actual matrix in the order its indexed
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

  printHowItAppearsInFlipTile() {
    // print in the orientation that the tiles visibly are to a player in flip tile game
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

  add(b) {
    // for every element in the matrix, add it by the corresponding element in the other matrix
    let newMatrix = create2DArray(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        newMatrix[i][j] = this.mat[i][j] + b.mat[i][j];
      }
    }
    return new Matrix(newMatrix);
  }

  subtract(b) {
    // for every element in the matrix, subtract it by the corresponding element in the other matrix
    let newMatrix = create2DArray(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        newMatrix[i][j] = this.mat[i][j] - b.mat[i][j];
      }
    }
    return new Matrix(newMatrix);
  }

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

  multiplyScalar(f) {
    let newMatrix = create2DArray(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        newMatrix[i][j] = this.mat[i][j] * f;
      }
    }
    return new Matrix(newMatrix);
  }

  divideScalar(f) {
    let newMatrix = create2DArray(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        newMatrix[i][j] = this.mat[i][j] / f;
      }
    }
    return new Matrix(newMatrix);
  }

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

  transpose() {
    let newMatrix = create2DArray(this.cols, this.rows);
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        newMatrix[i][j] = this.mat[j][i];
      }
    }
    return new Matrix(newMatrix);
  }

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

  flatten() {
    // flattens a square matrix into a flat line.
    // e.g. 3x3 matric would become 1x9 vertical

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

  unflatten(size) {
    // unflattens a flat line matrix back into a square matrix of given size.
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
