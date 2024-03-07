export function createToggleBox(
  labelText,
  onChangeCallback,
  toggleBoxContainerClasses = [],
  toggleLabelClasses = [],
  toggleInputClasses = [],
  isChecked = true
) {
  const toggleBoxContainer = document.createElement("div");
  toggleBoxContainer.classList.add(...toggleBoxContainerClasses);

  const toggleLabel = document.createElement("label");
  toggleLabel.textContent = labelText;
  toggleLabel.classList.add(...toggleLabelClasses);
  toggleBoxContainer.appendChild(toggleLabel);

  const toggleInput = document.createElement("input");
  toggleInput.type = "checkbox";
  toggleInput.checked = isChecked;
  toggleInput.classList.add(...toggleInputClasses);
  toggleBoxContainer.appendChild(toggleInput);

  // Add provided event listener to be called when box is toggled
  toggleInput.addEventListener("change", function () {
    if (onChangeCallback && typeof onChangeCallback === "function") {
      onChangeCallback(toggleInput.checked);
    }
  });

  return toggleBoxContainer;
}
