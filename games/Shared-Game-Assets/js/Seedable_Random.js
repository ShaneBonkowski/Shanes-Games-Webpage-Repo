/**
 * @fileOverview Generates pseudo-random numbers with optional seed for reproducibility.
 *
 * @module SeededRandom
 *
 * @author Shane Bonkowski
 */

export const randomType = {
  UNSEEDED_RANDOM: -1,
};

/**
 * Generates pseudo-random numbers with optional seed for reproducibility.
 */
export class SeededRandom {
  /**
   * Creates a new SeededRandom instance with the specified seed.
   * @param {number} seed - The seed value. Use randomType.UNSEEDED_RANDOM for "real", unseeded randomness.
   */
  constructor(seed) {
    this.seed = seed;
  }

  /**
   * Generates a pseudo-random float between 0 (inclusive) and 1 (exclusive).
   * @returns {number} A pseudo-random float.
   */
  random() {
    // If we supply randomType.UNSEEDED_RANDOM, then
    // we do real randomness instead of seeded randomness
    if (this.seed === randomType.UNSEEDED_RANDOM) {
      return Math.random();
    } else {
      let x = this.seed;
      x ^= x << 13;
      x ^= x >> 17;
      x ^= x << 5;
      this.seed = x;
      return (x >>> 0) / ((1 << 31) >>> 0);
    }
  }

  /**
   * Generates a pseudo-random float within the specified range.
   * @param {number} min - The minimum value (inclusive).
   * @param {number} max - The maximum value (exclusive).
   * @returns {number} A pseudo-random float within the specified range.
   */
  getRandomFloat(min, max) {
    return this.random() * (max - min) + min;
  }

  /**
   * Generates a pseudo-random integer within the specified range.
   * @param {number} min - The minimum value (inclusive).
   * @param {number} max - The maximum value (inclusive).
   * @returns {number} A pseudo-random integer within the specified range.
   */
  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(this.random() * (max - min + 1)) + min;
  }
}
