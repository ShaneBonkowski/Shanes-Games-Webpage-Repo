export class Physics {
  static physicsUpdateInterval = 1000 / 60; // 60 Hz
  static lastPhysicsUpdateTime = 0;

  static performPhysicsUpdate(time) {
    this.lastPhysicsUpdateTime = time;
  }

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
