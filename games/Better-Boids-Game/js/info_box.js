function addInfoBox() {
  // Create info Button
  const infoButtonContainer = document.createElement("div");
  infoButtonContainer.id = "infoButtonContainer";
  infoButtonContainer.classList.add("info-button-container");

  const infoButton = document.createElement("button");
  infoButton.id = "infoButton";
  infoButton.classList.add("info-button");

  const infoIconText = document.createElement("span");
  infoIconText.classList.add("info-icon-text");
  infoIconText.textContent = "i";

  const infoImgElement = document.createElement("img");
  infoImgElement.classList.add("info-icon-img");
  infoImgElement.src = "../Better-Boids-Game/pngs/Boids_Logo_Option_2.png";
  infoImgElement.alt = "Info Icon";

  infoButton.addEventListener("click", function () {
    var customEvent = new CustomEvent("uiMenuOpen", {
      detail: {
        message: "Info Menu Opened",
      },
    });
    document.dispatchEvent(customEvent);
  });

  // Append elements to create button
  infoButton.appendChild(infoImgElement);
  infoButton.appendChild(infoIconText);
  infoButtonContainer.appendChild(infoButton);

  // Create infoBox and content
  const infoBox = document.createElement("div");
  infoBox.id = "infoBox";
  infoBox.classList.add("info-box");

  const infoHeader = document.createElement("div");
  infoHeader.classList.add("info-header");

  const closeButton = document.createElement("span");
  closeButton.classList.add("close-button");
  closeButton.textContent = "x";
  closeButton.onclick = closeInfoBox;

  closeButton.addEventListener("click", function () {
    var customEvent = new CustomEvent("uiMenuClosed", {
      detail: {
        message: "Info Menu Closed",
      },
    });

    document.dispatchEvent(customEvent);
  });

  const infoContent = document.createElement("div");
  infoContent.classList.add("info-content");

  // Create heading and paragraphs for infoContent
  infoContent.innerHTML = `
  <h2>About Boids</h2>
  <p>
    The
    <a href="https://en.wikipedia.org/wiki/Boids" target="_blank">
      Boids algorithm
    </a>, devised by Craig Reynolds, mimics the flocking behavior seen in birds and other animals. 
    In general, Boids typically have three rules:
  </p>
  <ul>
    <li>Alignment: Boids try to align their direction with other nearby Boids</li>
    <li>Cohesion: Boids move towards the average position of nearby Boids</li>
    <li>Separation: Boids avoid crowding together</li>
  </ul>
  <p>
    From these three simple rules, complex emergent behavior and intricate patterns can arise. 
    This little game is an attempt to display the beauty in the Boids algorithm, while expanding on it with novel concepts where applicable.
  </p>
`;

  // Append elements to create infoBox
  infoHeader.appendChild(closeButton);
  infoBox.appendChild(infoHeader);
  infoBox.appendChild(infoContent);

  // Append infoButtonContainer and infoBox to document body
  document.body.appendChild(infoButtonContainer);
  document.body.appendChild(infoBox);

  // Show the info box when the button is clicked
  infoButton.addEventListener("click", () => {
    infoBox.style.display = "block";
  });

  // Close the info box when the close button is clicked
  function closeInfoBox() {
    infoBox.style.display = "none";
  }
}
