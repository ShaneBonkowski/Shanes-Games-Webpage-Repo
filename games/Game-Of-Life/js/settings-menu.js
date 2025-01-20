import { createUIWindow } from "../../../Main-Website-Assets/js/window.js";
import { createFunctionButtonContainer } from "../../../Main-Website-Assets/js/buttons.js";
import { addSelectionBox } from "../../../Main-Website-Assets/js/selection-box.js";
import { genericGameEventNames } from "/games/Shared-Game-Assets/js/game-scene-2d.js";
import { TileGridAttrs } from "/games/Game-Of-Life/js/tile-utils.js";
import {
  uiMenuOpenHandler,
  uiMenuCloseHandler,
} from "/games/Game-Of-Life/js/init-ui.js";
import {
  instantiateSlider,
  initSliderEvents,
} from "/Main-Website-Assets/js/slider.js";

const initialSettingsPanelInfo = {
  htmlContent: `
    <h2>Settings:</h2>
    <p>
        Customize Game of Life rules, parameters, color theme and more!
    </p>
    `,
};
const toggleAutoPausePanelInfo = {
  htmlContent: `
    <h2>Auto Pause:</h2>
    <p>
        If enabled, automatically pause when clicking to add/subtract a cell. Enabled by default.
    </p>
    `,
};
const toggleInfiniteEdgesPanelInfo = {
  htmlContent: `
    <h2>Infinite Edges:</h2>
    <p>
        If enabled, cells treat edges as a portal to the other side (Kind've like Pac-Man). Enabled by default.
    </p>
    `,
};
const countDiagonalNeighborsPanelInfo = {
  htmlContent: `
    <h2>Diagonal Neighbors:</h2>
    <p>
        If enabled, cells treat other cells that are diagonal to them as neighbors. Enabled by default.
    </p>
    `,
};

const updateIntervalPanelInfo = {
  htmlContent: `
    <h2>Cell Update Interval:</h2>
    <p>
        How many milliseconds to wait between cell updates. Lower value means quicker updates.
    </p>
    `,
};

const underpopulationPanelInfo = {
  htmlContent: `
    <h2>Underpopulation:</h2>
    <p>
        Any live cell with fewer than this many neighbors dies. Defaults to 2.
    </p>
    `,
};

const overpopulationPanelInfo = {
  htmlContent: `
    <h2>Overpopulation:</h2>
    <p>
        Any live cell with more than this many neighbors dies. Defaults to 3.
    </p>
    `,
};

const reproductionPanelInfo = {
  htmlContent: `
    <h2>Reproduction:</h2>
    <p>
        Any dead cell with exactly this many neighbors becomes alive. Defaults to 3.
    </p>
    `,
};

