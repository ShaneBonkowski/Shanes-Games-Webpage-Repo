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
  footerMainTextDiv.innerHTML = `
Thanks for visiting Shane's Games by me (Shane)<br>
`;

  const footerPrivacyPolicyTextDiv = document.createElement("div");
  footerPrivacyPolicyTextDiv.classList.add("footer-priv-policy-text");
  footerPrivacyPolicyTextDiv.innerHTML = `
<a href="/Main-Website-Assets/privacy-policy.html">Privacy Policy</a>
`;

  // Add buttons to footer
  const footerButtonsParent = document.createElement("div");
  footerButtonsParent.classList.add("footer-buttons-parent");

  const homeButtonContainer = createLinkButtonContainer(
    null,
    "https://shanebonkowski.com/",
    [],
    ["fas", "fa-home"],
    ["footer-button-container"],
    // Do not open in new tab for home!
    false
  );
  const githubButtonContainer = createLinkButtonContainer(
    null,
    "https://github.com/ShaneBonkowski",
    [],
    ["fab", "fa-github"],
    ["footer-button-container"],
    true
  );
  const linkedInButtonContainer = createLinkButtonContainer(
    null,
    "https://www.linkedin.com/in/shanebonkowski/",
    [],
    ["fab", "fa-linkedin"],
    ["footer-button-container"],
    true
  );

  // Append elements to their containers
  footerContainer.appendChild(footerMainTextDiv);

  footerButtonsParent.appendChild(homeButtonContainer);
  footerButtonsParent.appendChild(githubButtonContainer);
  footerButtonsParent.appendChild(linkedInButtonContainer);
  footerContainer.appendChild(footerButtonsParent);

  footerContainer.appendChild(footerPrivacyPolicyTextDiv);

  // Create an empty div element that will fill blank space
  // before inserting the footer. This ensures that footer
  // is always at the bottom, even if the content doesnt fill
  // the whole page.
  const emptyDiv = document.createElement("div");
  emptyDiv.classList.add("flex-grow-for-footer");
  document.body.appendChild(emptyDiv);

  // Append the container to the body of the document
  // or a parent element if provided
  if (parentElement != null) {
    parentElement.appendChild(footerContainer);
  } else {
    document.body.appendChild(footerContainer);
  }
}
