/**
 * @module ContentBox
 *
 * @author Shane Bonkowski
 */

import { createFooter } from "/Main-Website-Assets/js/footer.js";
import { addClickAnimation } from "/Shared-General-Assets/js/clickAnimation.js";
import { handleContentBoxHover } from "/Main-Website-Assets/js/content_box_hover_handling.js";

// Array of content box data
export const contentBoxes = [
  {
    imageUrl: "games/Better-Boids-Game/webps/Game_Cover_Picture.webp",
    linkUrl: "games/Better-Boids-Game/BetterBoids.html",
    title: "Better Boids",
    description:
      "A unique twist to the classic Boids algorithm. Player controlled Boid, predator-prey relationships, customizable toggles & more",
    openInNewTab: false,
  },
  {
    imageUrl: "games/Flip-Tile-Game/webps/Cover_Art.webp",
    linkUrl: "games/Flip-Tile-Game/FlipTile.html",
    title: "Flip Tile",
    description:
      "Classic 'lights out' style puzzle game. Flipping one tile causes neighboring tiles to flip as well. Match them all to advance further!",
    openInNewTab: false,
  },
  {
    imageUrl: "Main-Website-Assets/webps/SOSS_cover_art.webp",
    linkUrl:
      "https://store.steampowered.com/app/2061040/Save_Our_Solar_System/",
    title: "Save Our Solar System",
    description:
      "(Steam Game) Stave off countless waves of asteroids as you fight to protect the Solar System from extinction. A fresh look on the tower defense genre!",
    openInNewTab: true,
  },
  {
    imageUrl: "Main-Website-Assets/webps/AD_cover_art.webp",
    linkUrl: "https://store.steampowered.com/app/2506740/Abyssal_Descent/",
    title: "Abyssal Descent",
    description:
      "(Steam Game) Embark on an epic platformer adventure through procedurally generated caves, solving intricate puzzles, and battling fearsome enemies!",
    openInNewTab: true,
  },
  // !!!!!!!!!!!!!!!
  // PLACEHOLDER COMING SOON BOX ALWAYS AT THE END. PUT NEW BOXES BEFORE THIS
  // !!!!!!!!!!!!!!!
  {
    imageUrl: "Main-Website-Assets/webps/Coming_Soon_Image_Option_2.webp",
    linkUrl: "https://github.com/ShaneBonkowski",
    title: "More Coming Soon...",
    description:
      "Nothing much here for now. Just a link to my GitHub. Keep an eye out for new games, writing, and art on the way!",
    openInNewTab: true,
  },
];

/**
 * Creates a content box containing an image button linked to a piece of content such as game, art, or writing, and a description of the content.
 * @param {string} imageSrc - The source URL (local path in this case) of the image for the content button. Must be 500 by 422 px!
 * @param {string} linkUrl - The URL of the content page or website to be taken to clicked on.
 * @param {string} titleText - The title text to display for the content.
 * @param {string} contentDescriptionText - The description text of the content.
 * @param {boolean} [openInNewTab=false] - A boolean indicating whether the link should open in a new tab.
 */
