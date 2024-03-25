import { addUIButton } from "../../Shared-Game-Assets/js/ui_button.js";
import {
  customEvents,
  TilePatternAttrs,
  difficulty,
  scoring,
} from "./tile-utils.js";
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
    "../Flip-Tile-Game/pngs/Button.png",
    "Update Tilegrid Icon",
    "new",
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
    "../Flip-Tile-Game/pngs/Button.png",
    "Reset Tilegrid Icon",
    "reset",
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
    ["easy"],
    1,
    difficultySelectionBoxContainer,
    ["input-box-1"],
    ["input-box-label-1"],
    true // start off with this one checked
  );
  createSelectionBox(
    ui_vars.numCheckboxes,
    `input-box-2`,
    ["hard"],
    2,
    difficultySelectionBoxContainer,
    ["input-box-2"],
    ["input-box-label-2"]
  );
  createSelectionBox(
    ui_vars.numCheckboxes,
    `input-box-3`,
    ["expert"],
    3,
    difficultySelectionBoxContainer,
    ["input-box-3"],
    ["input-box-label-3"]
  );

  // Toggle box to show solutions
  const solutionToggleBox = createToggleBox(
    "reveal",
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

  // Score Text
  const textContainer = document.createElement("div");
  textContainer.classList.add(".score-text-container");

  const textElement = document.createElement("div");
  textElement.textContent = "0";
  textElement.id = "ScoreText";
  textElement.classList.add("score-text");
  textContainer.appendChild(textElement);

  // When the ScoreChangeEvent occurs, the text updates for the score
  document.addEventListener("onScoreChange", function (event) {
    var scoreAdd = 0;
    if (TilePatternAttrs.difficultyLevel == difficulty.EASY) {
      scoreAdd = scoring.EASY;
    } else if (TilePatternAttrs.difficultyLevel == difficulty.HARD) {
      scoreAdd = scoring.HARD;
    } else if (TilePatternAttrs.difficultyLevel == difficulty.EXPERT) {
      scoreAdd = scoring.EXPERT;
    } else {
      console.log("ERROR: difficulty not listed");
    }

    textElement.textContent = parseInt(textElement.textContent) + scoreAdd;

    // Animate the text to grow and shrink
    // Add CSS class to grow the text
    textElement.classList.add("score-text-grow");

    // After a delay, remove the CSS class to shrink the text
    setTimeout(function () {
      textElement.classList.remove("score-text-grow");
    }, 200);
  });

  // Children assigning
  document.body.appendChild(textContainer);
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
    "../Flip-Tile-Game/pngs/Button.png",
    "Info Icon",
    "about",
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
