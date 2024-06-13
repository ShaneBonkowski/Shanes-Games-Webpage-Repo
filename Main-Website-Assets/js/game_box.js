/**
 * @module GameBox
 *
 * @author Shane Bonkowski
 */

/**
 * Creates a game box containing an image button linked to a game and a description of the game.
 * @param {string} imageSrc - The source URL (local path in this case) of the image for the game button. Must be 500 by 422 px!
 * @param {string} linkUrl - The URL of the game page or website to be taken to when game is clicked on.
 * @param {string} titleText - The title text to display for the game.
 * @param {string} gameDescriptionText - The description text of the game.
 * @param {boolean} [openInNewTab=false] - A boolean indicating whether the link should open in a new tab.
 */
function createGameBox(
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
