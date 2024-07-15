import { Vec2 } from "/games/Shared-Game-Assets/js/vector.js";
import { Physics } from "./physics.js";

/**
 * Class representing a 2D physics body.
 */
export class PhysicsBody2D {
  /**
   * Create a PhysicsBody2D.
   * @param {GameObject} gameObject - Parent game obj
   * @param {Vec2} position - The initial position.
   * @param {Vec2} velocity - The initial velocity.
   * @param {Vec2} acceleration - The initial acceleration.
   * @param {number} mass - The mass of the body.
   * @param {number} gravity - The gravity coefficient.
   * @param {number} friction - The friction coefficient.
   * @param {number} restitution - The restitution (bounciness) coefficient.
   */
  constructor(
    gameObject,
    position = new Vec2(0, 0),
    velocity = new Vec2(0, 0),
    acceleration = new Vec2(0, 0),
    mass = 1,
    gravity = 0,
    friction = 0,
    restitution = 0
  ) {
    this.gameObject = gameObject;

    // Kinematics
    this.position = position;
    this.velocity = velocity;
    this.acceleration = acceleration;

    // Physics
    this.mass = mass;
    this.gravity = gravity;
    this.friction = friction;
    this.restitution = restitution;
  }

  /**
   * Apply a force, updating the acceleration.
   * @param {Vec2} force - The force to apply.
   */
  applyForce(force) {
    if (this.gameObject.disabled) {
      return;
    }

    acceleration.x += force.x / this.mass;
    acceleration.y += force.y / this.mass;
  }

  /**
   * Update the acceleration.
   */
  updateAcceleration() {
    if (this.gameObject.disabled) {
      return;
    }

    // Apply gravity if enabled
    if (this.gravity !== 0) {
      this.acceleration.y += this.gravity;
    }
  }

  /**
   * Update the velocity based on acceleration.
   * @param {number} dt - The time delta.
   */
  updateVelocity(dt = Physics.physicsUpdateInterval) {
    if (this.gameObject.disabled) {
      return;
    }

    this.velocity.x += this.acceleration.x * dt;
    this.velocity.y += this.acceleration.y * dt;

    // Apply friction if enabled
    if (this.friction !== 0) {
      this.velocity.x *= 1 - this.friction;
      this.velocity.y *= 1 - this.friction;
    }
  }

  /**
   * Update the position based on velocity.
   * @param {number} dt - The time delta.
   */
  updatePosition(dt = Physics.physicsUpdateInterval) {
    if (this.gameObject.disabled) {
      return;
    }

    this.position.x += this.velocity.x * dt;
    this.position.y += this.velocity.y * dt;
  }
}
