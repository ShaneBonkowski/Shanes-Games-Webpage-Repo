export class moduloArith {
  static mod(num, modulus) {
    return ((num % modulus) + modulus) % modulus;
  }

  static modSubtract(a, b, modulus) {
    // Validate inputs
    [a, b, modulus] = [Number(a), Number(b), Number(modulus)]; // Convert inputs to numbers
    if (Number.isNaN(a) || Number.isNaN(b) || Number.isNaN(modulus)) {
      return NaN; // Invalid input: return NaN
    }

    // Perform modulo subtraction
    return this.mod(a - b, modulus);
  }

  static modAdd(a, b, modulus) {
    // Validate inputs
    [a, b, modulus] = [Number(a), Number(b), Number(modulus)]; // Convert inputs to numbers
    if (Number.isNaN(a) || Number.isNaN(b) || Number.isNaN(modulus)) {
      return NaN; // Invalid input: return NaN
    }

    // Perform modulo addition
    return this.mod(a + b, modulus);
  }

  static modMultiply(a, b, modulus) {
    // Validate inputs
    [a, b, modulus] = [Number(a), Number(b), Number(modulus)]; // Convert inputs to numbers
    if (Number.isNaN(a) || Number.isNaN(b) || Number.isNaN(modulus)) {
      return NaN; // Invalid input: return NaN
    }

    // Perform modulo multiplication
    return this.mod(a * b, modulus);
  }

  static modPow(base, exponent, modulus) {
    let result = 1;
    base = this.mod(base, modulus);
    while (exponent > 0) {
      if (exponent % 2 === 1) {
        result = this.mod(result * base, modulus);
      }
      exponent = Math.floor(exponent / 2);
      base = this.mod(base * base, modulus);
    }
    return result;
  }

  static modInverse(a, m) {
    // Validate inputs
    [a, m] = [Number(a), Number(m)]; // Convert inputs to numbers
    if (Number.isNaN(a) || Number.isNaN(m)) {
      return NaN; // Invalid input: return NaN
    }

    // Reduce 'a' to positive residue modulo 'm'
    a = this.mod(a, m);

    // Check for special cases
    if (!a || m < 2) {
      return NaN; // Invalid input: return NaN
    }

    // Extended Euclidean Algorithm
    let [oldR, r] = [a, m];
    let [oldS, s] = [1, 0];
    let [oldT, t] = [0, 1];
    while (r !== 0) {
      const quotient = Math.floor(oldR / r);
      [oldR, r] = [r, oldR - quotient * r];
      [oldS, s] = [s, oldS - quotient * s];
      [oldT, t] = [t, oldT - quotient * t];
    }

    // Ensure the result is a positive residue modulo 'm'
    return this.mod(oldS, m);
  }
}
