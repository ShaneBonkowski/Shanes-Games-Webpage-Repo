/**
 * @module Header
 *
 * @author Shane Bonkowski
 */

import { createLinkButtonContainer } from "./buttons.js";
import { createImage } from "../../Shared-General-Assets/js/asset-promises.js";
import { addClickAnimation } from "../../Shared-General-Assets/js/click-animation.js";

/**
 * Creates a header containing a logo, title, subtitle, and navigation buttons.
 * @param {string} logoImageSrc - The source URL (local path in this case) of the logo image.
 */
export function createHeader(logoImageSrc) {
  // Create a div for header banner itself
  const headerContainer = document.createElement("header");
  headerContainer.classList.add("header-banner");

  // Create a container div for the logo
  const titleContainer = document.createElement("div");
  titleContainer.classList.add("title-container");

  // Add event listener to title logo container, so it takes you to a link on click
  titleContainer.addEventListener("click", function () {
    window.location.href = "/index.html"; // Redirect to index.html
  });

  // Have a lil anim on click for the logo container too
  addClickAnimation(titleContainer);

  // Logo image, title, subtitle
  const logoImage = document.createElement("img");
  logoImage.classList.add("logo-image");
  logoImage.src = logoImageSrc;

  const titleElement = document.createElement("h1");
  titleElement.textContent = "SHANE'S GAMES";
  titleElement.classList.add("title-text-style");

  const subtitleDiv = document.createElement("div");
  subtitleDiv.classList.add("sub-title-text");
  subtitleDiv.textContent = "Black Hole Reject";

  const headerButtonsParent = document.createElement("div");
  headerButtonsParent.classList.add("header-buttons-parent");

  // Github button
  const githubButtonContainer = createLinkButtonContainer(
    "GitHub",
    "https://github.com/ShaneBonkowski",
    ["header-button-text", "github-text"],
    ["fab", "fa-github"],
    ["header-button-container", "github-button-container"],
    true
  );

  // About me button
  const aboutMeButtonContainer = createLinkButtonContainer(
    "About Me",
    "/Main-Website-Assets/about.html",
    ["header-button-text", "about-me-text"],
    [],
    ["header-button-container", "about-me-button-container"],
    false
  );

  // Home button
  const homeButtonContainer = createLinkButtonContainer(
    "Content",
    "/index.html",
    ["header-button-text", "home-text"],
    [],
    ["header-button-container", "home-button-container"],
    false
  );

  // Append elements to their containers
  titleContainer.appendChild(logoImage);
  titleElement.appendChild(subtitleDiv);
  titleContainer.appendChild(titleElement);
  headerContainer.appendChild(titleContainer);
  headerButtonsParent.appendChild(aboutMeButtonContainer);
  headerButtonsParent.appendChild(githubButtonContainer);
  headerButtonsParent.appendChild(homeButtonContainer);
  headerContainer.appendChild(headerButtonsParent);

  // Append the container to the body of the document
  document.body.appendChild(headerContainer);
}
