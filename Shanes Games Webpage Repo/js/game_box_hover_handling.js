function handleGameBoxHover() {
  // Get all game boxes in the scene
  var gameBoxes = document.querySelectorAll(".game-box");

  // Iterate over each game box
  gameBoxes.forEach(function (box) {
    // Get references to the button and title elements contained within this box (aka children)
    var button = box.querySelector(".game-button");
    var title = box.querySelector(".game-title");

    // Add event listeners to synchronize hover effects, such that when we hover over either
    // the button or the title, both of them have their hover effects occur.
    button.addEventListener("mouseenter", handleHover);
    button.addEventListener("mouseleave", handleHover);
    title.addEventListener("mouseenter", handleHover);
    title.addEventListener("mouseleave", handleHover);

    // Function to handle hover effects
    function handleHover() {
      button.classList.toggle("game-button-hover-effect");
      title.classList.toggle("game-title-hover-effect");
    }
  });
}
