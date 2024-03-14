export function createSelectionBox(
  numCheckboxes,
  id,
  label,
  value,
  parentElement,
  inputClasses = [],
  labelElementClasses = [],
  checked = false
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
  labelElement.classList.add(...labelElementClasses);

  parentElement.appendChild(input);
  parentElement.appendChild(labelElement);

  // Add event listener to uncheck other boxes when this one is checked
  input.addEventListener("change", function () {
    for (let i = 1; i <= numCheckboxes; i++) {
      const className = `.input-box-${i}`;
      const checkbox = document.querySelector(className);
      if (checkbox !== input && input.checked) {
        checkbox.checked = false;
      }
    }
  });
}
