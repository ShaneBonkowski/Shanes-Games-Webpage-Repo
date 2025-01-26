import { BoidFactors, boidEventNames } from "./boid-utils.js";
import { createUIWindow } from "../../../Main-Website-Assets/js/window.js";
import { createFunctionButtonContainer } from "../../../Main-Website-Assets/js/buttons.js";
import { addSelectionBox } from "../../../Main-Website-Assets/js/selection-box.js";
import { genericGameEventNames } from "/games/Shared-Game-Assets/js/game-scene-2d.js";
import {
  instantiateSlider,
  initSliderEvents,
} from "/Main-Website-Assets/js/slider.js";

const velocityPanelInfo = {
  imagePath: "./webps/Velocity-Graphic.webp",
  htmlContent: `
    <h2>Max Speed:</h2>
    <p>
        The maximum speed that the Boids are allowed to go. When changing directions, Boids will accelerate until they hit this speed limit.
    </p>
  `,
};

const alignmentPanelInfo = {
  imagePath: "./webps/Alignment-Graphic.webp",
  htmlContent: `
    <h2>Boid Alignment:</h2>
    <p>
        Alignment is the tendency for Boids of the same type to fly in the same direction. The higher this value, the more Boids will try to align.
    </p>
  `,
};

const cohesionPanelInfo = {
  imagePath: "./webps/Cohesion-Graphic.webp",
  htmlContent: `
    <h2>Boid Cohesion:</h2>
    <p>
        Cohesion is the tendency for Boids of the same type to flock together. The higher this value, the more Boids try to stay close together.
    </p>
  `,
};

const radiusPanelInfo = {
  imagePath: "./webps/Search-Radius-Graphic.webp",
  htmlContent: `
    <h2>Flock Radius:</h2>
    <p>
        Flock Radius is how far Boids will search for neighbors. All Boids within this distance from one another are considered neighbors.
    </p>
  `,
};

const separationPanelInfo = {
  imagePath: "./webps/Separation-Graphic.webp",
  htmlContent: `
    <h2>Boid Separation:</h2>
    <p>
        Separation is how much Boids will try to separate if they are colliding. A higher value means Boids will oppose colliding more.
    </p>
  `,
};

const leaderPanelInfo = {
  imagePath: "./webps/Leader-Follow-Graphic.webp",
  htmlContent: `
    <h2>Leader Boid:</h2>
    <p>
        If enabled, Leader Boid will spawn wherever your pointer is located at on the screen. Boids will all follow the Leader!
    </p>
  `,
};

