/**
 * @module Footer
 *
 * @author Shane Bonkowski
 */

import { createButtonLinkElement } from "./buttons.js";
/**
 * Creates a footer for the website.
 * @param {HTMLElement|null} parentElement - The parent element to which the footer will be appended (optional).
 */
export function createFooter(parentElement = null) {
  // Create a container div for the footer box
  var footerContainer = document.createElement("footer");
  footerContainer.classList.add("footer-banner");

  // Create a div for the footer main text
  var footerMainTextDiv = document.createElement("div");
  footerMainTextDiv.classList.add("footer-main-text");
  // footerMainTextDiv.textContent =
  //   "Thanks for visiting!\nShane's Games by me (Shane)";
  footerMainTextDiv.innerHTML = `
    Thanks for visiting Shane's Games by me (Shane)<br>
    <a href="././privacy-policy.html">Privacy Policy</a>
`;

  // LinkedIn button
  var linkedInLinkElement = createButtonLinkElement(
    "LinkedIn",
    "https://www.linkedin.com/in/shanebonkowski/",
    ["linkedIn-button-link"],
    ["linkedIn-text"],
    ["fab", "fa-linkedin"],
    ["linkedIn-button-container"],
    true
  );

  // Append elements to their containers
  footerContainer.appendChild(footerMainTextDiv);
  footerContainer.appendChild(linkedInLinkElement);

  // Append the container to the body of the document
  // or a parent element if provided
  if (parentElement != null) {
    parentElement.appendChild(footerContainer);
  } else {
    document.body.appendChild(footerContainer);
  }
}