export function createContentBox(
  imageSrc,
  linkUrl,
  titleText,
  contentDescriptionText,
  openInNewTab = false
) {
  // Create a container div for the box
  const boxContainer = document.createElement("div");
  boxContainer.classList.add("content-box");

  // Create a container div for the button
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("content-box-button-container");

  // Create an anchor element for the button link
  const buttonLinkElement = document.createElement("a");
  buttonLinkElement.href = linkUrl;
  buttonLinkElement.classList.add("content-box-button-link-anchor");

  if (openInNewTab) {
    buttonLinkElement.target = "_blank";
  }

  // Create an image element for the button.
  // Image must be 500 by 422 px!
  const imageButton = document.createElement("img");
  imageButton.src = imageSrc;
  imageButton.classList.add("content-button");
  // imageButton.classList.add("content-button-hover-effect"); // Add hover effects with CSS

  // Create an anchor element for the title link
  const titleLinkElement = document.createElement("a");
  titleLinkElement.href = linkUrl;
  titleLinkElement.classList.add("title-link-anchor");

  if (openInNewTab) {
    titleLinkElement.target = "_blank";
  }

  // Create a div for the title
  const titleDiv = document.createElement("div");
  titleDiv.classList.add("content-title");
  titleDiv.textContent = titleText;

  // Create a container div for the content desc. text
  const contentDescContainer = document.createElement("div");
  contentDescContainer.classList.add("content-desc-container");

  // Create a div for the content desc. text
  const contentDescTextDiv = document.createElement("div");
  contentDescTextDiv.classList.add("content-description-text");
  contentDescTextDiv.textContent = contentDescriptionText;

  // Append elements to their containers
  buttonLinkElement.appendChild(imageButton);
  buttonContainer.appendChild(buttonLinkElement);

  titleLinkElement.appendChild(titleDiv);
  contentDescContainer.appendChild(titleLinkElement);
  contentDescContainer.appendChild(contentDescTextDiv);

  boxContainer.appendChild(buttonContainer);
  boxContainer.appendChild(contentDescContainer);

  // Append the container to the body of the document
  document.body.appendChild(boxContainer);

  // Create and append blank space after the content box
  const blankSpace = document.createElement("div");
  blankSpace.classList.add("content-box-blank-space");
  document.body.appendChild(blankSpace);
}

export function postContentBoxRendering() {
  createFooter();
  handleContentBoxHover();

  // Apply click animation to all <a> elements
  const links = document.querySelectorAll("a");
  addClickAnimation(links);
}

function removePostContentBoxRendering() {
  const contentBoxElements = document.querySelectorAll(".content-box");
  contentBoxElements.forEach((element) => {
    element.remove();
  });

  const contentBoxBlankSpaceElements = document.querySelectorAll(
    ".content-box-blank-space"
  );
  contentBoxBlankSpaceElements.forEach((element) => {
    element.remove();
  });

  const footerBannerElements = document.querySelectorAll(".footer-banner");
  footerBannerElements.forEach((element) => {
    element.remove();
  });

  const emptySpaceForFooter = document.querySelectorAll(
    ".blank-space-for-footer"
  );
  emptySpaceForFooter.forEach((element) => {
    element.remove();
  });
}

/**
 * Filters and displays content boxes based on the search query.
 * @param {string} query - The search query.
 */
export function searchContent(query) {
  // Query and delete everything that is rendered after the content boxes
  removePostContentBoxRendering();

  // Remove no-results-found-text if it exists
  const noResultsFoundText = document.querySelectorAll(
    ".no-results-found-text"
  );
  noResultsFoundText.forEach((element) => {
    element.remove();
  });

  // Filter to find close matches to titles and descriptions of content
  let filteredContentBoxes;
  if (query !== "") {
    filteredContentBoxes = contentBoxes.filter((contentBox) => {
      const nameMatch = contentBox.title
        .toLowerCase()
        .includes(query.toLowerCase());
      const descriptionMatch = contentBox.description
        .toLowerCase()
        .includes(query.toLowerCase());
      return nameMatch || descriptionMatch;
    });
  } else {
    // If query is empty, return all content boxes
    filteredContentBoxes = contentBoxes;
  }

  // Re-render the content boxes
  if (filteredContentBoxes.length > 0) {
    filteredContentBoxes.forEach((contentBox) => {
      createContentBox(
        contentBox.imageUrl,
        contentBox.linkUrl,
        contentBox.title,
        contentBox.description,
        contentBox.openInNewTab
      );
    });
  } else {
    // No results found!
    const noResultsDiv = document.createElement("div");
    noResultsDiv.classList.add("no-results-found-text");
    noResultsDiv.innerHTML = "<p>No results found...</p>";
    document.body.appendChild(noResultsDiv);
  }

  // Re-render everything that comes after the content box rendering
  postContentBoxRendering();
}
