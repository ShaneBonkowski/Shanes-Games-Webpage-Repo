export function setZOrderForSharedElements(game) {
  // Set the depth of the game canvas to be all the way in the back
  game.canvas.style.position = "absolute";
  game.canvas.style.left = "0";
  game.canvas.style.top = "0";
  game.canvas.style.zIndex = "0";

  // Get a reference to the css objects we want to position
  const gameHeader = document.querySelector(".game-header-banner");
  const infoButtonContainer = document.querySelector(".info-button-container");
  const togglePauseButtonContainer = document.querySelector(
    ".toggle-pause-button-container"
  );
  const advanceButtonContainer = document.querySelector(
    ".advance-button-container"
  );
  const resetTilesButtonContainer = document.querySelector(
    ".reset-tiles-button-container"
  );
  const closeButtons = document.querySelectorAll(".close-button");
  const infoBoxs = document.querySelectorAll(".info-box");

  // Set the z-index property for all other objs\
  // helloWorldBox.style.zIndex = "-1"; // far back
  game.canvas.style.zIndex = "0";
  gameHeader.style.zIndex = "2";
  infoButtonContainer.style.zIndex = "3";
  togglePauseButtonContainer.style.zIndex = "3";
  advanceButtonContainer.style.zIndex = "3";
  resetTilesButtonContainer.style.zIndex = "3";

  infoBoxs.forEach((infoBox) => {
    infoBox.style.zIndex = "6";
  });
  closeButtons.forEach((closeButton) => {
    closeButton.style.zIndex = "7";
  });
}

export function setZOrderForMainGameElements(game) {
  // Set the depth of any extra elements that main-game-scene.js adds or requires
  // that are unique to those in setZOrderForSharedElements()
}
