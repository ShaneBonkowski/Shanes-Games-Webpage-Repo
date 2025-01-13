/**
 * @fileOverview Creates Yes/No box for the main website. Useful for cookie agreement, etc.
 *
 * @module YesNoBox
 *
 * @author Shane Bonkowski
 */

import { addClickAnimation } from "/Shared-General-Assets/js/click-animation.js";

/**
 * Creates a generic yes-no message box for the main website.
 *
 * @param {string} boxID - The ID attribute for the box element.
 * @param {string} messageText - The message or prompt displayed in the box.
 * @param {string} yesButtonID - The ID attribute for the yes button element.
 * @param {string} yesButtonText - The text for the yes button. e.g. "Yes"
 * @param {Function} onYes - Function to execute when the "Yes" button is clicked.
 * @param {string} noButtonID - The ID attribute for the no button element.
 * @param {string} noButtonText - The text for the no button. e.g. "No"
 * @param {Function} onNo - Function to execute when the "No" button is clicked.
 * @param {string[]} [boxClasses=[]] - CSS classes for the outer box element.
 * @param {string[]} [buttonContainerClasses=[]] - CSS classes for the button container.
 */
export function createYesNoBox(
  boxID,
  messageText,
  yesButtonID,
  yesButtonText,
  onYes,
  noButtonID,
  noButtonText,
  onNo,
  boxClasses = [],
  buttonContainerClasses = []
) {
  // Box element is a container for the "banner", yes button, no button, etc.
  const box = document.createElement("div");
  box.id = boxID;
  box.classList.add(...boxClasses);

  const message = document.createElement("p");
  message.innerHTML = messageText;

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add(...buttonContainerClasses);

  const yesButton = document.createElement("button");
  yesButton.id = yesButtonID;
  yesButton.textContent = yesButtonText;
  yesButton.addEventListener("click", onYes);
  addClickAnimation(yesButton);

  const noButton = document.createElement("button");
  noButton.id = noButtonID;
  noButton.textContent = noButtonText;
  noButton.addEventListener("click", onNo);
  addClickAnimation(noButton);

  buttonContainer.appendChild(yesButton);
  buttonContainer.appendChild(noButton);
  box.appendChild(message);
  box.appendChild(buttonContainer);

  return box;
}
