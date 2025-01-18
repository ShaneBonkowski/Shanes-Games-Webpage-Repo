import { createUIWindow } from "../../../Main-Website-Assets/js/window.js";
import { createFunctionButtonContainer } from "../../../Main-Website-Assets/js/buttons.js";
import { genericGameEventNames } from "/games/Shared-Game-Assets/js/game-scene-2d.js";

export function addInfoBox() {
  // Create infoWindow window and content
  const infoWindow = createUIWindow(
    "infoWindow",
    "",
    `
      <h2>About Boids</h2>
      <p>
        The
        <a href="https://en.wikipedia.org/wiki/Boids" target="_blank">Boids algorithm</a>, 
        devised by Craig Reynolds, mimics the flocking behavior seen in birds and other animals. 
        In general, Boids follow three rules:
      </p>
      <ul>
        <li><b>Alignment:</b> Boids try to align their direction with other nearby Boids.</li>
        <li><b>Cohesion:</b> Boids move towards the average position of nearby Boids.</li>
        <li><b>Separation:</b> Boids avoid crowding near other Boids.</li>
      </ul>
      <p>
        From these three simple rules, complex emergent behavior and intricate patterns can arise. 
        This little game is an attempt to display the beauty in the Boids algorithm, while expanding on it with novel concepts where applicable.
      </p>
    `,
    [closeInfoWindow, onClickX],
    ["info-box"],
    ["info-header"],
    ["info-content"],
    ["close-button"]
  );

  // Create an open info Button
  const infoButtonContainer = createFunctionButtonContainer(
    "infoButtonContainer",
    "infoButton",
    "../Better-Boids-Game/webps/Boids-Logo-Option-2.webp",
    "Info Icon",
    "i",
    [onClickInfo, openInfoWindow],
    ["info-button-container"],
    ["info-icon-img"],
    ["info-icon-text"],
    ["info-button"]
  );
  infoButtonContainer.classList.add("disable-browser-default-touch-actions");

  // Append infoButtonContainer and infoWindow to document body
  document.body.appendChild(infoButtonContainer);
  document.body.appendChild(infoWindow);

  // Show the info Window when the button is clicked
  function onClickInfo() {
    let customEvent = new CustomEvent(genericGameEventNames.uiMenuOpen, {
      detail: {
        message: "Info Menu Opened",
      },
    });
    document.dispatchEvent(customEvent);
  }

  function openInfoWindow() {
    infoWindow.style.display = "block";
  }

  // Close the info Window when the close button is clicked
  function onClickX() {
    let customEvent = new CustomEvent(genericGameEventNames.uiMenuClosed, {
      detail: {
        message: "Info Menu Closed",
      },
    });
    document.dispatchEvent(customEvent);
  }
  function closeInfoWindow() {
    infoWindow.style.display = "none";
  }
}
