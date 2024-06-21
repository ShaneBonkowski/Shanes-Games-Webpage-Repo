/**
 * @module AboutMe
 *
 * @author Shane Bonkowski
 */

/**
 * Creates an "About Me" section for the website.
 */
export function createAboutMe() {
  const boxContainer = document.createElement("div");
  boxContainer.classList.add("about-me-box");

  const imageAboutMe = document.createElement("img");
  imageAboutMe.src = "Main-Website-Assets/webps/Radiohead.webp";
  imageAboutMe.classList.add("about-me-image");

  const imageContainer = document.createElement("div");
  imageContainer.classList.add("about-me-image-container");

  // Create a single HTML element for text with different font sizes
  const textContainer = document.createElement("div");
  textContainer.classList.add("about-me-text-container");
  textContainer.innerHTML = `
    <h1 class="about-me-title">Shane Bonkowski</h1>
    <p class="about-me-subtitle">Engineering, Software & Game Development, Art, Writing, and really anything in between.</p>
    <p class="about-me-main-text">I'm a lifelong learner with a degree in Aerospace Engineering from the University of Maryland, College Park. Despite my formal education, my journey into programming and game development has been almost entirely "self-taught" on the internet.</p>
    <p class="about-me-main-text">I'm a firm believer in the power of open source and collaboration. In making the decision to open source all of the games I create here on GitHub, I hope to empower others to modify, improve, and maybe even learn a thing or two from my work.</p>
    <p class="about-me-main-text">If you'd like to connect or learn more about my professional background, feel free to visit my LinkedIn profile. I'm always eager to collaborate, connect, and share ideas.</p>
  `;

  // Append elements to their containers
  imageContainer.appendChild(imageAboutMe);
  boxContainer.appendChild(imageContainer);
  boxContainer.appendChild(textContainer);

  // Append the container to the body of the document
  document.body.appendChild(boxContainer);
}
