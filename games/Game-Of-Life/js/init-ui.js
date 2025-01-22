import { createFunctionButtonContainer } from "../../../Main-Website-Assets/js/buttons.js";
import { createUIWindow } from "../../../Main-Website-Assets/js/window.js";
import { genericGameEventNames } from "/games/Shared-Game-Assets/js/game-scene-2d.js";
import { addGameOfLifeSettings } from "./settings-menu.js";

export const gameOfLifeEventNames = {
  togglePause: "togglePause",
  clickAdvance: "clickAdvance",
  resetTiles: "resetTiles",
  onPopChange: "onPopChange",
  onGenChange: "onGenChange",
  toggleDisco: "toggleDisco",
  toggleAutomatic: "toggleAutomatic",
  changeColorThemeFromSlider: "changeColorThemeFromSlider",
  changeColorThemeFromMainGame: "changeColorThemeFromMainGame",
};

export function initUI() {
  addInfoBox();

  // Population and generation Text
  const textContainer = document.createElement("div");
  textContainer.classList.add("pop-gen-text-container");

  const textElementPop = document.createElement("div");
  textElementPop.textContent = "Population: 0";
  textElementPop.id = "popText";
  textElementPop.classList.add("pop-gen-text");
  textContainer.appendChild(textElementPop);

  const textElementGen = document.createElement("div");
  textElementGen.textContent = "Generation: 0";
  textElementGen.id = "genText";
  textElementGen.classList.add("pop-gen-text");
  textContainer.appendChild(textElementGen);

  document.body.appendChild(textContainer);

  // When the pop or gen change occurs, update the text
  document.addEventListener(gameOfLifeEventNames.onPopChange, function (event) {
    // parse the event message field to get the new population
    const newPopulation = parseInt(event.detail.message);
    textElementPop.textContent = "Population: " + newPopulation;

    // // Animate the text to grow and shrink
    // // Add CSS class to grow the text
    // textElementPop.classList.add("pop-gen-text-grow");

    // // After a delay, remove the CSS class to shrink the text
    // setTimeout(function () {
    //   textElementPop.classList.remove("pop-gen-text-grow");
    // }, 200);
  });
  document.addEventListener(gameOfLifeEventNames.onGenChange, function (event) {
    // parse the event message field to get the new generation
    const newGeneration = parseInt(event.detail.message);
    textElementGen.textContent = "Generation: " + newGeneration;

    // // Animate the text to grow and shrink
    // // Add CSS class to grow the text
    // textElementGen.classList.add("pop-gen-text-grow");

    // // After a delay, remove the CSS class to shrink the text
    // setTimeout(function () {
    //   textElementGen.classList.remove("pop-gen-text-grow");
    // }, 200);
  });

  // Advance to next iteration button
  function onClickAdvance() {
    let customEvent = new CustomEvent(gameOfLifeEventNames.clickAdvance, {
      detail: {
        message: "Advance to next iteration button clicked",
      },
    });
    document.dispatchEvent(customEvent);
  }
  const advanceButtonContainer = createFunctionButtonContainer(
    "advanceButtonContainer",
    "advanceButton",
    "../Flip-Tile-Game/webps/Button.webp",
    "Advance",
    "",
    [onClickAdvance],
    ["advance-button-container"],
    ["gol-icon-img"],
    ["gol-icon-text"],
    ["gol-button"],
    ["fas", "fa-chevron-right"]
  );
  advanceButtonContainer.classList.add("disable-browser-default-touch-actions");
  document.body.appendChild(advanceButtonContainer);

  // Pause Button
  function onClickTogglePause() {
    let customEvent = new CustomEvent(gameOfLifeEventNames.togglePause, {
      detail: {
        message: "Toggle pause button clicked",
      },
    });
    document.dispatchEvent(customEvent);
  }
  const togglePauseButtonContainer = createFunctionButtonContainer(
    "togglePauseButtonContainer",
    "togglePauseButton",
    "../Flip-Tile-Game/webps/Button.webp",
    "Pause/Resume",
    "",
    [onClickTogglePause],
    ["toggle-pause-button-container"],
    ["gol-icon-img"],
    ["gol-icon-text"],
    ["gol-button"],
    ["fas", "fa-pause"]
  );
  togglePauseButtonContainer.classList.add(
    "disable-browser-default-touch-actions"
  );
  document.body.appendChild(togglePauseButtonContainer);

  // Disco Mode Button
  function onClickToggleDisco() {
    let customEvent = new CustomEvent(gameOfLifeEventNames.toggleDisco, {
      detail: {
        message: "Toggle disco button clicked",
      },
    });
    document.dispatchEvent(customEvent);
  }
  const toggleDiscoButtonContainer = createFunctionButtonContainer(
    "toggleDiscoButtonContainer",
    "toggleDiscoButton",
    "../Flip-Tile-Game/webps/Button.webp",
    "Disco",
    "",
    [onClickToggleDisco],
    ["toggle-disco-button-container"],
    ["gol-icon-img"],
    ["gol-icon-text"],
    ["gol-button"],
    ["fas", "fa-gift"]
  );
  toggleDiscoButtonContainer.classList.add(
    "disable-browser-default-touch-actions"
  );
  document.body.appendChild(toggleDiscoButtonContainer);

  // Automatic Mode Button
  function onClickToggleAutomatic() {
    let customEvent = new CustomEvent(gameOfLifeEventNames.toggleAutomatic, {
      detail: {
        message: "Toggle automatic button clicked",
      },
    });
    document.dispatchEvent(customEvent);
  }
  const toggleAutomaticButtonContainer = createFunctionButtonContainer(
    "toggleAutomaticButtonContainer",
    "toggleAutomaticButton",
    "../Flip-Tile-Game/webps/Button.webp",
    "Automatic",
    "",
    [onClickToggleAutomatic],
    ["toggle-automatic-button-container"],
    ["gol-icon-img"],
    ["gol-icon-text"],
    ["gol-button"],
    ["fas", "fa-robot"]
  );
  toggleAutomaticButtonContainer.classList.add(
    "disable-browser-default-touch-actions"
  );
  document.body.appendChild(toggleAutomaticButtonContainer);

  // Reset tiles Button
  function onClickResetTiles() {
    let customEvent = new CustomEvent(gameOfLifeEventNames.resetTiles, {
      detail: {
        message: "Reset tiles button clicked",
      },
    });
    document.dispatchEvent(customEvent);
  }
  const resetTilesButtonContainer = createFunctionButtonContainer(
    "resetTilesButtonContainer",
    "resetTilesButton",
    "../Flip-Tile-Game/webps/Button.webp",
    "Reset",
    "reset",
    [onClickResetTiles],
    ["reset-tiles-button-container"],
    ["gol-icon-img"],
    ["gol-icon-text"],
    ["gol-button"],
    []
  );
  resetTilesButtonContainer.classList.add(
    "disable-browser-default-touch-actions"
  );
  document.body.appendChild(resetTilesButtonContainer);

  // Settings menu + button
  addGameOfLifeSettings();
}

