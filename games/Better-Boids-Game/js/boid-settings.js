/**
 * @module BoidSettings
 *
 * @author Shane Bonkowski
 */

import { BoidFactors, customEvents } from "./boid-utils.js";
import { createUIWindow } from "../../../Main-Website-Assets/js/window.js";
import { createFunctionButtonContainer } from "../../../Main-Website-Assets/js/buttons.js";
import { addSelectionBox } from "../../../Main-Website-Assets/js/selection_box.js";

const velocityPanelInfo = {
  imagePath: "./webps/Velocity_Graphic.webp",
  htmlContent: `
    <h2>Max Speed:</h2>
    <p>
        The maximum speed that the Boids are allowed to go. When changing directions, Boids will accelerate until they hit this speed limit.
    </p>
  `,
};

const alignmentPanelInfo = {
  imagePath: "./webps/Alignment_Graphic.webp",
  htmlContent: `
    <h2>Boid Alignment:</h2>
    <p>
        Alignment is the tendency for Boids of the same type to fly in the same direction. The higher this value, the more Boids will try to align.
    </p>
  `,
};

const cohesionPanelInfo = {
  imagePath: "./webps/Cohesion_Graphic.webp",
  htmlContent: `
    <h2>Boid Cohesion:</h2>
    <p>
        Cohesion is the tendency for Boids of the same type to flock together. The higher this value, the more Boids try to stay close together.
    </p>
  `,
};

const radiusPanelInfo = {
  imagePath: "./webps/Search_Radius_Graphic.webp",
  htmlContent: `
    <h2>Flock Radius:</h2>
    <p>
        Flock Radius is how far Boids will search for neighbors. All Boids within this distance from one another are considered neighbors.
    </p>
  `,
};

const separationPanelInfo = {
  imagePath: "./webps/Separation_Graphic.webp",
  htmlContent: `
    <h2>Boid Separation:</h2>
    <p>
        Separation is how much Boids will try to separate if they are colliding. A higher value means Boids will oppose colliding more.
    </p>
  `,
};

