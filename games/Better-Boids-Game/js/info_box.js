import { createUIWindow } from "../../Shared-Game-Assets/js/ui_window.js";
import { addUIButton } from "../../Shared-Game-Assets/js/ui_button.js";
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
    `,
    [closeInfoWindow, onClickX],
    ["info-box"],
    ["info-header"],
    ["info-content"],
    ["close-button"]
  );

  // Create an open info Button
  const infoButtonContainer = addUIButton(
    "infoButtonContainer",
    "infoButton",
    "../Better-Boids-Game/pngs/Boids_Logo_Option_2.png",
    "Info Icon",
    "i",
    [onClickInfo, openInfoWindow],
    ["info-button-container"],
    ["info-icon-img"],
    ["info-icon-text"],
    ["info-button"]
  );

  // Append infoButtonContainer and infoWindow to document body
  document.body.appendChild(infoButtonContainer);
  document.body.appendChild(infoWindow);

  // Show the info Window when the button is clicked
  function onClickInfo() {
    var customEvent = new CustomEvent("uiMenuOpen", {
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
    var customEvent = new CustomEvent("uiMenuClosed", {
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
