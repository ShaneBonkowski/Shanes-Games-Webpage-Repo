/**
 * @module GameBoxHover
 *
 * @author Shane Bonkowski
 */

/**
 * Function to add neccesary event listeners etc. to game boxes so that they behave as desired on hover
 */
export function handleGameBoxHover() {
  // Get all game boxes in the scene
  let gameBoxes = document.querySelectorAll(".game-box");

  // Iterate over each game box
  gameBoxes.forEach(function (box) {
    // Get references to the button and title elements contained within this box (aka children)
    const button = box.querySelector(".game-button");
    const title = box.querySelector(".game-title");

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

    // Handle click here too and have a lil anim on click
    // Note: addClickAnimation(...) is not used here because
    // this is a unique case where button and title are coupled,
    // so if one is "active" we want the other to be too.
    function handleClick() {
      // Add 'active' class to apply effects on click.
      // Then remove it soon after
      button.classList.add("game-button-click-effect");
      title.classList.add("game-button-click-effect");

      setTimeout(() => {
        button.classList.remove("game-button-click-effect");
        title.classList.remove("game-button-click-effect");
      }, 200);
    }
    button.addEventListener("click", handleClick);
    button.addEventListener("touchstart", handleClick);
    title.addEventListener("click", handleClick);
    title.addEventListener("touchstart", handleClick);
  });
}
