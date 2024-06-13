/**
 * @fileOverview Creates a UI button with desired styling, image, etc.
 *
 * @module UIButton
 *
 * @author Shane Bonkowski
 */

/**
 * Returns a div container that contains a UI button with desired image, text, etc.
 * @param {string} containerId - The ID of the container element to which the button will be added.
 * @param {string} buttonId - The ID of the button element.
 * @param {string} imgSrc - The source URL of the button icon image (local path to image).
 * @param {string} imgAlt - The alternative text for the button icon image.
 * @param {string} buttonText - The text content to be displared on the button.
 * @param {Function[]} onClickButtonFunctions - An array of click event handler functions for the button to execute on click.
 * @param {string[]} [buttonContainerClasses=[]] - An array of CSS classes to be added to the button container.
 * @param {string[]} [buttonIconClasses=[]] - An array of CSS classes to be added to the button icon image.
 * @param {string[]} [buttonTextClasses=[]] - An array of CSS classes to be added to the button text content.
 * @param {string[]} [buttonClasses=[]] - An array of CSS classes to be added to the button element.
 * @returns {HTMLDivElement} The container element containing the button.
 */
export function addUIButton(
  containerId,
  buttonId,
  imgSrc,
  imgAlt,
  buttonText,
  onClickButtonFunctions,
  buttonContainerClasses = [],
  buttonIconClasses = [],
  buttonTextClasses = [],
  buttonClasses = []
) {
  const buttonContainer = document.createElement("div");
  buttonContainer.id = containerId;
  buttonContainer.classList.add(...buttonContainerClasses);

  const button = document.createElement("button");
  button.id = buttonId;
  button.classList.add(...buttonClasses);

  const imgElement = document.createElement("img");
  imgElement.classList.add(...buttonIconClasses);
  imgElement.src = imgSrc;
  imgElement.alt = imgAlt;

  const textElement = document.createElement("span");
  textElement.classList.add(...buttonTextClasses);
  textElement.textContent = buttonText;

  onClickButtonFunctions.forEach((func) => {
    button.addEventListener("click", func);
  });

  button.appendChild(imgElement);
  button.appendChild(textElement);

  // Have a lil anim on click
  function handleClick() {
    // Add 'active' class to apply effects on click.
    // Then remove it soon after
    button.classList.add("active");

    setTimeout(() => {
      button.classList.remove("active");
    }, 200);
  }
  button.addEventListener("click", handleClick);
  button.addEventListener("touchstart", handleClick);

  buttonContainer.appendChild(button);

  return buttonContainer;
}
