import { addUIButton } from "../../Shared-Game-Assets/js/ui_button.js";
import { customEvents } from "./tile-utils.js";
import { createSelectionBox } from "../../Shared-Game-Assets/js/ui_selection_box.js";
import { createToggleBox } from "../../Shared-Game-Assets/js/ui_togglebox.js";
import { tiles } from "./main-game-scene.js";

export var ui_vars = {
  numCheckboxes: 3,
};

export function initUI() {
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
