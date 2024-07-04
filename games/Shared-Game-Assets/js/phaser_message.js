let resizeObserver = null;

/**
 * Displays a message on the screen that fades out after a set duration.
 * @param {Phaser.Scene} scene - The Phaser scene in which to display the message. Typically just pass "this" into the function from the scene
 * @param {string} messageText - The text to display in the message.
 */
export function showMessage(scene, messageText) {
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
      message.destroy();
      resizeObserver.disconnect();
      resizeObserver = null;
    },
  });

  // Observe window resizing with ResizeObserver since it works
  // better than window.addEventListener("resize", this.handleWindowResize.bind(this));
  // Seems to be more responsive to quick snaps and changes.
  resizeObserver = new ResizeObserver((entries) => {
    handleWindowResize(message);
  });
  resizeObserver.observe(document.documentElement);
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
