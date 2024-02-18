function createAboutMe() {
  // Create a container div for the box
  var boxContainer = document.createElement("div");
  boxContainer.classList.add("about-me-box");

  // Create an image element
  var imageAboutMe = document.createElement("img");
  imageAboutMe.src = "Main-Website-Assets/pngs/Radiohead.png";
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
    "Engineering, Software Development, Game Development, Data Analysis, and really anything in between.";
  subTitleTextDiv.classList.add("about-me-sub-title-text");

  // Create a div for the rest of the text
  var mainTextDiv = document.createElement("div");
  const aboutMeParagraph = `
I'm a lifelong learner with a degree in Aerospace Engineering from the University of Maryland, College Park. Despite my formal education, my journey into programming and game development has been almost entirely "self-taught" on the internet. 

Hench why I'm a firm believer in the power of open source and collaboration. In making the decision to open source all of the games I create here on GitHub, I hope to empower others to modify, enhance, and maybe even learn a thing or two from my work. Together, we can foster a community of creativity and innovation. 
  
If you'd like to connect or learn more about my professional background, feel free to visit my LinkedIn profile. I'm always eager to collaborate, connect, and share ideas.
`;
  mainTextDiv.textContent = aboutMeParagraph;
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
  blankSpace.classList.add("about-me-blank-space");
  document.body.appendChild(blankSpace);
}