export function addBoidSettings() {
  // Create ui window to hold the settings and sliders in (basically a window)
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

  // Create a side panels for the settings window with desired text and image.
  // Start off with the speed panel.
  const settingsSidePanel = createSettingsSidePanel(
    velocityPanelInfo.imagePath,
    velocityPanelInfo.htmlContent
  );
  settingsSidePanel.style.display = "flex"; // start with speed panel revealed (panels are flex boxes)

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
  }
  const settingsButtonContainer = createFunctionButtonContainer(
    "settingsButtonContainer",
    "settingsButton",
    "../Better-Boids-Game/webps/Boids-Logo-Option-2.webp",
    "Settings Icon",
    "u",
    [onClickSettings, openSettingsWindow],
    ["settings-button-container"],
    ["info-icon-img"],
    ["info-icon-text"],
    ["info-button"]
  );
  settingsButtonContainer.classList.add(
    "disable-browser-default-touch-actions"
  );

  // Mute sound button
  function onClickMuteSound() {
    let customEvent = new CustomEvent(genericGameEventNames.mute, {
      detail: {
        message: "mute button clicked",
      },
    });
    document.dispatchEvent(customEvent);
  }
  const muteSoundButtonContainer = createFunctionButtonContainer(
    "muteSoundButtonContainer",
    "muteSoundButton",
    "../Better-Boids-Game/webps/Boids-Logo-Option-2.webp",
    "Mute Sound",
    "",
    [onClickMuteSound],
    ["mute-button-container"],
    ["info-icon-img"],
    ["info-icon-text"],
    ["info-button"],
    ["fas", "fa-volume-xmark"]
  );
  muteSoundButtonContainer.classList.add(
    "disable-browser-default-touch-actions"
  );

  // Create sliders and their containers
  const speedSliderContainer = instantiateSlider(
    "Max Speed",
    BoidFactors.speed,
    "0.05",
    "1",
    "0.05"
  );
  initSliderEvents(speedSliderContainer, function (value) {
    BoidFactors.speed = value;

    // Dispatch a custom event for specifically the speed slider
    document.dispatchEvent(new Event(boidEventNames.onSpeedChange));
  });
  speedSliderContainer.addEventListener("pointerdown", function () {
    updateSettingsSidePanel(
      velocityPanelInfo.imagePath,
      velocityPanelInfo.htmlContent
    );
  });

  const alignmentSliderContainer = instantiateSlider(
    "Alignment",
    BoidFactors.alignmentFactor,
    "0",
    "1",
    "0.001"
  );
  initSliderEvents(alignmentSliderContainer, function (value) {
    BoidFactors.alignmentFactor = value;
  });
  alignmentSliderContainer.addEventListener("pointerdown", function () {
    updateSettingsSidePanel(
      alignmentPanelInfo.imagePath,
      alignmentPanelInfo.htmlContent
    );
  });

  const cohesionSliderContainer = instantiateSlider(
    "Cohesion",
    BoidFactors.cohesionFactor,
    "0",
    "1",
    "0.001"
  );
  initSliderEvents(cohesionSliderContainer, function (value) {
    BoidFactors.cohesionFactor = value;
  });
  cohesionSliderContainer.addEventListener("pointerdown", function () {
    updateSettingsSidePanel(
      cohesionPanelInfo.imagePath,
      cohesionPanelInfo.htmlContent
    );
  });

  const radiusSliderContainer = instantiateSlider(
    "Flock Radius",
    BoidFactors.flockSearchRadius,
    `${BoidFactors.boidProtectedRadius + 5}`, // Cannot go smaller than protected radius with some buffer
    "500",
    "1"
  );
  initSliderEvents(radiusSliderContainer, function (value) {
    BoidFactors.flockSearchRadius = value;
  });
  radiusSliderContainer.addEventListener("pointerdown", function () {
    updateSettingsSidePanel(
      radiusPanelInfo.imagePath,
      radiusPanelInfo.htmlContent
    );
  });

  const separationSliderContainer = instantiateSlider(
    "Separation",
    BoidFactors.separationFactor,
    "0",
    "1",
    "0.001"
  );
  initSliderEvents(separationSliderContainer, function (value) {
    BoidFactors.separationFactor = value;
  });
  separationSliderContainer.addEventListener("pointerdown", function () {
    updateSettingsSidePanel(
      separationPanelInfo.imagePath,
      separationPanelInfo.htmlContent
    );
  });

  addFlockRadiusIndicator(radiusSliderContainer);

  // Leader Toggle Box
  const leaderToggleBoxContainer = document.createElement("div");
  leaderToggleBoxContainer.id = "leaderToggleBoxContainer";
  leaderToggleBoxContainer.classList.add("toggle-box-container");
  addSelectionBox(
    `leader-toggle-input"`,
    "Leader Boid",
    1,
    leaderToggleBoxContainer,
    // other boxes to be turned off when this one is turned on.
    // Empty so that this can be a toggle box.
    [],
    ["toggle-input"],
    ["toggle-label"],
    true, // start off with this one checked
    function (checked) {
      // Update leaderBoidEnabled variable
      if (checked) {
        BoidFactors.leaderBoidEnabled = true;
      } else {
        BoidFactors.leaderBoidEnabled = false;
      }

      // Reveal leader panel info
      updateSettingsSidePanel(
        leaderPanelInfo.imagePath,
        leaderPanelInfo.htmlContent
      );
    }
  );

  // When ui is open, hide certain UI, when it is closed, reveal them
  document.addEventListener(
    genericGameEventNames.uiMenuOpen,
    uiMenuOpenHandler
  );
  document.addEventListener(
    genericGameEventNames.uiMenuClosed,
    uiMenuCloseHandler
  );

  // Set up parenting structure and append to body of document
  const uiSettingsOptionsContainer = document.createElement("div");
  uiSettingsOptionsContainer.id = "ui-settings-options-container";
  uiSettingsOptionsContainer.classList.add("ui-settings-options-container");

  uiSettingsOptionsContainer.appendChild(speedSliderContainer);
  uiSettingsOptionsContainer.appendChild(alignmentSliderContainer);
  uiSettingsOptionsContainer.appendChild(cohesionSliderContainer);
  uiSettingsOptionsContainer.appendChild(radiusSliderContainer);
  uiSettingsOptionsContainer.appendChild(separationSliderContainer);
  uiSettingsOptionsContainer.appendChild(leaderToggleBoxContainer);
  uiSettingsOptionsContainer.classList.add(
    "disable-browser-default-touch-actions"
  );

  const settingsSidePanelBottomHalf = settingsSidePanel.querySelector(
    ".settings-side-panel-bottom-half"
  );
  settingsSidePanelBottomHalf.insertBefore(
    uiSettingsOptionsContainer,
    settingsSidePanelBottomHalf.firstChild
  );
  settingsSidePanel.appendChild(settingsSidePanelBottomHalf);

  settingsWindow.appendChild(settingsSidePanel);
  document.body.appendChild(settingsWindow);
  document.body.appendChild(settingsButtonContainer);
  document.body.appendChild(muteSoundButtonContainer);

  function hideInfoButtons() {
    const infoButtons = document.querySelectorAll(".info-button");
    infoButtons.forEach((button) => {
      button.style.display = "none";
    });
  }

  function showInfoButtons() {
    const infoButtons = document.querySelectorAll(".info-button");
    infoButtons.forEach((button) => {
      button.style.display = "block";
    });
  }

  function hideGameBanner() {
    let gameHeader = document.querySelector(".game-header-banner");
    gameHeader.style.display = "none";
  }

  function showGameBanner() {
    let gameHeader = document.querySelector(".game-header-banner");
    gameHeader.style.display = "flex";
  }

  // Event listener for UI menu open event
  function uiMenuOpenHandler() {
    hideInfoButtons();
    hideGameBanner();
  }

  // Event listener for UI menu close event
  function uiMenuCloseHandler() {
    showInfoButtons();
    showGameBanner();
  }

  function addFlockRadiusIndicator(radiusSliderContainer) {
    // Create the circle element to represent the flock radius
    const circle = document.createElement("div");
    circle.classList.add("flock-radius-indicator");
    document.body.appendChild(circle);

    // Initially hide the circle
    circle.style.display = "none";

    // On input, update the flock radius circle to be visible
    const inputRange = radiusSliderContainer.querySelector(
      "input[type='range']"
    );

    inputRange.addEventListener(
      "input",
      function (event) {
        let radiusValue = parseFloat(inputRange.value);
        updateFlockRadiusIndicator(circle, radiusValue);
      }.bind(this)
    );

    // Listen for pointer event to hide the circle when the slider is released.
    // This tries to catch the general case of a finger or a mouse.
    function onPointerUp() {
      if (circle.style.display !== "none") {
        circle.style.display = "none";
      }
    }
    inputRange.addEventListener("pointerup", onPointerUp);
    inputRange.addEventListener("pointercancel", onPointerUp);
  }

  function updateFlockRadiusIndicator(circle, radius) {
    // Update the circle's radius
    let diameter = radius * 2;
    circle.style.width = diameter + "px";
    circle.style.height = diameter + "px";
    circle.style.borderRadius = "50%";
    circle.style.position = "absolute";
    circle.style.top = "50%";
    circle.style.left = "50%";
    circle.style.transform = "translate(-50%, -50%)";
    circle.style.zIndex = "6";

    let transparency = 0.5;
    circle.style.backgroundColor = `rgba(255, 0, 0, ${transparency})`;

    // Show the circle
    if (circle.style.display !== "block") {
      circle.style.display = "block";
    }
  }

  function createSettingsSidePanel(imagePath, htmlContent) {
    const panel = document.createElement("div");
    panel.classList.add("settings-side-panel");

    // contentContainer holds the text for this panel
    const contentContainer = document.createElement("div");
    contentContainer.classList.add("settings-content-container");
    contentContainer.innerHTML = htmlContent;
    panel.appendChild(contentContainer);

    const panelBottomHalf = document.createElement("div");
    panelBottomHalf.classList.add("settings-side-panel-bottom-half");

    const image = document.createElement("img");
    image.src = imagePath;
    image.alt = "Settings Side Panel Image";
    panelBottomHalf.appendChild(image);

    panel.appendChild(panelBottomHalf);

    return panel;
  }

  function updateSettingsSidePanel(imagePath, htmlContent) {
    // Select the existing content container and image
    const panel = document.querySelector(".settings-side-panel");
    const contentContainer = panel.querySelector(".settings-content-container");
    const image = panel.querySelector("img");

    // Update the content container's HTML
    if (contentContainer) {
      contentContainer.innerHTML = htmlContent;
    } else {
      debug.log("ERROR: content container is missing from settings panel");
    }

    // Update the image's src
    if (image) {
      image.src = imagePath;
    } else {
      debug.log("ERROR: image is missing from settings panel");
    }
  }
}
