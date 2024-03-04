function createHeader() {
  // Create a container div for the header box
  var headerContainer = document.createElement("div");
  headerContainer.classList.add("header-box");

  // Create a div for header banner itself
  var headerBannerDiv = document.createElement("header");
  headerBannerDiv.classList.add("header-banner");

  // Create a container div for the title text / logo stuff
  var titleContainer = document.createElement("div");
  titleContainer.classList.add("title-container");

  // Create an image element for the logo
  var logoImage = document.createElement("img");
  logoImage.src = "Shared-General-Assets/pngs/Mars_circle.png";
  logoImage.classList.add("logo-image");

  // Create an h1 element for the title
  var titleElement = document.createElement("h1");
  titleElement.textContent = "SHANE'S GAMES";
  titleElement.classList.add("title-text-style");

  // Create a div for the subtitle text
  var subtitleDiv = document.createElement("div");
  subtitleDiv.classList.add("sub-title-text");
  subtitleDiv.textContent = "Black Hole Reject";

  // Github button
  var githubLinkElement = document.createElement("a");
  githubLinkElement.href = "https://github.com/ShaneBonkowski";
  githubLinkElement.target = "_blank"; // Open link in a new tab
  githubLinkElement.classList.add("header-button-link");

  var githubButtonContainer = document.createElement("div");
  githubButtonContainer.classList.add("header-button-container");
  githubButtonContainer.classList.add("github-button-container");

  var githubText = document.createElement("div");
  githubText.classList.add("header-button-text");
  githubText.classList.add("github-text");
  githubText.textContent = "GitHub";

  var githubIconElement = document.createElement("i");
  githubIconElement.classList.add("fab", "fa-github");

  githubButtonContainer.appendChild(githubIconElement);
  githubButtonContainer.appendChild(githubText);
  githubLinkElement.appendChild(githubButtonContainer);

  // About me button
  var aboutMeLinkElement = document.createElement("a");
  aboutMeLinkElement.href = "about.html";
  aboutMeLinkElement.classList.add("header-button-link");

  var aboutMeButtonContainer = document.createElement("div");
  aboutMeButtonContainer.classList.add("header-button-container");
  aboutMeButtonContainer.classList.add("about-me-button-container");

  var aboutMeText = document.createElement("div");
  aboutMeText.classList.add("header-button-text");
  aboutMeText.classList.add("about-me-text");
  aboutMeText.textContent = "About Me";

  aboutMeButtonContainer.appendChild(aboutMeText);
  aboutMeLinkElement.appendChild(aboutMeButtonContainer);

  // home button
  var homeLinkElement = document.createElement("a");
  homeLinkElement.href = "index.html";
  homeLinkElement.classList.add("header-button-link");

  var homeButtonContainer = document.createElement("div");
  homeButtonContainer.classList.add("header-button-container");
  homeButtonContainer.classList.add("home-button-container");

  var homeText = document.createElement("div");
  homeText.classList.add("header-button-text");
  homeText.classList.add("home-text");
  homeText.textContent = "Games";

  homeButtonContainer.appendChild(homeText);
  homeLinkElement.appendChild(homeButtonContainer);

  // Append elements to their containers
  titleContainer.appendChild(titleElement);
  titleContainer.appendChild(subtitleDiv);
  titleContainer.appendChild(logoImage);
  headerBannerDiv.appendChild(titleContainer);
  headerBannerDiv.appendChild(githubLinkElement);
  headerBannerDiv.appendChild(aboutMeLinkElement);
  headerBannerDiv.appendChild(homeLinkElement);

  headerContainer.appendChild(headerBannerDiv);

  // Append the container to the body of the document
  document.body.appendChild(headerContainer);

  // Create and append blank space at the end
  var blankSpace = document.createElement("div");
  blankSpace.classList.add("game-box-blank-space");
  document.body.appendChild(blankSpace);
}
