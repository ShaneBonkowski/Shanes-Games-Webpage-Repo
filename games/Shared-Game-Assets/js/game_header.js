/**
 * Creates the Game Header element which includes the
 * Shane's Game's Logo that can be clicked on to take
 * a user back to the main html page, as well as a logo
 * for the given game.
 * @param {string} gameName - The name of the game.
 * @param {string} gameIconSrc - The local path to the game icon image.
 * @param {number} gameLogoContainerLeftMarginPercentageComputer - The left margin percentage for the game logo container on a computer screen.
 * @param {number} gameLogoContainerLeftMarginPercentagePhone - The left margin percentage for the game logo container on a phone screen.
 * @param {number} gameTitleXShiftPercentage - The horizontal shift percentage for the game title.
 * @param {number} gameTitleYShiftPercentage - The vertical shift percentage for the game title.
 * @returns {HTMLElement} Game Header element.
 */
function createGameHeader(
  gameName,
  gameIconSrc,
  gameLogoContainerLeftMarginPercentageComputer,
  gameLogoContainerLeftMarginPercentagePhone,
  gameTitleXShiftPercentage,
  gameTitleYShiftPercentage
) {
  var gameHeaderContainer = document.createElement("div");
  gameHeaderContainer.classList.add("game-header-banner");
  gameHeaderContainer.classList.add("disable-browser-default-touch-actions");

  // Build out Shanes Games Logo components
  var shanesGamesLogoContainer = document.createElement("div");
  shanesGamesLogoContainer.classList.add("shanes-games-logo-container");
  shanesGamesLogoContainer.classList.add(
    "disable-browser-default-touch-actions"
  );

  var shanesGamesLogoIcon = document.createElement("img");
  shanesGamesLogoIcon.src =
    "../../Shared-General-Assets/pngs/Mars_circle_logo_small.png"; // ShanesGames logo
  shanesGamesLogoIcon.classList.add("main-logo-image");
  shanesGamesLogoIcon.classList.add("disable-browser-default-touch-actions");

  var shanesGamesLogoTitle = document.createElement("h1");
  shanesGamesLogoTitle.textContent = "SHANE'S GAMES";
  shanesGamesLogoTitle.classList.add("game-title-style");
  shanesGamesLogoTitle.classList.add("main-logo-title");
  shanesGamesLogoTitle.classList.add("disable-browser-default-touch-actions");

  var shanesGamesLogoSubtitle = document.createElement("h2");
  shanesGamesLogoSubtitle.textContent = "Black Hole Reject";
  shanesGamesLogoSubtitle.classList.add("game-subtitle-style");
  shanesGamesLogoSubtitle.classList.add("main-logo-subtitle");
  shanesGamesLogoSubtitle.classList.add(
    "disable-browser-default-touch-actions"
  );

  // Append icon, title, and subtitle to the ShanesGames Logo container
  shanesGamesLogoContainer.appendChild(shanesGamesLogoIcon);
  shanesGamesLogoContainer.appendChild(shanesGamesLogoTitle);
  shanesGamesLogoContainer.appendChild(shanesGamesLogoSubtitle);

  // Add event listener to logo container, so it takes you to a link on click
  shanesGamesLogoContainer.addEventListener("click", function () {
    window.location.href = "../../index.html"; // Redirect to index.html
  });

  // Build out Generic Game Logo components
  var gameLogoContainer = document.createElement("div");
  gameLogoContainer.classList.add("game-logo-container");
  gameLogoContainer.classList.add("disable-browser-default-touch-actions");

  // Set location of gameLogoContainer, and have it change when window size changes
  function updateGameLogoContainer() {
    var screenWidth = window.innerWidth;
    if (screenWidth <= 600) {
      gameLogoContainer.style.marginLeft =
        gameLogoContainerLeftMarginPercentagePhone + "%";
    } else {
      gameLogoContainer.style.marginLeft =
        gameLogoContainerLeftMarginPercentageComputer + "%";
    }
  }
  updateGameLogoContainer();
  window.addEventListener("resize", updateGameLogoContainer);

  var gameLogoImage = document.createElement("img");
  gameLogoImage.src = gameIconSrc;
  gameLogoImage.alt = gameName;
  gameLogoImage.classList.add("game-logo-image");
  gameLogoImage.classList.add("disable-browser-default-touch-actions");

  var gameTitle = document.createElement("h1");
  gameTitle.textContent = gameName;
  gameTitle.classList.add("game-title-style");
  gameTitle.classList.add("game-title");
  gameTitle.classList.add("disable-browser-default-touch-actions");
  gameTitle.style.transform = `translate(${gameTitleXShiftPercentage}%, ${gameTitleYShiftPercentage}%)`;

  // Append image and title to the Game Logo container
  gameLogoContainer.appendChild(gameLogoImage);
  gameLogoContainer.appendChild(gameTitle);

  // Append ShanesGames Logo and Game Logo containers to the header container
  gameHeaderContainer.appendChild(shanesGamesLogoContainer);
  gameHeaderContainer.appendChild(gameLogoContainer);

  // Append the header container to the document body
  document.body.appendChild(gameHeaderContainer);
}
