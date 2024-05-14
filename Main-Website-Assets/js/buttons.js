/**
 * @module Buttons
 *
 * @author Shane Bonkowski
 */

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
export function createButtonWithContainer(
  text,
  url,
  buttonTextClasses = [],
  iconClasses = [],
  containerClasses = [],
  openInNewTab = false
) {
  // Creates a button that on click takes you to a link.
  // Initialize container and text
  var buttonContainer = document.createElement("a");
  buttonContainer.classList.add(...containerClasses);
  buttonContainer.href = url;
  if (openInNewTab) {
    buttonContainer.target = "_blank";
  }

  var buttonText = document.createElement("div");
  buttonText.classList.add(...buttonTextClasses);
  buttonText.textContent = text;

  // Optionally create button icon element
  if (iconClasses.length > 0) {
    var iconElement = document.createElement("i");
    iconElement.classList.add(...iconClasses);
    buttonContainer.appendChild(iconElement);
  }

  // Append children
  buttonContainer.appendChild(buttonText);

  return buttonContainer;
}
