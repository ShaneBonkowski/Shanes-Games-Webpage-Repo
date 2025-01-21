/**
 * Creates and returns a slider container element.
 *
 * @param {string} name - The label for the slider.
 * @param {string} value - The starting value for the slider.
 * @param {string} min - The minimum value for the slider.
 * @param {string} max - The maximum value for the slider.
 * @param {string} step - Step size for incrementing on the slider.
 * @param {string} sliderContainerClass - Class for the slider container
 * @param {string} sliderLabelClass - Class for the slider label
 * @param {string} sliderHoverLabel - Class for the slider hover label
 */
export function instantiateSlider(
  name,
  value,
  min,
  max,
  step,
  sliderContainerClass = "slider-container",
  sliderLabelClass = "slider-label",
  sliderHoverLabel = "slider-hover-label"
) {
  const sliderContainer = document.createElement("div");
  sliderContainer.classList.add(sliderContainerClass);

  const slider = document.createElement("input");
  slider.setAttribute("type", "range");
  slider.setAttribute("min", min);
  slider.setAttribute("max", max);
  slider.setAttribute("step", step);
  slider.value = value;

  const label = document.createElement("label");
  label.textContent = name;
  label.classList.add(sliderLabelClass);

  const hoverLabel = document.createElement("div");
  hoverLabel.classList.add(sliderHoverLabel);
  hoverLabel.textContent = slider.value; // init hover text

  sliderContainer.appendChild(label);
  sliderContainer.appendChild(slider);
  sliderContainer.appendChild(hoverLabel);

  return sliderContainer;
}

/**
 * Adds events to the slider.
 *
 * @param {HTMLElement} sliderContainer - Slider container.
 * @param {function} onSliderUpdate - Function to call on slider update. Must take in the slider value as an input.
 * @param {string} touchHoverClass - Touch hover class.
 * @param {string} sliderHoverLabel - Class for the slider hover label
 **/
export function initSliderEvents(
  sliderContainer,
  onSliderUpdate,
  touchHoverClass = "touch-hover",
  sliderHoverLabel = "slider-hover-label"
) {
  const slider = sliderContainer.querySelector("input");

  // When someone touches the slider, add the touch-hover class to it so it can hover,
  // then on touch end remove this class so it doesnt interfere with anything
  slider.addEventListener(
    "touchstart",
    function (event) {
      slider.classList.add(touchHoverClass);
    }.bind(this)
  );

  slider.addEventListener(
    "touchend",
    function (event) {
      slider.classList.remove(touchHoverClass);
    }.bind(this)
  );

  // When a user clicks on the slider, update the handle of the slider to
  // be where the player touched
  slider.addEventListener(
    "pointerdown",
    function (event) {
      updateSliderHandle(event, slider);
    }.bind(this)
  );

  slider.addEventListener(
    "pointermove",
    function (event) {
      // If we left-click and drag with a mouse, OR if it is not a mouse (aka it is a pointer for a phone)
      // then assume this is a drag event where we want the slider to be dragged.
      if (event.pointerType === "mouse" ? event.buttons === 1 : true) {
        updateSliderHandle(event, slider);
      }
    }.bind(this)
  );

  // Add input event listeners to each slider to update slider value
  const hoverLabel = sliderContainer.querySelector("." + sliderHoverLabel);
  slider.addEventListener("input", function () {
    onSliderUpdate(parseFloat(slider.value));
    hoverLabel.textContent = slider.value;
  });
}

function updateSliderHandle(event, slider) {
  // Calculate and update slider value based on pointer location
  let newValue = calculateNewValue(event.clientX, slider);
  slider.value = newValue;

  // Dispatch the input event to trigger any input event listeners
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
