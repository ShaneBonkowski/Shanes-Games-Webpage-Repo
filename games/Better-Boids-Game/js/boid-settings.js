import { BoidFactors, customEvents } from "./boid-utils.js";
export function addBoidSettings() {
  // Create box to hold the settings and sliders in (basically a window)
  const settingsBox = document.createElement("div");
  settingsBox.id = "settingsBox";
  settingsBox.classList.add("info-box"); // same as info box

  // Add some header(s) and info to this screen
  const settingsHeader = document.createElement("div");
  settingsHeader.classList.add("info-header"); // same as info header for now

  const settingsContent = document.createElement("div");
  settingsContent.classList.add("info-content"); // same as info header for now

  // Create heading and paragraphs for settingsContent
  settingsContent.innerHTML = `
  <h2>Settings:</h2>
  <p>
    Add settings here:
  </p>
`;

  // Add close button
  const closeButton = document.createElement("span");
  closeButton.classList.add("close-button");
  closeButton.textContent = "x";
  closeButton.onclick = closeSettingsBox;
  settingsBox.appendChild(closeButton);

  // Add an open settings Button
  const settingsButtonContainer = document.createElement("div");
  settingsButtonContainer.id = "settingsButtonContainer";
  settingsButtonContainer.classList.add("settings-button-container");

  const settingsButton = document.createElement("button");
  settingsButton.id = "settingsButton";
  settingsButton.classList.add("info-button"); // use the info button for positoning and styles

  const settingsImgElement = document.createElement("img");
  settingsImgElement.classList.add("info-icon-img");
  settingsImgElement.src = "../Better-Boids-Game/pngs/Boids_Logo_Option_2.png";
  settingsImgElement.alt = "Settings Icon";

  const settingsIconText = document.createElement("span");
  settingsIconText.classList.add("info-icon-text"); // use the info icon for positoning and styles
  settingsIconText.textContent = "u";

  // Append elements to create button
  settingsButton.appendChild(settingsImgElement);
  settingsButton.appendChild(settingsIconText);
  settingsButtonContainer.appendChild(settingsButton);

  // Create sliders and their containers
  var speedSliderContainer = instantiateSlider(
    "Max Speed",
    BoidFactors.speed,
    "0.05",
    "1",
    "0.05"
  );

  var alignmentSliderContainer = instantiateSlider(
    "Alignment",
    BoidFactors.alignmentFactor,
    "0",
    "1",
    "0.001"
  );

  var cohesionSliderContainer = instantiateSlider(
    "Cohesion",
    BoidFactors.cohesionFactor,
    "0",
    "1",
    "0.001"
  );

  var radiusSliderContainer = instantiateSlider(
    "Flock Radius",
    BoidFactors.flockSearchRadius,
    `${BoidFactors.boidProtectedRadius + 5}`, // Cannot go smaller than protected radius with some buffer
    "100",
    "1"
  );

  var separationSliderContainer = instantiateSlider(
    "Separation",
    BoidFactors.separationFactor,
    "0",
    "1",
    "0.001"
  );

  addFlockRadiusIndicator(radiusSliderContainer);
  addTouchEventListenersToSliders();

  // Set up parenting structure and append to body of document
  settingsHeader.appendChild(closeButton);
  settingsBox.appendChild(settingsHeader);
  settingsBox.appendChild(settingsContent);

  settingsBox.appendChild(speedSliderContainer);
  appendBlankSpace(settingsBox);
  settingsBox.appendChild(alignmentSliderContainer);
  appendBlankSpace(settingsBox);
  settingsBox.appendChild(cohesionSliderContainer);
  appendBlankSpace(settingsBox);
  settingsBox.appendChild(radiusSliderContainer);
  appendBlankSpace(settingsBox);
  settingsBox.appendChild(separationSliderContainer);
  appendBlankSpace(settingsBox);

  document.body.appendChild(settingsBox);
  document.body.appendChild(settingsButtonContainer);

  // Show the settings box when the button is clicked
  settingsButton.addEventListener("click", () => {
    settingsBox.style.display = "block";
  });

  // Close the settings box when the close button is clicked
  function closeSettingsBox() {
    settingsBox.style.display = "none";
  }

  function appendBlankSpace(parent) {
    var blankSpace = document.createElement("div");
    blankSpace.classList.add("slider-blank-space");
    parent.appendChild(blankSpace);
  }

  function addTouchEventListenersToSliders() {
    // Add touch event listeners to slider containers so that we can show the hover text
    // if someone on a phone touches on a slider.
    var sliderContainers = document.querySelectorAll(".slider-container");

    // When someone touches the slider, add the touch-hover class to it so it can hover,
    // then on touch end remove this class so it doesnt interfere with anything
    sliderContainers.forEach(function (container) {
      // Add when touch starts
      container.addEventListener("touchstart", function (event) {
        container.classList.add("touch-hover");
      });

      // Remove when the touch ends
      container.addEventListener("touchend", function (event) {
        container.classList.remove("touch-hover");
      });
    });
  }

  function instantiateSlider(name, value, min, max, step) {
    // init slider container
    var sliderContainer = document.createElement("div");
    sliderContainer.classList.add("slider-container");

    // init slider
    var slider = document.createElement("input");
    slider.setAttribute("type", "range");
    slider.setAttribute("min", min);
    slider.setAttribute("max", max);
    slider.setAttribute("step", step);
    slider.value = value; // Set initial value
    sliderContainer.appendChild(slider);

    // Add label
    var label = document.createElement("label");
    label.textContent = name;
    label.classList.add("slider-label");
    sliderContainer.appendChild(label);

    // Slide value hover label
    var hoverLabel = document.createElement("div");
    hoverLabel.classList.add("slider-hover-label");
    hoverLabel.textContent = slider.value; // init hover text
    sliderContainer.appendChild(hoverLabel);

    // Append sliders to the document body
    initSliderEvents(slider, name, hoverLabel);

    return sliderContainer;
  }

  function addFlockRadiusIndicator(radiusSliderContainer) {
    // Create the circle element to represent the flock radius
    var circle = document.createElement("div");
    circle.classList.add("flock-radius-indicator");
    document.body.appendChild(circle);

    // Initially hide the circle
    circle.style.display = "none";

    // Find the input range element within the container
    var inputRange = radiusSliderContainer.querySelector("input[type='range']");

    // On input, update the flock radius circle to be visible
    inputRange.addEventListener("input", function (event) {
      var radiusValue = parseFloat(inputRange.value);
      updateFlockRadiusIndicator(circle, radiusValue);
    });

    // Listen for pointer event to hide the circle when the slider is released.
    // This tries to catch the general case of a finger or a mouse.
    inputRange.addEventListener("pointerup", function () {
      if (circle.style.display !== "none") {
        circle.style.display = "none";
      }
    });

    // Listen for touchend event to hide the circle when the slider is released.
    // This is backup if a browser cannot detect pointerup.
    inputRange.addEventListener("touchend", function () {
      if (circle.style.display !== "none") {
        circle.style.display = "none";
      }
    });

    // Listen for mouseup event to hide the circle when the slider is released.
    // This is backup if a browser cannot detect pointerup.
    inputRange.addEventListener("mouseup", function () {
      if (circle.style.display !== "none") {
        circle.style.display = "none";
      }
    });
  }

  function updateFlockRadiusIndicator(circle, radius) {
    // Set the circle's radius and position
    var diameter = radius * 2;
    circle.style.width = diameter + "px";
    circle.style.height = diameter + "px";
    circle.style.borderRadius = "50%";
    circle.style.position = "absolute";
    circle.style.top = "50%";
    circle.style.left = "50%";
    circle.style.transform = "translate(-50%, -50%)";
    circle.style.zIndex = "6";

    // Adjust transparency based on radius value
    var transparency = 0.5;
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

  function initSliderEvents(slider, name, hoverLabel) {
    // When a user clicks on the slider, update the handle of the slider to be where the player touched
    slider.addEventListener("pointerdown", function (event) {
      updateSliderHandle(event, slider, name);
    });

    slider.addEventListener("pointermove", function (event) {
      // If we left-click and drag with a mouse, OR if it is not a mouse (aka it is a pointer for a phone)
      // then assume this is a drag event where we want the slider to be dragged.
      if (event.pointerType === "mouse" ? event.buttons === 1 : true) {
        updateSliderHandle(event, slider, name);
      }
    });

    // Add input event listeners to each slider to update slider value
    slider.addEventListener("input", function () {
      // Update the value of the actual variable as the slider changes
      updateFactor(name, parseFloat(this.value));

      // Update hover label text
      hoverLabel.textContent = this.value;
    });
  }

  function updateSliderHandle(event, slider, name) {
    // Calculate and update slider value based on pointer location
    var newValue = calculateNewValue(event.clientX, slider);
    slider.value = newValue;

    // Dispatch the input event to trigger any input event listeners (such as the updateFactor() for e.g. function that gets triggered during input events)
    slider.dispatchEvent(new Event("input"));
  }

  function calculateNewValue(clientX, slider) {
    // Calculate the position of the click or touch relative to the slider
    var rect = slider.getBoundingClientRect();
    var offsetX = clientX - rect.left;
    var sliderWidth = rect.width;

    // Calculate the new value based on the position of the click or touch
    var min = parseFloat(slider.min);
    var max = parseFloat(slider.max);
    var range = max - min;
    var ratio = Math.min(1, Math.max(0, offsetX / sliderWidth));
    var newValue = min + ratio * range;

    return newValue;
  }
}
