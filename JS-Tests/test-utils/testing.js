/**
 * Runs a test function and logs the process.
 *
 * @param {Function} testFunc - The test function to be executed.
 */
export function runTest(testFunc) {
  console.log(`Running ${testFunc.name}...`);
  try {
    testFunc();
  } catch (error) {
    console.log("Test failed: ", error.message);
  }
  console.log("");
}

/**
 * A utility function for running tests with formatted output.
 * @param {boolean} condition - The result of the test (true for pass, false for fail).
 * @param {string} passMsg - The message to display if the test passes.
 * @param {string} failMsg - The message to display if the test fails.
 */
export function evaluateTest(condition, passMsg, failMsg) {
  if (condition) {
    console.log(`- PASS: ${passMsg}`);
  } else {
    console.log(`- FAIL: ${failMsg}`);
  }
}
