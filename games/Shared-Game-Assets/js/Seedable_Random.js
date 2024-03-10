export const randomType = {
  UNSEEDED_RANDOM: -1,
};

export class SeededRandom {
  constructor(seed) {
    this.seed = seed;
  }

  random() {
    // If we supply randomType.UNSEEDED_RANDOM, then
    // we do real randomness instead of seeded randomness
    if (this.seed === randomType.UNSEEDED_RANDOM) {
      return Math.random();
    } else {
      let x = this.seed;
      x ^= x << 13;
      x ^= x >> 17;
      x ^= x << 5;
      this.seed = x;
      return (x >>> 0) / ((1 << 31) >>> 0);
    }
  }

  getRandomFloat(min, max) {
    return this.random() * (max - min) + min;
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(this.random() * (max - min + 1)) + min;
  }
}
