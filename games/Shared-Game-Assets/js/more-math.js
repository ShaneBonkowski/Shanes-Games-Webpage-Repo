/**
 * @fileOverview Provides extra math operations not included in base JavaScript.
 *
 * @description Lerping, random integers, and more!
 *
 * @module MoreMath
 *
 * @author Shane Bonkowski
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
}
