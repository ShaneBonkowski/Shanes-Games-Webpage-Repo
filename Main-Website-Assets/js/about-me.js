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
  imageAboutMe.src = "/Main-Website-Assets/webps/Radiohead.webp";
  imageAboutMe.classList.add("about-me-image");

  const imageContainer = document.createElement("div");
  imageContainer.classList.add("about-me-image-container");

  // Create a single HTML element for text with different font sizes
  const textContainer = document.createElement("div");
  textContainer.classList.add("about-me-text-container");
  textContainer.innerHTML = `
    <h1 class="about-me-title">Shane Bonkowski</h1>
    <p class="about-me-subtitle">Engineering, Software & Game Development, Art, Writing, and really anything in between.</p>
    <p class="about-me-main-text">I'm a lifelong learner with a degree in Aerospace Engineering from the University of Maryland, College Park. I love creating—whether it's games, short stories, art, or even this custom website.</p>
    <p class="about-me-main-text">Everything on this website is open source and available on my <a href="https://github.com/ShaneBonkowski" target="_blank">GitHub</a>. Feel free to use my code as a starting point to create your own content.</p>
    <p class="about-me-main-text">Shane's Games embodies the recreational side of me. If you'd like to learn more about my professional background, visit my <a href="https://www.linkedin.com/in/shanebonkowski/" target="_blank">LinkedIn</a> profile. I'm always eager to collaborate, exchange ideas, and make new connections!</p>
  `;

  // Append elements to their containers
  imageContainer.appendChild(imageAboutMe);
  boxContainer.appendChild(imageContainer);
  boxContainer.appendChild(textContainer);

  // Append the container to the body of the document
  document.body.appendChild(boxContainer);
}
