/**
 * @module Buttons
 *
 * @author Shane Bonkowski
 */

/**
 * Creates a button element that, when clicked, redirects the user to the specified URL.
 * @param {string} text - The text content to be displayed on the button.
 * @param {string} url - The URL to redirect to when the button is clicked.
 * @param {string[]} [linkClasses=[]] - An array of CSS classes to be added to the link element.
 * @param {string[]} [buttonTextClasses=[]] - An array of CSS classes to be added to the button text content.
 * @param {string[]} [iconClasses=[]] - An array of CSS classes to be added to the button icon element.
 * @param {string[]} [containerClasses=[]] - An array of CSS classes to be added to the button container element.
 * @param {boolean} [openInNewTab=false] - A boolean indicating whether the link should open in a new tab.
 * @returns {HTMLAnchorElement} The created button link element.
 */
export function createButtonLinkElement(
  text,
  url,
  linkClasses = [],
  buttonTextClasses = [],
  iconClasses = [],
  containerClasses = [],
  openInNewTab = false
) {
  // Creates a button that on click takes you to a link.
  // The link element holds the button, text, and icon
  var linkElement = document.createElement("a");
  linkElement.href = url;
  if (openInNewTab) {
    linkElement.target = "_blank";
  }
  linkElement.classList.add(...linkClasses);

  // Initialize container and text
  var buttonContainer = document.createElement("div");
  buttonContainer.classList.add(...containerClasses);

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
  linkElement.appendChild(buttonContainer);

  return linkElement;
}
