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
  // Create a container div for the header box
  const headerContainer = document.createElement("div");
  headerContainer.classList.add("header-box");

  // Create a div for header banner itself
  const headerBannerDiv = document.createElement("header");
  headerBannerDiv.classList.add("header-banner");

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
    "about.html",
    ["header-button-text", "about-me-text"],
    [],
    ["header-button-container", "about-me-button-container"],
    false
  );

  // Home button
  const homeButtonContainer = createLinkButtonContainer(
    "Games",
    "index.html",
    ["header-button-text", "home-text"],
    [],
    ["header-button-container", "home-button-container"],
    false
  );

  // Append elements to their containers
  titleContainer.appendChild(titleElement);
  titleContainer.appendChild(subtitleDiv);
  titleContainer.appendChild(logoImage);
  headerBannerDiv.appendChild(titleContainer);
  headerBannerDiv.appendChild(githubButtonContainer);
  headerBannerDiv.appendChild(aboutMeButtonContainer);
  headerBannerDiv.appendChild(homeButtonContainer);
  headerContainer.appendChild(headerBannerDiv);

  // Append the container to the body of the document
  document.body.appendChild(headerContainer);

  // Create and append blank space at the end
  const blankSpace = document.createElement("div");
  blankSpace.classList.add("header-blank-space");
  document.body.appendChild(blankSpace);
}