export function addGameOfLifeSettings() {
  // Create ui window to hold the settings and sliders in
  function closeSettingsWindow() {
    settingsWindow.style.display = "none";
  }

  function onClickX() {
    let customEvent = new CustomEvent(genericGameEventNames.uiMenuClosed, {
      detail: {
        message: "Settings Menu Closed",
      },
    });
    document.dispatchEvent(customEvent);
  }
  const settingsWindow = createUIWindow(
    "SettingsWindow",
    "",
    ``,
    [closeSettingsWindow, onClickX],
    ["info-box"],
    ["info-header"],
    ["info-content"],
    ["close-button"]
  );

  // Initialize the side panel for the settings window with desired text.
  const settingsSidePanel = createSettingsSidePanel(
    initialSettingsPanelInfo.htmlContent
  );
  settingsSidePanel.style.display = "flex"; // start with the panel revealed (panels are flex boxes)

  // Add an open settings Button
  function openSettingsWindow() {
    settingsWindow.style.display = "block";
  }

  function onClickSettings() {
    let customEvent = new CustomEvent(genericGameEventNames.uiMenuOpen, {
      detail: {
        message: "Settings Menu Opened",
      },
    });
    document.dispatchEvent(customEvent);

    // When freshly openning settings, update the settings side panel to
    // show the initial settings info
    const settingsSidePanel = document.querySelector(".settings-side-panel");
    if (settingsSidePanel != null) {
      updateSettingsSidePanel(
        settingsSidePanel,
        initialSettingsPanelInfo.htmlContent
      );
    }
  }
  const settingsButtonContainer = createFunctionButtonContainer(
    "settingsButtonContainer",
    "settingsButton",
    "../Flip-Tile-Game/webps/Button.webp",
    "Settings",
    "",
    [onClickSettings, openSettingsWindow],
    ["settings-button-container"],
    ["gol-icon-img"],
    ["gol-icon-text"],
    ["gol-button"],
    ["fas", "fa-gear"]
  );
  settingsButtonContainer.classList.add(
    "disable-browser-default-touch-actions"
  );

  // Toggle Box for auto pause
  const autoPauseToggleBoxContainer = document.createElement("div");
  autoPauseToggleBoxContainer.id = "autoPauseToggleBoxContainer";
  autoPauseToggleBoxContainer.classList.add("toggle-box-container");
  addSelectionBox(
    `auto-pause-toggle-input"`,
    "Auto Pause",
    1,
    autoPauseToggleBoxContainer,
    // other boxes to be turned off when this one is turned on.
    // Empty so that this can be a toggle box instead of e.g. coupled
    // selection boxes.
    [],
    ["toggle-input"],
    ["toggle-label"],
    TileGridAttrs.autoPauseOnClick, // start off with this one set to TileGridAttrs.autoPauseOnClick
    function (checked) {
      if (checked) {
        TileGridAttrs.autoPauseOnClick = true;
      } else {
        TileGridAttrs.autoPauseOnClick = false;
      }

      // Reveal panel info
      const settingsSidePanel = document.querySelector(".settings-side-panel");
      updateSettingsSidePanel(
        settingsSidePanel,
        toggleAutoPausePanelInfo.htmlContent
      );
    }
  );

  // Toggle box for infinite edges
  const infiniteEdgesToggleBoxContainer = document.createElement("div");
  infiniteEdgesToggleBoxContainer.id = "infiniteEdgesToggleBoxContainer";
  infiniteEdgesToggleBoxContainer.classList.add("toggle-box-container");
  addSelectionBox(
    `infinite-edges-toggle-input"`,
    "Infinite Edges",
    1,
    infiniteEdgesToggleBoxContainer,
    // other boxes to be turned off when this one is turned on.
    // Empty so that this can be a toggle box instead of e.g. coupled
    // selection boxes.
    [],
    ["toggle-input"],
    ["toggle-label"],
    TileGridAttrs.infiniteEdges, // start off set to this value
    function (checked) {
      if (checked) {
        TileGridAttrs.infiniteEdges = true;
      } else {
        TileGridAttrs.infiniteEdges = false;
      }

      // Reveal panel info
      const settingsSidePanel = document.querySelector(".settings-side-panel");
      updateSettingsSidePanel(
        settingsSidePanel,
        toggleInfiniteEdgesPanelInfo.htmlContent
      );
    }
  );

  // Toggle box for diagonal neighbors
  const countDiagonalNeighborsToggleBoxContainer =
    document.createElement("div");
  countDiagonalNeighborsToggleBoxContainer.id =
    "countDiagonalNeighborsToggleBoxContainer";
  countDiagonalNeighborsToggleBoxContainer.classList.add(
    "toggle-box-container"
  );
  addSelectionBox(
    `count-diagonal-neighbors-toggle-input"`,
    "Diagonal Neighbors",
    1,
    countDiagonalNeighborsToggleBoxContainer,
    // other boxes to be turned off when this one is turned on.
    // Empty so that this can be a toggle box instead of e.g. coupled
    // selection boxes.
    [],
    ["toggle-input"],
    ["toggle-label"],
    TileGridAttrs.countCornersAsNeighbors, // start off set to this value
    function (checked) {
      if (checked) {
        TileGridAttrs.countCornersAsNeighbors = true;
      } else {
        TileGridAttrs.countCornersAsNeighbors = false;
      }

      // Reveal panel info
      const settingsSidePanel = document.querySelector(".settings-side-panel");
      updateSettingsSidePanel(
        settingsSidePanel,
        countDiagonalNeighborsPanelInfo.htmlContent
      );
    }
  );

  // Create sliders and their containers
  const updateIntervalSpeedSliderContainer = instantiateSlider(
    "Update Interval",
    TileGridAttrs.updateInterval,
    "10",
    "1000",
    "10"
  );
  initSliderEvents(updateIntervalSpeedSliderContainer, function (value) {
    TileGridAttrs.updateInterval = value;
  });
  updateIntervalSpeedSliderContainer.addEventListener(
    "pointerdown",
    function () {
      const settingsSidePanel = document.querySelector(".settings-side-panel");
      updateSettingsSidePanel(
        settingsSidePanel,
        updateIntervalPanelInfo.htmlContent
      );
    }
  );

  const underpopulationSliderContainer = instantiateSlider(
    "Underpopulation",
    TileGridAttrs.golUnderpopulationCriteria,
    "0",
    "8",
    "1"
  );
  initSliderEvents(underpopulationSliderContainer, function (value) {
    TileGridAttrs.golUnderpopulationCriteria = value;
  });
  underpopulationSliderContainer.addEventListener("pointerdown", function () {
    const settingsSidePanel = document.querySelector(".settings-side-panel");
    updateSettingsSidePanel(
      settingsSidePanel,
      underpopulationPanelInfo.htmlContent
    );
  });

  const overpopulationSliderContainer = instantiateSlider(
    "Overpopulation",
    TileGridAttrs.golOverpopulationCriteria,
    "0",
    "8",
    "1"
  );
  initSliderEvents(overpopulationSliderContainer, function (value) {
    TileGridAttrs.golOverpopulationCriteria = value;
  });
  overpopulationSliderContainer.addEventListener("pointerdown", function () {
    const settingsSidePanel = document.querySelector(".settings-side-panel");
    updateSettingsSidePanel(
      settingsSidePanel,
      overpopulationPanelInfo.htmlContent
    );
  });

  const reproductionSliderContainer = instantiateSlider(
    "Reproduction",
    TileGridAttrs.golRepoductionCritera,
    "0",
    "8",
    "1"
  );
  initSliderEvents(reproductionSliderContainer, function (value) {
    TileGridAttrs.golRepoductionCritera = value;
  });
  reproductionSliderContainer.addEventListener("pointerdown", function () {
    const settingsSidePanel = document.querySelector(".settings-side-panel");
    updateSettingsSidePanel(
      settingsSidePanel,
      reproductionPanelInfo.htmlContent
    );
  });

  // When ui is open, hide certain UI, when it is closed, reveal them
  document.addEventListener(
    genericGameEventNames.uiMenuOpen,
    uiMenuOpenHandler
  );
  document.addEventListener(
    genericGameEventNames.uiMenuClosed,
    uiMenuCloseHandler
  );

  // Add the settings options, toggles etc. to settingsSidePanelBottomHalf
  const uiSettingsOptionsContainer = document.createElement("div");
  uiSettingsOptionsContainer.id = "ui-settings-options-container";
  uiSettingsOptionsContainer.classList.add("ui-settings-options-container");
  uiSettingsOptionsContainer.classList.add(
    "disable-browser-default-touch-actions"
  );

  uiSettingsOptionsContainer.appendChild(updateIntervalSpeedSliderContainer);
  uiSettingsOptionsContainer.appendChild(underpopulationSliderContainer);
  uiSettingsOptionsContainer.appendChild(overpopulationSliderContainer);
  uiSettingsOptionsContainer.appendChild(reproductionSliderContainer);
  uiSettingsOptionsContainer.appendChild(autoPauseToggleBoxContainer);
  uiSettingsOptionsContainer.appendChild(infiniteEdgesToggleBoxContainer);
  uiSettingsOptionsContainer.appendChild(
    countDiagonalNeighborsToggleBoxContainer
  );

  const settingsSidePanelBottomHalf = settingsSidePanel.querySelector(
    ".settings-side-panel-bottom-half"
  );
  settingsSidePanelBottomHalf.insertBefore(
    uiSettingsOptionsContainer,
    settingsSidePanelBottomHalf.firstChild
  );

  // Set up the rest of the settings window
  settingsSidePanel.appendChild(settingsSidePanelBottomHalf);
  settingsWindow.appendChild(settingsSidePanel);

  // Add the new settings window and open settings button to the document
  document.body.appendChild(settingsWindow);
  document.body.appendChild(settingsButtonContainer);
}

function createSettingsSidePanel(htmlContent) {
  const panel = document.createElement("div");
  panel.classList.add("settings-side-panel");

  // contentContainer holds the text for this panel
  const contentContainer = document.createElement("div");
  contentContainer.classList.add("settings-content-container");
  contentContainer.innerHTML = htmlContent;
  panel.appendChild(contentContainer);

  const panelBottomHalf = document.createElement("div");
  panelBottomHalf.classList.add("settings-side-panel-bottom-half");

  panel.appendChild(panelBottomHalf);

  return panel;
}

function updateSettingsSidePanel(panel, htmlContent) {
  const contentContainer = panel.querySelector(".settings-content-container");

  // Update the content container's HTML
  if (contentContainer) {
    contentContainer.innerHTML = htmlContent;
  } else {
    debug.log("ERROR: content container is missing from settings panel");
  }
}
