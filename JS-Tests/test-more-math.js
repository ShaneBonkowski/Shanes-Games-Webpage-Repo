import { runTest, evaluateTest } from "./test-utils/testing.js";
import { MoreMath } from "../games/Shared-Game-Assets/js/more-math.js";

function testClamp() {
  // Exceed upper bound test, clamped to upperBound
  let lowerBound = 0;
  let upperBound = 1;
  let result = MoreMath.clamp(5, lowerBound, upperBound);
  evaluateTest(
    result == upperBound,
    "Passed exceed upper range on clamp check.",
    `Expected ${upperBound}, got ${result}`
  );

  // Exceed lower bound test, clamped to lowerBound
  result = MoreMath.clamp(-1, lowerBound, upperBound);
  evaluateTest(
    result == lowerBound,
    "Passed exceed lower range on clamp check.",
    `Expected ${lowerBound}, got ${result}`
  );

  // Result stays between lower and upper bound if not exceeding
  let initialValue = 0.5;
  result = MoreMath.clamp(initialValue, lowerBound, upperBound);
  evaluateTest(
    result == initialValue,
    "Passed within range on clamp check.",
    `Expected ${initialValue}, got ${result}`
  );
}

// Run all tests
console.log("-----Running Tests-----");
runTest(testClamp);
console.log("-----Done Running Tests-----");
