/**
 * @fileOverview Creates UI selection box(es) with desired styling, image, etc.
 *
 * @module UISelectionBox
 *
 * @author Shane Bonkowski
 */

/**
 * Adds a selection box to the provided parent element.
 *
 * @param {string} id - The ID attribute for the selection box input element.
 * @param {string} label - The label text for the selection box.
 * @param {string} value - The value attribute for the selection box input element (e.g. if this is 1 of 3 selection boxes, the numbers for each would be 1, 2, 3 respectively).
 * @param {HTMLElement} parentElement - The parent element to which the selection box will be appended.
 * @param {string[]} [allSelectionBoxClasses=[]] - An array of CSS class names of all selection box elements that should be turned off when this one is turned on. Leave blank to make this behave as a single toggle box that does not affect other boses instead.
 * @param {string[]} [inputClasses=[]] - An array of CSS classes to be added to the selection box input element.
 * @param {string[]} [labelElementClasses=[]] - An array of CSS classes to be added to the label element.
 * @param {boolean} [checked=false] - Specifies whether the selection box should be initially checked.
 * @param {Function} [onChangeCallback=[]] - A callback function to be executed when the selection box state changes.
 */
export function createSelectionBox(
  id,
  label,
  value,
  parentElement,
  // allSelectionBoxClasses is the
  // name of all selection box classes that
  // are paired to this selection box
  // I.e. this is the list of all selection box classes
  // that should be turned off when this one is turned on, so that
  // Only one of these can be checked at a time. Leave blank in order
  // To make this behave as a toggle box instead, so that only this box turns on
  // and off without affecting others.
  allSelectionBoxClasses = [],
  inputClasses = [],
  labelElementClasses = [],
  checked = false,
  onChangeCallback = []
) {
  // Create the input element for the selection box
  const input = document.createElement("input");
  input.type = "checkbox";
  input.id = id;
  input.name = "box";
  input.value = value;
  input.classList.add(...inputClasses);
  input.checked = checked;

  const labelElement = document.createElement("label");
  labelElement.setAttribute("for", id);
  labelElement.textContent = label;
  labelElement.style.textAlign = "center";
  labelElement.classList.add(...labelElementClasses);

  parentElement.appendChild(input);
  parentElement.appendChild(labelElement);

  // Add event listener to uncheck other boxes when this one is checked
  input.addEventListener("change", function () {
    allSelectionBoxClasses.forEach((allSelectionBoxClass) => {
      const className = `.${allSelectionBoxClass}`;

      // Does an additional check to make sure it is not turning itself off
      const checkbox = document.querySelector(className);
      if (checkbox !== input && input.checked) {
        checkbox.checked = false;
      }
    });
  });

  // Add provided event listener function to be called when box is toggled (if provided)
  if (onChangeCallback && typeof onChangeCallback === "function") {
    input.addEventListener("change", function () {
      onChangeCallback(input.checked);
    });
  }
}
