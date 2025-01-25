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
export class MoreMath {
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
   * Clamps a value between a minimum and maximum value.
   * @param {number} value - The value to be clamped.
   * @param {number} min - The minimum value.
   * @param {number} max - The maximum value.
   * @returns {number} The clamped value.
   */
  static clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
  }
}
