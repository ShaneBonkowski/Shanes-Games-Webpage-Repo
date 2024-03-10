import { SeededRandom } from "./Seedable_Random.js";
export class more_math {
  static lerp(start, end, t) {
    return (1 - t) * start + t * end;
  }

  static getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
