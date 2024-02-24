export class more_math {
  static getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }

  static lerp(start, end, t) {
    return (1 - t) * start + t * end;
  }
}
