import { BoidFactors } from "./boid-utils.js";
export function addBoidSliders() {
  // Create sliders and their containers
  var alignmentSliderContainer = instantiateSlider(
    "Alignment",
    BoidFactors.alignmentFactor
  );

  var cohesionSliderContainer = instantiateSlider(
    "Cohesion",
    BoidFactors.cohesionFactor
  );

  var radiusSliderContainer = instantiateSlider(
    "Flock Radius",
    BoidFactors.flockSearchRadius
  );

  var separationSliderContainer = instantiateSlider(
    "Separation",
    BoidFactors.separationFactor
  );

  function instantiateSlider(name, value) {
    // init slider container
    var sliderContainer = document.createElement("div");
    sliderContainer.classList.add("slider-container");

    // init slider
    var slider = document.createElement("input");
    slider.setAttribute("type", "range");
    slider.setAttribute("min", "0");
    slider.setAttribute("max", "1");
    slider.setAttribute("step", "0.1");
    slider.value = value; // Set initial value
    sliderContainer.appendChild(slider);

    // Add event listeners to each slider
    slider.addEventListener("input", function () {
      updateFactor(name, parseFloat(this.value));
    });

    // Add label
    var label = document.createElement("label");
    label.textContent = name;
    sliderContainer.appendChild(label);

    // Append sliders to the document body or another appropriate element
    document.body.appendChild(sliderContainer);

    return sliderContainer;
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
