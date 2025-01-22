// By doing export default ... this allows this class to be imported and used elsewhere
export function setZOrderForSharedElements(game) {
  // Set the depth of the game canvas to be all the way in the back
  game.canvas.style.position = "absolute";
  game.canvas.style.left = "0";
  game.canvas.style.top = "0";

  // Get a reference to the css objects we want to position
  const gameHeader = document.querySelector(".game-header-banner");
  const updateTilegridButton = document.querySelector(
    ".updateTilegrid-button-container"
  );
  const resetTilegridButton = document.querySelector(
    ".resetTilegrid-button-container"
  );
  const muteSoundButton = document.querySelector(".mute-button-container");
  const difficultySelectionBoxContainer = document.querySelector(
    ".difficulty-selection-box-container"
  );
  const solToggleBoxContainer = document.querySelector(
    ".solution-selection-box-container"
  );
  const flipTileInfoButtonContainer = document.querySelector(
    ".info-button-container"
  );
  const scoreText = document.querySelector(".score-text");

  const closeButtons = document.querySelectorAll(".close-button");
  const infoBoxs = document.querySelectorAll(".info-box");

  // Set the z-index property for all other objs\
  // helloWorldBox.style.zIndex = "-1"; // far back
  game.canvas.style.zIndex = "0";
  gameHeader.style.zIndex = "2";
  difficultySelectionBoxContainer.style.zIndex = "3";
  solToggleBoxContainer.style.zIndex = "3";
  updateTilegridButton.style.zIndex = "4";
  resetTilegridButton.style.zIndex = "4";
  muteSoundButton.style.zIndex = "4";
  flipTileInfoButtonContainer.style.zIndex = "4";

  scoreText.style.zIndex = "5";

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
