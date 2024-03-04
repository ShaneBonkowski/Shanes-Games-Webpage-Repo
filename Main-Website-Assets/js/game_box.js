// Define the createGameBox function
function createGameBox(imageSrc, linkUrl, titleText, gameDescriptionText) {
  // Create a container div for the box
  var boxContainer = document.createElement("div");
  boxContainer.classList.add("game-box");

  // Create a container div for the button
  var buttonContainer = document.createElement("div");
  buttonContainer.classList.add("game-box-button-container");

  // Create an anchor element for the button link
  var buttonLinkElement = document.createElement("a");
  buttonLinkElement.href = linkUrl;
  buttonLinkElement.classList.add("game-box-button-link-anchor");

  // Create an image element for the button
  var imageButton = document.createElement("img");
  imageButton.src = imageSrc;
  imageButton.classList.add("game-button");
  // imageButton.classList.add("game-button-hover-effect"); // Add hover effects with CSS

  // Create an anchor element for the title link
  var titleLinkElement = document.createElement("a");
  titleLinkElement.href = linkUrl;
  titleLinkElement.classList.add("title-link-anchor");

  // Create a div for the title
  var titleDiv = document.createElement("div");
  titleDiv.classList.add("game-title");
  titleDiv.textContent = titleText;

  // Create a container div for the game desc. text
  var gameDescContainer = document.createElement("div");
  gameDescContainer.classList.add("game-desc-container");

  // Create a div for the game desc. text
  var gameDescTextDiv = document.createElement("div");
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
  var blankSpace = document.createElement("div");
  blankSpace.classList.add("game-box-blank-space");
  document.body.appendChild(blankSpace);
}
