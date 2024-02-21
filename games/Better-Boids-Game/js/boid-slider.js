import { BoidFactors } from "./boid-utils.js";
export function addBoidSliders() {
  // Create sliders and their containers
  var alignmentSliderContainer = instantiateSlider(
    "Alignment",
    BoidFactors.alignmentFactor,
    "0",
    "1",
    "0.05"
  );

  var cohesionSliderContainer = instantiateSlider(
    "Cohesion",
    BoidFactors.cohesionFactor,
    "0",
    "1",
    "0.05"
  );

  var radiusSliderContainer = instantiateSlider(
    "Flock Radius",
    BoidFactors.flockSearchRadius,
    "0",
    "200",
    "1"
  );

  var separationSliderContainer = instantiateSlider(
    "Separation",
    BoidFactors.separationFactor,
    "0",
    "1",
    "0.05"
  );

  addFlockRadiusIndicator(radiusSliderContainer);
  addTouchEventListenersToSliders();

  function addTouchEventListenersToSliders() {
    // Add touch event listeners to slider containers
    var sliderContainers = document.querySelectorAll(".slider-container");

    // When someone touches the slider, add the touch-hoever class to it so it can hover,
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
    sliderContainer.appendChild(hoverLabel);

    // Add event listeners to each slider
    slider.addEventListener("input", function () {
      // Update the value of the actual variable as the slider changes
      updateFactor(name, parseFloat(this.value));

      // Update hover label text
      hoverLabel.textContent = this.value;
    });

    // Append sliders to the document body or another appropriate element
    document.body.appendChild(sliderContainer);

    // Create and append blank space after the slider
    var blankSpace = document.createElement("div");
    blankSpace.classList.add("slider-blank-space");
    document.body.appendChild(blankSpace);

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

    // On iput, update the flock radius circle
    inputRange.addEventListener("input", function () {
      var radiusValue = parseFloat(inputRange.value);
      updateFlockRadiusIndicator(circle, radiusValue);
    });

    // Listen for mouseup event to hide the circle when the slider is released
    inputRange.addEventListener("pointerup", function () {
      circle.style.display = "none";
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

    // Adjust transparency based on radius value
    var transparency = 0.5;
    circle.style.backgroundColor = `rgba(255, 0, 0, ${transparency})`;

    // Show the circle
    circle.style.display = "block";
  }

  // Function to update the factor values
  function updateFactor(factorName, value) {
    switch (factorName) {
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
}
