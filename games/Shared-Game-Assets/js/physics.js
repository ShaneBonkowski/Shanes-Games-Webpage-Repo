/**
 * @fileOverview Provides physics utility functions and properties to be used in games.
 *
 * @description Collisions, physics updates, and more!
 *
 * @module Physics
 *
 * @author Shane Bonkowski
 */

/**
 * Provides physics utility functions and properties.
 */
export class Physics {
  /**
   * The interval between physics updates in milliseconds.
   * Defaults to 1000 / 60 (60 Hz).
   * @type {number}
   */
  static physicsUpdateInterval = 1000 / 60; // 60 Hz

  /**
   * The timestamp of the last physics update.
   * Initialized to 0.
   * @type {number}
   */
  static lastPhysicsUpdateTime = 0;

  /**
   * Performs a physics update.
   * @param {number} time - The current timestamp.
   */
  static performPhysicsUpdate(time) {
    this.lastPhysicsUpdateTime = time;
  }

  /**
   * Checks for collision between two circles based on the squared distance between their centers.
   * @param {number} distanceSquared - The squared distance between the centers of the circles.
   * @param {number} collider1_radius - The radius of the first circle.
   * @param {number} collider2_radius - The radius of the second circle.
   * @returns {boolean} True if collision occurs, otherwise false.
   */
  static checkCircleCollision(
    distanceSquared,
    collider1_radius,
    collider2_radius
  ) {
    if (distanceSquared < (collider1_radius + collider2_radius) ** 2) {
      return true;
    }
    return false;
  }
}
