import { runTest, evaluateTest } from "./test-utils/testing.js";
import {
  SeededRandom,
  randomType,
} from "../games/Shared-Game-Assets/js/seedable-random.js";

function testRandomWithUnseededRandom() {
  const random = new SeededRandom(randomType.UNSEEDED_RANDOM);

  // Test: ensure 100 random calls are within range [0, 1)
  let test_passed = true;
  let last_failed_value = null;

  for (let i = 0; i < 100; i++) {
    const value = random.random();
    if (value < 0 || value >= 1) {
      test_passed = false;
      last_failed_value = value;
      break;
    }
  }

  evaluateTest(
    test_passed,
    "Passed range check after 100 iterations.",
    `Expected 0 <= value < 1, got ${last_failed_value}`
  );
}

function testRandomWithSeededRandom() {
  const seed = 12345;
  const random = new SeededRandom(seed);

  // Test: ensure 100 random calls are within range [0, 1)
  let test_passed = true;
  let last_failed_value = null;

  for (let i = 0; i < 100; i++) {
    const value = random.random();
    if (value < 0 || value >= 1) {
      test_passed = false;
      last_failed_value = value;
      break;
    }
  }
  evaluateTest(
    test_passed,
    "Passed range check after 100 iterations.",
    `Expected 0 <= value < 1, got ${last_failed_value}`
  );

  // Test: Sequential calls are different
  const value1 = random.random();
  const value2 = random.random();
  evaluateTest(
    value1 !== value2,
    "Passed for sequential calls.",
    "Expected two different values for sequential random calls."
  );

  // Test: First call with same seed is consistent
  const random1 = new SeededRandom(seed);
  const random2 = new SeededRandom(seed);
  const firstValue1 = random1.random();
  const firstValue2 = random2.random();

  evaluateTest(
    firstValue1 === firstValue2,
    "Passed for consistent first calls with the same seed.",
    `Expected first random values to be the same for the same seed, but got ${firstValue1} and ${firstValue2}`
  );
}

function testGetRandomFloat() {
  const random = new SeededRandom(42);
  const min = 5;
  const max = 10;

  // Test: ensure that random float is within range
  let test_passed = true;
  let last_failed_value = null;

  for (let i = 0; i < 100; i++) {
    const value = random.getRandomFloat(min, max);
    if (value < min || value >= max) {
      test_passed = false;
      last_failed_value = value;
      break;
    }
  }

  evaluateTest(
    test_passed,
    "Passed after 100 attempts.",
    `Expected ${min} <= value < ${max}, got ${last_failed_value}`
  );
}

function testGetRandomInt() {
  const random = new SeededRandom(42);
  const min = 1;
  const max = 10;

  // Test: ensure that random int is is within range
  let test_passed = true;
  let fail_msg = "";
  for (let i = 0; i < 100; i++) {
    const value = random.getRandomInt(min, max);

    if (!Number.isInteger(value)) {
      test_passed = false;
      last_failed_value = value;
      fail_msg = `Expected an integer, got ${value}`;
      break;
    }

    if (value < min || value >= max) {
      test_passed = false;
      last_failed_value = value;
      fail_msg = `Expected ${min} <= value < ${max}, got ${value}`;
      break;
    }
  }

  evaluateTest(test_passed, "Passed after 100 attempts.", fail_msg);
}

function testGetRandomIntWithInvalidRange() {
  const random = new SeededRandom(42);
  const min = 10;
  const max = 5;
  const value = random.getRandomInt(min, max);

  evaluateTest(
    value === -1,
    "Got expected value of -1 for invalid range.",
    `Expected -1 for invalid range, got ${value}`
  );
}

// Run all tests
console.log("-----Running Tests-----");
runTest(testRandomWithUnseededRandom);
runTest(testRandomWithSeededRandom);
runTest(testGetRandomFloat);
runTest(testGetRandomInt);
runTest(testGetRandomIntWithInvalidRange);
console.log("-----Done Running Tests-----");
