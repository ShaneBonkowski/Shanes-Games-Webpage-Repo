function createGameHeader(gameName, gameIconSrc) {
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
  shanesGamesLogoIcon.src = "../../Shared-General-Assets/pngs/Mars_circle.png"; // ShanesGames logo
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

  // Append image and title to the Game Logo container
  gameLogoContainer.appendChild(gameLogoImage);
  gameLogoContainer.appendChild(gameTitle);

  // Append ShanesGames Logo and Game Logo containers to the header container
  gameHeaderContainer.appendChild(shanesGamesLogoContainer);
  gameHeaderContainer.appendChild(gameLogoContainer);

  // Append the header container to the document body
  document.body.appendChild(gameHeaderContainer);
}
