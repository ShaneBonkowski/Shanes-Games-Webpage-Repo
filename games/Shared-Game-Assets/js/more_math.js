/**
 * @fileOverview Provides extra math operations not included in base JavaScript.
 *
 * @description Lerping, random integers, and more!
 *
 * @module MoreMath
 *
 * @author Shane Bonkowski
 *
 * @requires ShanesGames\games\Shared-Game-Assets\js\Seedable_Random.js
 */

/**
 * Provides additional mathematical utility functions.
 */
export class more_math {
  /**
   * Performs linear interpolation between two values.
   * @param {number} start - The starting value.
   * @param {number} end - The ending value.
   * @param {number} t - The interpolation parameter. Should be between 0 and 1.
   * @returns {number} The interpolated value.
   */
  static lerp(start, end, t) {
    return (1 - t) * start + t * end;
  }

  /**
   * Generates a random integer between the specified minimum and maximum values, inclusive.
   * @param {number} min - The minimum value.
   * @param {number} max - The maximum value.
   * @returns {number} A random integer between 'min' and 'max'.
   */
  static getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
