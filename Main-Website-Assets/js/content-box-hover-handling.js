/**
 * Function to add neccesary event listeners etc. to content boxes so that they behave as desired on hover
 */
export function handleContentBoxHover() {
  let contentBoxes = document.querySelectorAll(".content-box");

  contentBoxes.forEach(function (box) {
    const button = box.querySelector(".content-button");
    const title = box.querySelector(".content-title");

    // Add event listeners to synchronize hover effects, such that when we hover over either
    // the button or the title, both of them have their hover effects occur.
    let hoverTimeout;

    button.addEventListener("pointerenter", () => {
      clearTimeout(hoverTimeout);
      button.classList.add("content-button-hover-effect");
      title.classList.add("content-title-hover-effect");
    });

    button.addEventListener("pointerleave", () => {
      hoverTimeout = setTimeout(() => {
        button.classList.remove("content-button-hover-effect");
        title.classList.remove("content-title-hover-effect");
      }, 10); // Delay of 100ms
    });

    title.addEventListener("pointerenter", () => {
      clearTimeout(hoverTimeout);
      button.classList.add("content-button-hover-effect");
      title.classList.add("content-title-hover-effect");
    });

    title.addEventListener("pointerleave", () => {
      hoverTimeout = setTimeout(() => {
        button.classList.remove("content-button-hover-effect");
        title.classList.remove("content-title-hover-effect");
      }, 10); // Delay of 100ms
    });

    // Handle click here too and have a lil anim on click
    // Note: addClickAnimation(...) is not used here because
    // this is a unique case where button and title are coupled,
    // so if one is "active" we want the other to be too.
    function handleClick() {
      // Add 'active' class to apply effects on click.
      // Then remove it soon after
      button.classList.add("content-button-click-effect");
      title.classList.add("content-button-click-effect");

      setTimeout(() => {
        button.classList.remove("content-button-click-effect");
        title.classList.remove("content-button-click-effect");
      }, 200);
    }
    button.addEventListener("pointerdown", handleClick);
    title.addEventListener("pointerdown", handleClick);
  });
}
