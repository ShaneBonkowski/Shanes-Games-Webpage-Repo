import { createButtonLinkElement } from "./buttons.js";
export function createFooter() {
  // Create a container div for the footer box
  var footerContainer = document.createElement("footer");
  footerContainer.classList.add("footer-banner");

  // Create a div for the footer main text
  var footerMainTextDiv = document.createElement("div");
  footerMainTextDiv.classList.add("footer-main-text");
  footerMainTextDiv.textContent =
    "Thanks for visiting!\nShane's (cool) games by me (Shane)";

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
  document.body.appendChild(footerContainer);
}
