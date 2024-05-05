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
