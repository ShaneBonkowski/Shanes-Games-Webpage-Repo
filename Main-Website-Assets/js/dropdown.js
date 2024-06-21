import { addClickAnimation } from "../../Shared-General-Assets/js/clickAnimation.js";

/**
 * Creates a dropdown menu with the specified options and class names.
 *
 * @param {string[]} options - An array of strings representing the dropdown options.
 * @param {Object} classNames - An object containing the class names for the dropdown components.
 * @param {string} classNames.dropdown - The class name for the dropdown container.
 * @param {string} classNames.button - The class name for the dropdown button.
 * @param {string} classNames.content - The class name for the dropdown content.
 * @returns {HTMLElement} The constructed dropdown container element.
 */
export function createDropdown(options, classNames) {
  const dropdownContainer = document.createElement("div");
  dropdownContainer.classList.add(classNames.dropdown);

  const dropdownButton = document.createElement("button");
  dropdownButton.classList.add(classNames.button);
  dropdownButton.textContent = options[0]; // Set the first option as the default
  addClickAnimation(dropdownButton);
  dropdownContainer.appendChild(dropdownButton);

  const dropdownContent = document.createElement("div");
  dropdownContent.classList.add(classNames.content);
  dropdownContainer.appendChild(dropdownContent);

  // Add each dropdown option
  options.forEach((option) => {
    // Create an 'a' element to act as a dropdown option.
    // Sort of a hack to turn a link into a button for this dropdown.
    const optionElement = document.createElement("a");
    optionElement.href = "#"; // Dummy href to make it behave like a link
    optionElement.textContent = option;

    // Add event listeners for both click and touchstart
    function selectOption(e) {
      e.preventDefault(); // Prevent default link behavior
      dropdownButton.textContent = option; // Update dropdown button text
      dropdownContent.classList.remove("content-dropdown-show"); // Close dropdown
    }

    optionElement.addEventListener("click", selectOption);
    optionElement.addEventListener("touchstart", selectOption);

    addClickAnimation(optionElement);
    dropdownContent.appendChild(optionElement);
  });

  // Toggle dropdown visibility on button click and touchend
  dropdownButton.addEventListener("click", () => {
    dropdownContent.classList.toggle("content-dropdown-show");
  });

  // Give touchstart a delay since phone has a tendency to
  // click multiple times on one click
  let canToggle = true;
  dropdownButton.addEventListener("touchstart", () => {
    if (canToggle) {
      dropdownContent.classList.toggle("content-dropdown-show");

      canToggle = false;
      setTimeout(() => {
        canToggle = true;
      }, 200);
    }
  });

  // Close the dropdown if user clicks or touches outside of it
  function closeDropdown(event) {
    if (!dropdownContainer.contains(event.target)) {
      dropdownContent.classList.remove("content-dropdown-show");
    }
  }

  window.addEventListener("click", closeDropdown);
  window.addEventListener("touchstart", closeDropdown);

  return dropdownContainer;
}
