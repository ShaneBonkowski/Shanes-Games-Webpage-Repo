export class Vec2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  static magnitude(vector) {
    return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  }

  static normalize(vector) {
    let magnitude = Vec2.magnitude(vector);
    if (magnitude !== 0) {
      return new Vec2(vector.x / magnitude, vector.y / magnitude);
    } else {
      return new Vec2(0, 0);
    }
  }

  static add(vector1, vector2) {
    return new Vec2(vector1.x + vector2.x, vector1.y + vector2.y);
  }

  static subtract(vector1, vector2) {
    return new Vec2(vector1.x - vector2.x, vector1.y - vector2.y);
  }

  static dot(vector1, vector2) {
    return vector1.x * vector2.x + vector1.y * vector2.y;
  }

  static scale(vector, scalar) {
    return new Vec2(vector.x * scalar, vector.y * scalar);
  }
}
