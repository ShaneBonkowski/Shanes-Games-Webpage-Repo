/**
 * @module Buttons
 *
 * @author Shane Bonkowski
 */

import { addClickAnimation } from "/Shared-General-Assets/js/click-animation.js";

/**
 * Creates a button with a container that, when clicked, redirects the user to the specified URL.
 * @param {string} text - The text content to be displayed on the button.
 * @param {string} url - The URL to redirect to when the button is clicked.
 * @param {string[]} [buttonTextClasses=[]] - An array of CSS classes to be added to the button text content.
 * @param {string[]} [iconClasses=[]] - An array of CSS classes to be added to the button icon element.
 * @param {string[]} [containerClasses=[]] - An array of CSS classes to be added to the button container element.
 * @param {boolean} [openInNewTab=false] - A boolean indicating whether the link should open in a new tab.
 * @returns {HTMLDivElement} The created button container element.
 */
export function createLinkButtonContainer(
  text,
  url,
  buttonTextClasses = [],
  iconClasses = [],
  containerClasses = [],
  openInNewTab = false
) {
  // Creates a button that on click takes you to a link.
  // Initialize container and text
  const buttonContainer = document.createElement("a");
  buttonContainer.classList.add(...containerClasses);
  buttonContainer.href = url;
  if (openInNewTab) {
    buttonContainer.target = "_blank";
  }

  const buttonText = document.createElement("div");
  buttonText.classList.add(...buttonTextClasses);
  buttonText.textContent = text;

  // Optionally create button icon element
  if (iconClasses.length > 0) {
    const iconElement = document.createElement("i");
    iconElement.classList.add(...iconClasses);
    buttonContainer.appendChild(iconElement);
  }

  // Append children
  buttonContainer.appendChild(buttonText);

  // Have a lil anim on click
  addClickAnimation(buttonContainer);

  return buttonContainer;
}

/**
 * Returns a div container that contains a UI button with desired image, text, etc. This button runs desired funtions on click.
 * @param {string} containerId - The ID of the container element to which the button will be added.
 * @param {string} buttonId - The ID of the button element.
 * @param {string} imgSrc - The source URL of the button icon image (local path to image).
 * @param {string} imgAlt - The alternative text for the button icon image.
 * @param {string} buttonText - The text content to be displayed on the button.
 * @param {Function[]} onClickButtonFunctions - An array of click event handler functions for the button to execute on click.
 * @param {string[]} [buttonContainerClasses=[]] - An array of CSS classes to be added to the button container.
 * @param {string[]} [buttonImageClasses=[]] - An array of CSS classes to be added to the button icon image.
 * @param {string[]} [buttonTextClasses=[]] - An array of CSS classes to be added to the button text content.
 * @param {string[]} [buttonClasses=[]] - An array of CSS classes to be added to the button element.
 * @param {string[]} [iconClasses=[]] - An array of CSS classes to be added to the button icon element.
 * @returns {HTMLDivElement} The container element containing the button.
 */
export function createFunctionButtonContainer(
  containerId,
  buttonId,
  imgSrc,
  imgAlt,
  buttonText,
  onClickButtonFunctions,
  buttonContainerClasses = [],
  buttonImageClasses = [],
  buttonTextClasses = [],
  buttonClasses = [],
  iconClasses = []
) {
  const buttonContainer = document.createElement("div");
  buttonContainer.id = containerId;
  buttonContainer.classList.add(...buttonContainerClasses);

  const button = document.createElement("button");
  button.id = buttonId;
  button.classList.add(...buttonClasses);

  // Optionally add an img
  if (buttonImageClasses.length > 0) {
    const imgElement = document.createElement("img");
    imgElement.classList.add(...buttonImageClasses);
    imgElement.src = imgSrc;
    imgElement.alt = imgAlt;
    button.appendChild(imgElement);
  }

  // Optionally create button icon element
  if (iconClasses.length > 0) {
    const iconElement = document.createElement("i");
    iconElement.classList.add(...iconClasses);
    button.appendChild(iconElement);
  }

  // Optionally add text
  if (buttonTextClasses.length > 0) {
    const textElement = document.createElement("span");
    textElement.classList.add(...buttonTextClasses);
    textElement.textContent = buttonText;
    button.appendChild(textElement);
  }

  onClickButtonFunctions.forEach((func) => {
    button.addEventListener("click", func);
  });

  // Have a lil anim on click
  addClickAnimation(button);

  buttonContainer.appendChild(button);

  return buttonContainer;
}