const leaderPanelInfo = {
  imagePath: "./webps/Leader_Follow_Graphic.webp",
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
    let customEvent = new CustomEvent("uiMenuClosed", {
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
    let customEvent = new CustomEvent("uiMenuOpen", {
      detail: {
        message: "Settings Menu Opened",
      },
    });
    document.dispatchEvent(customEvent);
  }
  const settingsButtonContainer = createFunctionButtonContainer(
    "settingsButtonContainer",
    "settingsButton",
    "../Better-Boids-Game/webps/Boids_Logo_Option_2.webp",
    "Settings Icon",
    "u",
    [onClickSettings, openSettingsWindow],
    ["settings-button-container"],
    ["info-icon-img"],
    ["info-icon-text"],
    ["info-button"]
  );

  // Create sliders and their containers
  const speedSliderContainer = instantiateSlider(
    "Max Speed",
    BoidFactors.speed,
    "0.05",
    "1",
    "0.05",
    settingsSidePanel,
    velocityPanelInfo
  );

  const alignmentSliderContainer = instantiateSlider(
    "Alignment",
    BoidFactors.alignmentFactor,
    "0",
    "1",
    "0.001",
    settingsSidePanel,
    alignmentPanelInfo
  );

  const cohesionSliderContainer = instantiateSlider(
    "Cohesion",
    BoidFactors.cohesionFactor,
    "0",
    "1",
    "0.001",
    settingsSidePanel,
    cohesionPanelInfo
  );

  const radiusSliderContainer = instantiateSlider(
    "Flock Radius",
    BoidFactors.flockSearchRadius,
    `${BoidFactors.boidProtectedRadius + 5}`, // Cannot go smaller than protected radius with some buffer
    "500",
    "1",
    settingsSidePanel,
    radiusPanelInfo
  );

  const separationSliderContainer = instantiateSlider(
    "Separation",
    BoidFactors.separationFactor,
    "0",
    "1",
    "0.001",
    settingsSidePanel,
    separationPanelInfo
  );

  addFlockRadiusIndicator(radiusSliderContainer);
  addTouchEventListenersToSliders();

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
        document.dispatchEvent(customEvents.leaderBoidChangeEvent);
      } else {
        BoidFactors.leaderBoidEnabled = false;
        document.dispatchEvent(customEvents.leaderBoidChangeEvent);
      }

      // Reveal leader panel info
      const settingsPanel = document.querySelector(".settings-side-panel");
      updateSettingsSidePanel(
        settingsPanel,
        leaderPanelInfo.imagePath,
        leaderPanelInfo.htmlContent
      );
    }
  );

  // When ui is open, hide certain UI, when it is closed, reveal them
  document.addEventListener("uiMenuOpen", uiMenuOpenHandler);
  document.addEventListener("uiMenuClosed", uiMenuCloseHandler);

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

  function addTouchEventListenersToSliders() {
    // Add touch event listeners to slider containers so that we can show the hover text
    // if someone on a phone touches on a slider.
    const sliderContainers = document.querySelectorAll(".slider-container");

    // When someone touches the slider, add the touch-hover class to it so it can hover,
    // then on touch end remove this class so it doesnt interfere with anything
    sliderContainers.forEach(
      function (container) {
        // Add when touch starts
        container.addEventListener(
          "touchstart",
          function (event) {
            container.classList.add("touch-hover");
          }.bind(this)
        );

        // Remove when the touch ends
        container.addEventListener("touchend", function (event) {
          container.classList.remove("touch-hover");
        });
      }.bind(this)
    );
  }

  function instantiateSlider(
    name,
    value,
    min,
    max,
    step,
    panelProvided,
    panelInfoProvided
  ) {
    // init slider container
    const sliderContainer = document.createElement("div");
    sliderContainer.classList.add("slider-container");

    // init slider
    const slider = document.createElement("input");
    slider.setAttribute("type", "range");
    slider.setAttribute("min", min);
    slider.setAttribute("max", max);
    slider.setAttribute("step", step);
    slider.value = value; // Set initial value
    sliderContainer.appendChild(slider);

    // Add label
    const label = document.createElement("label");
    label.textContent = name;
    label.classList.add("slider-label");
    sliderContainer.appendChild(label);

    // Slide value hover label
    const hoverLabel = document.createElement("div");
    hoverLabel.classList.add("slider-hover-label");
    hoverLabel.textContent = slider.value; // init hover text
    sliderContainer.appendChild(hoverLabel);

    // Append sliders to the document body
    initSliderEvents(
      slider,
      name,
      hoverLabel,
      panelProvided,
      panelInfoProvided
    );

    return sliderContainer;
  }

  function addFlockRadiusIndicator(radiusSliderContainer) {
    // Create the circle element to represent the flock radius
    const circle = document.createElement("div");
    circle.classList.add("flock-radius-indicator");
    document.body.appendChild(circle);

    // Initially hide the circle
    circle.style.display = "none";

    // Find the input range element within the container
    const inputRange = radiusSliderContainer.querySelector(
      "input[type='range']"
    );

    // On input, update the flock radius circle to be visible
    inputRange.addEventListener(
      "input",
      function (event) {
        let radiusValue = parseFloat(inputRange.value);
        updateFlockRadiusIndicator(circle, radiusValue);
      }.bind(this)
    );

    // Listen for pointer event to hide the circle when the slider is released.
    // This tries to catch the general case of a finger or a mouse.
    inputRange.addEventListener(
      "pointerup",
      function () {
        if (circle.style.display !== "none") {
          circle.style.display = "none";
        }
      }.bind(this)
    );

    // Listen for touchend event to hide the circle when the slider is released.
    // This is backup if a browser cannot detect pointerup.
    inputRange.addEventListener(
      "touchend",
      function () {
        if (circle.style.display !== "none") {
          circle.style.display = "none";
        }
      }.bind(this)
    );

    // Listen for mouseup event to hide the circle when the slider is released.
    // This is backup if a browser cannot detect pointerup.
    inputRange.addEventListener(
      "mouseup",
      function () {
        if (circle.style.display !== "none") {
          circle.style.display = "none";
        }
      }.bind(this)
    );
  }

  function updateFlockRadiusIndicator(circle, radius) {
    // Set the circle's radius and position
    let diameter = radius * 2;
    circle.style.width = diameter + "px";
    circle.style.height = diameter + "px";
    circle.style.borderRadius = "50%";
    circle.style.position = "absolute";
    circle.style.top = "50%";
    circle.style.left = "50%";
    circle.style.transform = "translate(-50%, -50%)";
    circle.style.zIndex = "6";

    // Adjust transparency based on radius value
    let transparency = 0.5;
    circle.style.backgroundColor = `rgba(255, 0, 0, ${transparency})`;

    // Show the circle
    if (circle.style.display !== "block") {
      circle.style.display = "block";
    }
  }

  // Function to update the factor values
  function updateFactor(factorName, value) {
    switch (factorName) {
      case "Max Speed":
        BoidFactors.speed = value;

        // Dispatch a custom event for specifically the speed slider
        document.dispatchEvent(customEvents.speedChangeEvent);
        break;
      case "Alignment":
        BoidFactors.alignmentFactor = value;
        break;
      case "Cohesion":
        BoidFactors.cohesionFactor = value;
        break;
      case "Flock Radius":
        BoidFactors.flockSearchRadius = value;
        break;
      case "Separation":
        BoidFactors.separationFactor = value;
        break;
      default:
        break;
    }
  }

  function initSliderEvents(
    slider,
    name,
    hoverLabel,
    panelProvided,
    panelInfoProvided
  ) {
    // When a user clicks on the slider, update the handle of the slider to be where the player touched
    slider.addEventListener(
      "pointerdown",
      function (event) {
        updateSliderHandle(event, slider, name);
      }.bind(this)
    );

    slider.addEventListener(
      "pointermove",
      function (event) {
        // If we left-click and drag with a mouse, OR if it is not a mouse (aka it is a pointer for a phone)
        // then assume this is a drag event where we want the slider to be dragged.
        if (event.pointerType === "mouse" ? event.buttons === 1 : true) {
          updateSliderHandle(event, slider, name);
        }
      }.bind(this)
    );

    // Add input event listeners to each slider to update slider value
    slider.addEventListener("input", function () {
      // Update the value of the actual variable as the slider changes
      updateFactor(name, parseFloat(slider.value));

      // Update hover label text
      hoverLabel.textContent = slider.value;
    });

    // Reveal only the provided panel when interacted with
    slider.addEventListener("pointerdown", function () {
      // Reveal provided panel info
      updateSettingsSidePanel(
        panelProvided,
        panelInfoProvided.imagePath,
        panelInfoProvided.htmlContent
      );
    });
  }

  function updateSliderHandle(event, slider, name) {
    // Calculate and update slider value based on pointer location
    let newValue = calculateNewValue(event.clientX, slider);
    slider.value = newValue;

    // Dispatch the input event to trigger any input event listeners (such as the updateFactor() for e.g. function that gets triggered during input events)
    slider.dispatchEvent(new Event("input"));
  }

  function calculateNewValue(clientX, slider) {
    // Calculate the position of the click or touch relative to the slider
    let rect = slider.getBoundingClientRect();
    let offsetX = clientX - rect.left;
    let sliderWidth = rect.width;

    // Calculate the new value based on the position of the click or touch
    let min = parseFloat(slider.min);
    let max = parseFloat(slider.max);
    let range = max - min;
    let ratio = Math.min(1, Math.max(0, offsetX / sliderWidth));
    let newValue = min + ratio * range;

    return newValue;
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

  function updateSettingsSidePanel(panel, imagePath, htmlContent) {
    // Select the existing content container and image
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
