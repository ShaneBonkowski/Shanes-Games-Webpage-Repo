/**
 * @module GameBox
 *
 * @author Shane Bonkowski
 */

import { createFooter } from "/Main-Website-Assets/js/footer.js";
import { addClickAnimation } from "/Shared-General-Assets/js/clickAnimation.js";
import { handleGameBoxHover } from "/Main-Website-Assets/js/game_box_hover_handling.js";

// Array of game box data
export const gameBoxes = [
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
    title: "More Games Coming Soon...",
    description:
      "Nothing much here for now. Just a link to my GitHub. Keep an eye out for new games on the way!",
    openInNewTab: true,
  },
];

/**
 * Creates a game box containing an image button linked to a game and a description of the game.
 * @param {string} imageSrc - The source URL (local path in this case) of the image for the game button. Must be 500 by 422 px!
 * @param {string} linkUrl - The URL of the game page or website to be taken to when game is clicked on.
 * @param {string} titleText - The title text to display for the game.
 * @param {string} gameDescriptionText - The description text of the game.
 * @param {boolean} [openInNewTab=false] - A boolean indicating whether the link should open in a new tab.
 */
export function createGameBox(
  imageSrc,
  linkUrl,
  titleText,
  gameDescriptionText,
  openInNewTab = false
) {
  // Create a container div for the box
  const boxContainer = document.createElement("div");
  boxContainer.classList.add("game-box");

  // Create a container div for the button
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("game-box-button-container");

  // Create an anchor element for the button link
  const buttonLinkElement = document.createElement("a");
  buttonLinkElement.href = linkUrl;
  buttonLinkElement.classList.add("game-box-button-link-anchor");

  if (openInNewTab) {
    buttonLinkElement.target = "_blank";
  }

  // Create an image element for the button.
  // Image must be 500 by 422 px!
  const imageButton = document.createElement("img");
  imageButton.src = imageSrc;
  imageButton.classList.add("game-button");
  // imageButton.classList.add("game-button-hover-effect"); // Add hover effects with CSS

  // Create an anchor element for the title link
  const titleLinkElement = document.createElement("a");
  titleLinkElement.href = linkUrl;
  titleLinkElement.classList.add("title-link-anchor");

  if (openInNewTab) {
    titleLinkElement.target = "_blank";
  }

  // Create a div for the title
  const titleDiv = document.createElement("div");
  titleDiv.classList.add("game-title");
  titleDiv.textContent = titleText;

  // Create a container div for the game desc. text
  const gameDescContainer = document.createElement("div");
  gameDescContainer.classList.add("game-desc-container");

  // Create a div for the game desc. text
  const gameDescTextDiv = document.createElement("div");
  gameDescTextDiv.classList.add("game-description-text");
  gameDescTextDiv.textContent = gameDescriptionText;

  // Append elements to their containers
  buttonLinkElement.appendChild(imageButton);
  buttonContainer.appendChild(buttonLinkElement);

  titleLinkElement.appendChild(titleDiv);
  gameDescContainer.appendChild(titleLinkElement);
  gameDescContainer.appendChild(gameDescTextDiv);

  boxContainer.appendChild(buttonContainer);
  boxContainer.appendChild(gameDescContainer);

  // Append the container to the body of the document
  document.body.appendChild(boxContainer);

  // Create and append blank space after the game box
  const blankSpace = document.createElement("div");
  blankSpace.classList.add("game-box-blank-space");
  document.body.appendChild(blankSpace);
}

export function postGameBoxRendering() {
  createFooter();
  handleGameBoxHover();

  // Apply click animation to all <a> elements
  const links = document.querySelectorAll("a");
  addClickAnimation(links);
}

function removePostGameBoxRendering() {
  const gameBoxElements = document.querySelectorAll(".game-box");
  gameBoxElements.forEach((element) => {
    element.remove();
  });

  const gameBoxBlankSpaceElements = document.querySelectorAll(
    ".game-box-blank-space"
  );
  gameBoxBlankSpaceElements.forEach((element) => {
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
 * Filters and displays game boxes based on the search query.
 * @param {string} query - The search query.
 */
export function searchGames(query) {
  // Query and delete everything that is rendered after the game boxes
  removePostGameBoxRendering();

  // Remove no-results-found-text if it exists
  const noResultsFoundText = document.querySelectorAll(
    ".no-results-found-text"
  );
  noResultsFoundText.forEach((element) => {
    element.remove();
  });

  // Filter to find close matches to titles and descriptions of games
  let filteredGameBoxes;
  if (query !== "") {
    filteredGameBoxes = gameBoxes.filter((gameBox) => {
      const nameMatch = gameBox.title
        .toLowerCase()
        .includes(query.toLowerCase());
      const descriptionMatch = gameBox.description
        .toLowerCase()
        .includes(query.toLowerCase());
      return nameMatch || descriptionMatch;
    });
  } else {
    // If query is empty, return all game boxes
    filteredGameBoxes = gameBoxes;
  }

  // Re-render the game boxes
  if (filteredGameBoxes.length > 0) {
    filteredGameBoxes.forEach((gameBox) => {
      createGameBox(
        gameBox.imageUrl,
        gameBox.linkUrl,
        gameBox.title,
        gameBox.description,
        gameBox.openInNewTab
      );
    });
  } else {
    // No results found!
    const noResultsDiv = document.createElement("div");
    noResultsDiv.classList.add("no-results-found-text");
    noResultsDiv.innerHTML = "<p>No results found...</p>";
    document.body.appendChild(noResultsDiv);
  }

  // Re-render everything that comes after the game box rendering
  postGameBoxRendering();
}
