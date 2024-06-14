/**
 * Adds a click/touch animation to the specified element(s).
 *
 * This function requires CSS to define the .active class for the desired elements
 * to apply the visual effect on click/touch.
 *
 * Example CSS:
 * .info-button.active {
 *   filter: brightness(0.7);
 * }
 *
 * @param {HTMLElement|NodeList} elements - The element(s) to which the animation should be applied.
 * @param {number} [delay=200] - The duration of the animation in milliseconds.
 */
export function addClickAnimation(elements, delay = 200) {
  // Convert a single element to an array, so that this works with/without a list
  if (elements instanceof HTMLElement) {
    elements = [elements];
  }

  function handleClick(event) {
    const element = event.currentTarget;

    // Add 'active' class to apply effects on click,
    // then remove it after the specified delay.
    element.classList.add("active");
    setTimeout(() => {
      element.classList.remove("active");
    }, delay);
  }

  // Add event listeners to each element
  elements.forEach((element) => {
    element.addEventListener("click", handleClick);
    element.addEventListener("touchstart", handleClick);
  });
}
