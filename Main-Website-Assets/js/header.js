/**
 * @module Header
 *
 * @author Shane Bonkowski
 */

import { createLinkButtonContainer } from "./buttons.js";
import { createImage } from "../../Shared-General-Assets/js/assetPromises.js";

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
    "/about.html",
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
  titleContainer.appendChild(titleElement);
  titleContainer.appendChild(subtitleDiv);
  titleContainer.appendChild(logoImage);
  headerContainer.appendChild(titleContainer);
  headerContainer.appendChild(githubButtonContainer);
  headerContainer.appendChild(aboutMeButtonContainer);
  headerContainer.appendChild(homeButtonContainer);

  // Append the container to the body of the document
  document.body.appendChild(headerContainer);
}