function addInfoBox() {
  // Info UI window
  const infoWindow = createUIWindow(
    "infoWindow",
    "",
    `
      <h2>Game of Life</h2>
      <p>
        Modern adaptation of the classic 1970 cellular automaton game
        <a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" target="_blank">
          Conway's Game of Life</a>. 
          The game is typically played on an infinite, two-dimensional grid. Each cell can exist in one of two states (alive or dead) and interacts with its eight neighboring cells as follows:
        <ul>
          <li><b>Underpopulation</b>: Any live cell with fewer than two live neighbors dies.</li>
          <li><b>Persistence</b>: Any live cell with two or three live neighbors lives on.</li>
          <li><b>Overpopulation</b>: Any live cell with more than three live neighbors dies.</li>
          <li><b>Reproduction</b>: Any dead cell with exactly three live neighbors becomes a live cell.</li>
        </ul>
        From these simple rules, complex patterns can emerge. New shapes are still being discovered to this day!
      </p>
    `,
    [closeInfoWindow, onClickX],
    ["info-box"],
    ["info-header"],
    ["info-content"],
    ["close-button"]
  );

  // Open info Button
  const infoButtonContainer = createFunctionButtonContainer(
    "infoButtonContainer",
    "infoButton",
    // Use the asset from Flip-Tile-Game! Not Game-Of-Life
    "/games/Flip-Tile-Game/webps/Button.webp",
    "Info Icon",
    "about",
    [onClickInfo, openInfoWindow],
    ["info-button-container"],
    ["gol-icon-img"],
    ["gol-icon-text"],
    ["gol-button"]
  );
  infoButtonContainer.classList.add("disable-browser-default-touch-actions");

  document.body.appendChild(infoButtonContainer);
  document.body.appendChild(infoWindow);

  // When ui is open, hide certain UI, when it is closed, reveal them
  document.addEventListener(
    genericGameEventNames.uiMenuOpen,
    uiMenuOpenHandler
  );
  document.addEventListener(
    genericGameEventNames.uiMenuClosed,
    uiMenuCloseHandler
  );

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

export function uiMenuOpenHandler() {
  hideButtons();
  hideGameBanner();
  hideGameText();
}

// Event listener for UI menu close event
export function uiMenuCloseHandler() {
  showButtons();
  showGameBanner();
  showGameText();
}

function hideGameText() {
  const popGenTextContainer = document.querySelector(".pop-gen-text-container");
  popGenTextContainer.style.display = "none";
}

function showGameText() {
  const popGenTextContainer = document.querySelector(".pop-gen-text-container");
  popGenTextContainer.style.display = "flex";
}

function hideButtons() {
  // Button
  const buttons = document.querySelectorAll(".gol-button");
  buttons.forEach((button) => {
    button.style.display = "none";
  });
}

function showButtons() {
  // Button
  const buttons = document.querySelectorAll(".gol-button");
  buttons.forEach((button) => {
    button.style.display = "block";
  });
}

function hideGameBanner() {
  const gameHeader = document.querySelector(".game-header-banner");
  gameHeader.style.display = "none";
}

function showGameBanner() {
  const gameHeader = document.querySelector(".game-header-banner");
  gameHeader.style.display = "flex";
}
