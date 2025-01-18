import { addClickAnimation } from "/Shared-General-Assets/js/click-animation.js";

/**
 * Creates the Game Header element which includes the
 * Shane's Game's Logo that can be clicked on to take
 * a user back to the main html page, as well as a logo
 * for the given game.
 * @param {string} gameName - The name of the game.
 * @param {string} gameIconSrc - The local path to the game icon image. Must be 200 by 200 px!
 * @param {number} gameTitleLeftMarginPx - The left margin for the game logo title in px.
 * @returns {HTMLElement} Game Header element.
 */
export function createGameHeader(gameName, gameIconSrc, gameTitleLeftMarginPx) {
  const gameHeaderContainer = document.createElement("div");
  gameHeaderContainer.classList.add("game-header-banner");
  gameHeaderContainer.classList.add("disable-browser-default-touch-actions");

  // Build out Shanes Games Logo components
  const shanesGamesLogoContainer = document.createElement("div");
  shanesGamesLogoContainer.classList.add("shanes-games-logo-container");
  shanesGamesLogoContainer.classList.add(
    "disable-browser-default-touch-actions"
  );

  const shanesGamesLogoIcon = document.createElement("img");
  shanesGamesLogoIcon.src =
    "../../Shared-General-Assets/webps/Mars-circle-logo-small.webp"; // ShanesGames logo
  shanesGamesLogoIcon.classList.add("main-logo-image");
  shanesGamesLogoIcon.classList.add("disable-browser-default-touch-actions");

  const shanesGamesLogoTitle = document.createElement("h1");
  shanesGamesLogoTitle.textContent = "SHANE'S GAMES";
  shanesGamesLogoTitle.classList.add("game-title-style");
  shanesGamesLogoTitle.classList.add("main-logo-title");
  shanesGamesLogoTitle.classList.add("disable-browser-default-touch-actions");

  const shanesGamesLogoSubtitle = document.createElement("h2");
  shanesGamesLogoSubtitle.textContent = "Black Hole Reject";
  shanesGamesLogoSubtitle.classList.add("game-subtitle-style");
  shanesGamesLogoSubtitle.classList.add("main-logo-subtitle");
  shanesGamesLogoSubtitle.classList.add(
    "disable-browser-default-touch-actions"
  );

  // Append icon, title, and subtitle to the ShanesGames Logo container
  shanesGamesLogoContainer.appendChild(shanesGamesLogoIcon);
  shanesGamesLogoTitle.appendChild(shanesGamesLogoSubtitle);
  shanesGamesLogoContainer.appendChild(shanesGamesLogoTitle);

  // Add event listener to logo container, so it takes you to a link on click
  shanesGamesLogoContainer.addEventListener("pointerdown", function () {
    window.location.href = "/index.html"; // Redirect to index.html
  });

  // Have a lil anim on click for the logo container too
  addClickAnimation(shanesGamesLogoContainer);

  // Build out Generic Game Logo components
  const gameLogoContainer = document.createElement("div");
  gameLogoContainer.classList.add("game-logo-container");
  gameLogoContainer.classList.add("disable-browser-default-touch-actions");

  const gameLogoImage = document.createElement("img");
  gameLogoImage.src = gameIconSrc; // Must be 200 by 200 px!
  gameLogoImage.alt = gameName;
  gameLogoImage.classList.add("game-logo-image");
  gameLogoImage.classList.add("disable-browser-default-touch-actions");

  const gameTitle = document.createElement("h1");
  gameTitle.textContent = gameName;
  gameTitle.classList.add("game-title-style");
  gameTitle.classList.add("game-title");
  gameTitle.classList.add("disable-browser-default-touch-actions");
  gameTitle.style.margin = `0px 0px 0px ${gameTitleLeftMarginPx}px`;

  // Append image and title to the Game Logo container
  gameLogoContainer.appendChild(gameLogoImage);
  gameLogoContainer.appendChild(gameTitle);

  // Append ShanesGames Logo and Game Logo containers to the header container
  gameHeaderContainer.appendChild(shanesGamesLogoContainer);
  gameHeaderContainer.appendChild(gameLogoContainer);

  // Append the header container to the document body
  document.body.appendChild(gameHeaderContainer);
}
