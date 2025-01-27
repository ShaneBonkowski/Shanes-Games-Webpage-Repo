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
   * Performs linear interpolation between two values with a threshold.
   * If the difference between start and end is lower than the threshold, it jumps to the end value.
   * @param {number} start - The starting value.
   * @param {number} end - The ending value.
   * @param {number} t - The interpolation parameter. Should be between 0 and 1.
   * @param {number} threshold - The threshold for jumping to the end value.
   * @returns {number} The interpolated value or the end value if the threshold is exceeded.
   */
  static lerpWithThreshold(start, end, t, threshold) {
    const difference = Math.abs(end - start);

    // If the difference is lower than the threshold, jump to the end value
    if (difference < threshold) {
      return end;
    }

    // Otherwise, call the existing lerp function
    return this.lerp(start, end, t);
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
