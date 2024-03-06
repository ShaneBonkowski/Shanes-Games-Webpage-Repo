import { createButtonLinkElement } from "./buttons.js";
export function createHeader() {
  // Create a container div for the header box
  var headerContainer = document.createElement("div");
  headerContainer.classList.add("header-box");

  // Create a div for header banner itself
  var headerBannerDiv = document.createElement("header");
  headerBannerDiv.classList.add("header-banner");

  // Create a container div for the logo
  var titleContainer = document.createElement("div");
  titleContainer.classList.add("title-container");

  // Logo image, title, subtitle
  var logoImage = document.createElement("img");
  logoImage.src = "Shared-General-Assets/pngs/Mars_circle.png";
  logoImage.classList.add("logo-image");

  var titleElement = document.createElement("h1");
  titleElement.textContent = "SHANE'S GAMES";
  titleElement.classList.add("title-text-style");

  var subtitleDiv = document.createElement("div");
  subtitleDiv.classList.add("sub-title-text");
  subtitleDiv.textContent = "Black Hole Reject";

  // Github button
  var githubLinkElement = createButtonLinkElement(
    "GitHub",
    "https://github.com/ShaneBonkowski",
    ["header-button-link"],
    ["header-button-text", "github-text"],
    ["fab", "fa-github"],
    ["header-button-container", "github-button-container"],
    true
  );

  // About me button
  var aboutMeLinkElement = createButtonLinkElement(
    "About Me",
    "about.html",
    ["header-button-link"],
    ["header-button-text", "about-me-text"],
    [],
    ["header-button-container", "about-me-button-container"],
    false
  );

  // Home button
  var homeLinkElement = createButtonLinkElement(
    "Games",
    "index.html",
    ["header-button-link"],
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
  headerBannerDiv.appendChild(githubLinkElement);
  headerBannerDiv.appendChild(aboutMeLinkElement);
  headerBannerDiv.appendChild(homeLinkElement);
  headerContainer.appendChild(headerBannerDiv);

  // Append the container to the body of the document
  document.body.appendChild(headerContainer);

  // Create and append blank space at the end
  var blankSpace = document.createElement("div");
  blankSpace.classList.add("game-box-blank-space");
  document.body.appendChild(blankSpace);
}
