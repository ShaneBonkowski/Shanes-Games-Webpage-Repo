/**
 * @module Footer
 *
 * @author Shane Bonkowski
 */

import { createLinkButtonContainer } from "./buttons.js";
/**
 * Creates a footer for the website.
 * @param {HTMLElement|null} parentElement - The parent element to which the footer will be appended (optional).
 */
export function createFooter(parentElement = null) {
  // Create a container div for the footer box
  const footerContainer = document.createElement("footer");
  footerContainer.classList.add("footer-banner");

  // Create a div for the footer main text
  const footerMainTextDiv = document.createElement("div");
  footerMainTextDiv.classList.add("footer-main-text");
  // footerMainTextDiv.textContent =
  //   "Thanks for visiting!\nShane's Games by me (Shane)";
  footerMainTextDiv.innerHTML = `
    Thanks for visiting Shane's Games by me (Shane)<br>
    <a href="././privacy-policy.html">Privacy Policy</a>
`;

  // LinkedIn button
  const linkedInButtonContainer = createLinkButtonContainer(
    "LinkedIn",
    "https://www.linkedin.com/in/shanebonkowski/",
    ["linkedIn-text"],
    ["fab", "fa-linkedin"],
    ["linkedIn-button-container"],
    true
  );

  // Append elements to their containers
  footerContainer.appendChild(footerMainTextDiv);
  footerContainer.appendChild(linkedInButtonContainer);

  // Create an empty div element that will fill blank space
  // before inserting the footer. This ensures that footer
  // is always at the bottom, even if the content doesnt fill
  // the whole page.
  const emptyDiv = document.createElement("div");
  emptyDiv.classList.add("blank-space-for-footer");
  document.body.appendChild(emptyDiv);

  // Append the container to the body of the document
  // or a parent element if provided
  if (parentElement != null) {
    parentElement.appendChild(footerContainer);
  } else {
    document.body.appendChild(footerContainer);
  }
}
