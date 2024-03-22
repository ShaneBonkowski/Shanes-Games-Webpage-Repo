import { addUIButton } from "../../Shared-Game-Assets/js/ui_button.js";
import { customEvents } from "./tile-utils.js";
import { createSelectionBox } from "../../Shared-Game-Assets/js/ui_selection_box.js";
import { createToggleBox } from "../../Shared-Game-Assets/js/ui_togglebox.js";
import { tiles } from "./main-game-scene.js";
import { createUIWindow } from "../../Shared-Game-Assets/js/ui_window.js";

export var ui_vars = {
  numCheckboxes: 3,
};

export function initUI() {
  // Add an info box
  addInfoBox();

  // Add a button to update the tilegrid layout
  function onClickUpdateTileGrid() {
    document.dispatchEvent(customEvents.tileGridChangeEvent);
  }
  const updateTilegridButtonContainer = addUIButton(
    "updateTilegridContainer",
    "updateTilegrid",
    "../Better-Boids-Game/pngs/Boids_Logo_Option_2.png",
    "Update Tilegrid Icon",
    "New Puzzle",
    onClickUpdateTileGrid,
    null,
    ["updateTilegrid-button-container"],
    ["fliptile-icon-img"],
    ["fliptile-icon-text"],
    ["fliptile-button"]
  );

  // Add a button to reset the tilegrid layout back to how it was
  function onClickResetTileGrid() {
    document.dispatchEvent(customEvents.tileGridResetEvent);
  }
  const resetTilegridButtonContainer = addUIButton(
    "resetTilegridContainer",
    "resetTilegrid",
    "../Better-Boids-Game/pngs/Boids_Logo_Option_2.png",
    "Reset Tilegrid Icon",
    "Reset Puzzle",
    onClickResetTileGrid,
    null,
    ["resetTilegrid-button-container"],
    ["fliptile-icon-img"],
    ["fliptile-icon-text"],
    ["fliptile-button"]
  );

  // Create selection boxes for the difficulty
  const difficultySelectionBoxContainer = document.createElement("div");
  difficultySelectionBoxContainer.id = "difficultySelectionBoxContainer";
  difficultySelectionBoxContainer.classList.add(
    "difficulty-selection-box-container"
  );
  createSelectionBox(
    ui_vars.numCheckboxes,
    `input-box-1`,
    ["Easy"],
    1,
    difficultySelectionBoxContainer,
    ["input-box-1"],
    ["input-box-label-1"],
    true // start off with this one checked
  );
  createSelectionBox(
    ui_vars.numCheckboxes,
    `input-box-2`,
    ["Hard"],
    2,
    difficultySelectionBoxContainer,
    ["input-box-2"],
    ["input-box-label-2"]
  );
  createSelectionBox(
    ui_vars.numCheckboxes,
    `input-box-3`,
    ["Extreme"],
    3,
    difficultySelectionBoxContainer,
    ["input-box-3"],
    ["input-box-label-3"]
  );

  // Toggle box to show solutions
  const solutionToggleBox = createToggleBox(
    "Reveal Solution",
    function (checked) {
      // Update leaderBoidEnabled variable
      if (checked) {
        // Reveal text for all tiles
        for (let row = 0; row < tiles.length; row++) {
          for (let col = 0; col < tiles[row].length; col++) {
            let tile = tiles[row][col];

            // Make sure tile exists
            if (tile) {
              tile.showText();
            }
          }
        }
      } else {
        // Hide text for all tiles
        for (let row = 0; row < tiles.length; row++) {
          for (let col = 0; col < tiles[row].length; col++) {
            let tile = tiles[row][col];

            // Make sure tile exists
            if (tile) {
              tile.hideText();
            }
          }
        }
      }
    },
    ["sol-toggle-box-container"],
    ["sol-toggle-label"],
    ["sol-toggle-input"],
    false
  );

  document.body.appendChild(solutionToggleBox);
  document.body.appendChild(updateTilegridButtonContainer);
  document.body.appendChild(resetTilegridButtonContainer);
  document.body.appendChild(difficultySelectionBoxContainer);
}

function addInfoBox() {
  // Create infoWindow window and content
  const infoWindow = createUIWindow(
    "infoWindow",
    "",
    `
      <h2>About Flip Tile</h2>
      <p>
        Inspired by the classic
        <a href="https://en.wikipedia.org/wiki/Lights_Out_(game)" target="_blank">
          Lights Out
        </a> game, Flip Tile brings a fresh twist to the familiar puzzle concept, offering three distinct levels of difficulty to challenge players of all skill levels.
        <br><br>
        I created this game mostly as an exercise to re-learn linear algebra concepts. 
        Watch <a href="https://www.youtube.com/watch?v=0fHkKcy0x_U" target="_blank">
          Solving the "Lights Out" Problem
        </a>
        for more context on how linear algebra can be used to solve this game!
      </p>
    `,
    closeInfoWindow,
    onClickX,
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
    onClickInfo,
    openInfoWindow,
    ["info-button-container"],
    ["fliptile-icon-img"],
    ["fliptile-icon-text"],
    ["fliptile-button"]
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
