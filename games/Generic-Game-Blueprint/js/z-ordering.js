/**
 * @module GameNameZOrdering
 *
 * @author Author Name
 */

export function setZOrderForSharedElements(game) {
  // Set the depth of the game canvas to be all the way in the back
  game.canvas.style.position = "absolute";
  game.canvas.style.left = "0";
  game.canvas.style.top = "0";
  game.canvas.style.zIndex = "0";

  // Get a reference to the css objects we want to position
  const gameHeader = document.querySelector(".game-header-banner");

  // Set the z-index property for all other objs
  gameHeader.style.zIndex = "1";
}

export function setZOrderForMainGameElements(game) {
  // Set the depth of any extra elements that main-game-scene.js adds or requires
  // that are unique to those in setZOrderForSharedElements()
}
