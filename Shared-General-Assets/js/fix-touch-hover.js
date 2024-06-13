/**
 * Fixes hover-related issues on touch devices by simulating
 * mouse events.
 *
 * This function detects if the device is touch-enabled and sets up
 * event listeners to handle touch events by simulating mouse events
 * (mouseup) to address hover-related issues.
 *
 * Use this function in your web application to ensure consistent hover
 * and touch behavior across different devices.
 */
export function fixTouchHover() {
  function isTouchDevice() {
    return (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  }

  if (isTouchDevice()) {
    // Listen for touchend events on the entire document
    document.addEventListener("touchend", function (e) {
      // Simulate a mouseup event by dispatching a 'mouseup' event
      let mouseUpEvent = new MouseEvent("mouseup", {
        bubbles: true,
        cancelable: true,
        view: window,
      });

      // Dispatch the mouseup event on the target of the touch event
      e.target.dispatchEvent(mouseUpEvent);

      // Blur the active element to clear focus (dont want to retain focus
      // after the touch has "let go" or mouse "upped")
      if (document.activeElement && document.activeElement !== document.body) {
        document.activeElement.blur();
      }
    });
  }
}
