// By doing export default ... this allows this class to be imported and used elsewhere
export function setZOrderForSharedElements(game) {
  // Set the depth of the game canvas to be all the way in the back
  game.canvas.style.position = "absolute";
  game.canvas.style.left = "0";
  game.canvas.style.top = "0";
  game.canvas.style.zIndex = "0";

  // Get a reference to the css objects we want to position
  var gameHeader = document.querySelector(".game-header-banner");
  // var helloWorldBox = document.querySelector(".hello-world-box ");
  var sliderContainers = document.querySelectorAll(".slider-container");
  var infoBoxContainers = document.querySelector(".info-box-container");
  var closeButton = document.querySelector(".close-button");
  var infoButton = document.querySelector(".info-button");
  var infoBox = document.querySelector(".info-box");

  // Set the z-index property for all other objs\
  // helloWorldBox.style.zIndex = "-1"; // far back
  // 0 is reserved for the canvas
  gameHeader.style.zIndex = "1"; // far front

  sliderContainers.forEach((sliderContainer) => {
    sliderContainer.style.zIndex = "2"; // bring to the far front
  });
  infoBoxContainers.style.zIndex = "3"; // bring to the far, far front
  infoButton.style.zIndex = "3"; // bring to the far, far front
  infoBox.style.zIndex = "4"; // bring to the far, far front
  closeButton.style.zIndex = "5"; // bring to the far, far front
}

export function setZOrderForMainGameElements(game) {
  // Set the depth of any extra elements that main-game-scene.js adds or requires
  // that are unique to those in setZOrderForSharedElements()
}
