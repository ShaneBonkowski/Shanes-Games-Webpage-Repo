export class Physics {
  static physicsUpdateInterval = 1000 / 60; // 60 Hz
  static lastPhysicsUpdateTime = 0;

  static performPhysicsUpdate(boids, time) {
    this.lastPhysicsUpdateTime = time;
  }
}
