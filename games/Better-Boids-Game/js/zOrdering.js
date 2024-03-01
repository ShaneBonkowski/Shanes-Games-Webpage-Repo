// By doing export default ... this allows this class to be imported and used elsewhere
export function setZOrderForSharedElements(game) {
  // Set the depth of the game canvas to be all the way in the back
  game.canvas.style.position = "absolute";
  game.canvas.style.left = "0";
  game.canvas.style.top = "0";

  // Get a reference to the css objects we want to position
  var gameHeader = document.querySelector(".game-header-banner");
  // var helloWorldBox = document.querySelector(".hello-world-box ");
  var sliderContainers = document.querySelectorAll(".slider-container");
  var closeButtons = document.querySelectorAll(".close-button");
  var infoButtons = document.querySelectorAll(".info-button");
  var infoBoxs = document.querySelectorAll(".info-box");

  // Set the z-index property for all other objs\
  // helloWorldBox.style.zIndex = "-1"; // far back
  game.canvas.style.zIndex = "0";
  gameHeader.style.zIndex = "2";

  sliderContainers.forEach((sliderContainer) => {
    sliderContainer.style.zIndex = "3";
  });
  infoButtons.forEach((infoButton) => {
    infoButton.style.zIndex = "4";
  });
  infoBoxs.forEach((infoBox) => {
    infoBox.style.zIndex = "5";
  });
  closeButtons.forEach((closeButton) => {
    closeButton.style.zIndex = "6";
  });
}

export function setZOrderForMainGameElements(game) {
  // Set the depth of any extra elements that main-game-scene.js adds or requires
  // that are unique to those in setZOrderForSharedElements()
}
