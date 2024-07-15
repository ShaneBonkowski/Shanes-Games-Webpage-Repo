let currentMessage = null;
let resizeObserver = null;

/**
 * Displays a message on the screen that fades out after a set duration.
 * @param {Phaser.Scene} scene - The Phaser scene in which to display the message. Typically just pass "this" into the function from the scene
 * @param {string} messageText - The text to display in the message.
 */
export function showMessage(scene, messageText) {
  // Destroy the current message if it exists
  if (currentMessage) {
    currentMessage.destroy();
    currentMessage = null;
  }
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }

  // Create a text object for the message
  let centerX = window.innerWidth / 2;
  let centerY = window.innerHeight / 2;

  let message = scene.add.text(centerX, centerY, messageText, {
    fontFamily: "sans-serif",
    fontSize: "22pt",
    color: "#ffffff",
    align: "center",
    // Black outline
    stroke: "#000000",
    strokeThickness: 5,
    fixedWidth: window.innerWidth * 0.8,
    wordWrap: { width: window.innerWidth * 0.8 },
  });
  message.setOrigin(0.5);

  // Fade out the message
  scene.tweens.add({
    targets: message,
    alpha: 0,
    duration: 500, // Fade out duration in milliseconds
    delay: 1500, // Delay before starting the fade out
    onComplete: function () {
      if (message) {
        message.destroy();
        message = null;
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }

      currentMessage = null;
    },
  });

  // Set the current message
  currentMessage = message;

  // Observe window resizing with ResizeObserver since it
  // is good for snappy changes
  resizeObserver = new ResizeObserver((entries) => {
    handleWindowResize(message);
  });
  resizeObserver.observe(document.documentElement);

  // Also checking for resize or orientation change to try
  // to handle edge cases that ResizeObserver misses!
  window.addEventListener("resize", handleWindowResize(message));
  window.addEventListener("orientationchange", handleWindowResize(message));
}

function handleWindowResize(message) {
  if (message !== null) {
    message.setPosition(window.innerWidth / 2, window.innerHeight / 2);
    message.setStyle({
      fontFamily: "sans-serif",
      fontSize: "22pt",
      color: "#ffffff",
      align: "center",
      // Black outline
      stroke: "#000000",
      strokeThickness: 5,
      fixedWidth: window.innerWidth * 0.8,
      wordWrap: { width: window.innerWidth * 0.8 },
    });
  }
}
