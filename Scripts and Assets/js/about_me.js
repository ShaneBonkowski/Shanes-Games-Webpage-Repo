function createAboutMe() {
  // Create a container div for the box
  var boxContainer = document.createElement("div");
  boxContainer.classList.add("about-me-box");

  // Create an image element
  var imageAboutMe = document.createElement("img");
  imageAboutMe.src = "pngs/Radiohead.png";
  imageAboutMe.classList.add("about-me-image");

  // Create a container div for the image (where we will rendrer the light blue space helmet for the radio dude)
  var imageContainer = document.createElement("div");
  imageContainer.classList.add("about-me-image-container");

  // Create an h1 element for the title
  var titleElement = document.createElement("h1");
  titleElement.textContent = "About Shane";
  titleElement.classList.add("about-me-title");

  // Create a div for the sub title text
  var subTitleTextDiv = document.createElement("div");
  subTitleTextDiv.textContent =
    "I am an Aerospace Engineer, Game Developer, and ...";
  subTitleTextDiv.classList.add("about-me-sub-title-text");

  // Create a div for the rest of the text
  var mainTextDiv = document.createElement("div");
  mainTextDiv.textContent =
    "My name is Shane, and I like to make games. I have been doing this for a while at this point. Testing the rest here. Testing the rest here. Testing the rest here. Testing the rest here. ";
  mainTextDiv.classList.add("about-me-main-text");

  // Append elements to their containers
  imageContainer.appendChild(imageAboutMe);
  boxContainer.appendChild(imageContainer);
  boxContainer.appendChild(titleElement);
  boxContainer.appendChild(mainTextDiv);
  boxContainer.appendChild(subTitleTextDiv);

  // Append the container to the body of the document
  document.body.appendChild(boxContainer);

  // Create and append blank space after
  var blankSpace = document.createElement("div");
  blankSpace.classList.add("game-box-blank-space");
  document.body.appendChild(blankSpace);
}
