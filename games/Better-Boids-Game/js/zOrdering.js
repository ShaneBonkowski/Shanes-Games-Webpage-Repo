// By doing export default ... this allows this class to be imported and used elsewhere
export function setZOrderForSharedElements(game) {
  // Set the depth of the game canvas to be all the way in the back
  game.canvas.style.position = "absolute";
  game.canvas.style.left = "0";
  game.canvas.style.top = "0";

  // Get a reference to the css objects we want to position
  var gameHeader = document.querySelector(".game-header-banner");
  var settingsSidePanels = document.querySelectorAll(".settings-side-panel");
  var sliderContainers = document.querySelectorAll(".slider-container");
  var toggleBoxContainers = document.querySelectorAll(".toggle-box-container");
  var closeButtons = document.querySelectorAll(".close-button");
  var infoButtonContainers = document.querySelectorAll(
    ".info-button-container"
  );
  var settingsButtonContainers = document.querySelectorAll(
    ".settings-button-container"
  );
  var infoButtons = document.querySelectorAll(".info-button");
  var infoBoxs = document.querySelectorAll(".info-box");

  // Set the z-index property for all other objs\
  // helloWorldBox.style.zIndex = "-1"; // far back
  game.canvas.style.zIndex = "0";
  gameHeader.style.zIndex = "2";

  settingsSidePanels.forEach((settingsSidePanel) => {
    settingsSidePanel.style.zIndex = "4";
  });
  sliderContainers.forEach((sliderContainer) => {
    sliderContainer.style.zIndex = "5";
  });
  toggleBoxContainers.forEach((toggleBoxContainer) => {
    toggleBoxContainer.style.zIndex = "5";
  });
  settingsButtonContainers.forEach((settingsButtonContainer) => {
    settingsButtonContainer.style.zIndex = "6";
  });
  infoButtonContainers.forEach((infoButtonContainer) => {
    infoButtonContainer.style.zIndex = "6";
  });
  infoButtons.forEach((infoButton) => {
    infoButton.style.zIndex = "6";
  });
  infoBoxs.forEach((infoBox) => {
    infoBox.style.zIndex = "7";
  });
  closeButtons.forEach((closeButton) => {
    closeButton.style.zIndex = "8";
  });
}

export function setZOrderForMainGameElements(game) {
  // Set the depth of any extra elements that main-game-scene.js adds or requires
  // that are unique to those in setZOrderForSharedElements()
}
