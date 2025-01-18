/**
 * Creates a UI window element with a header, content, and close button.
 *
 * @param {string} boxID - The ID attribute for the window box element.
 * @param {string} headerText - The text content of the header.
 * @param {string} contentHTML - The HTML content of the window's main content area.
 * @param {Function[]} onClickXFunctions - An array of functions to execute when the close button is clicked.
 * @param {string[]} [windowBoxClasses=[]] - An array of CSS classes to be added to the window box element.
 * @param {string[]} [headerClasses=[]] - An array of CSS classes to be added to the header element.
 * @param {string[]} [contentClasses=[]] - An array of CSS classes to be added to the content element.
 * @param {string[]} [closeButtonClasses=[]] - An array of CSS classes to be added to the close button element.
 */
export function createUIWindow(
  boxID,
  headerText,
  contentHTML,
  onClickXFunctions,
  windowBoxClasses = [],
  headerClasses = [],
  contentClasses = [],
  closeButtonClasses = []
) {
  // Create window elements
  const windowBox = document.createElement("div");
  windowBox.id = boxID;
  windowBox.classList.add(...windowBoxClasses);

  const header = document.createElement("div");
  header.classList.add(...headerClasses);
  header.textContent = headerText;

  const content = document.createElement("div");
  content.classList.add(...contentClasses);
  content.innerHTML = contentHTML;

  const closeButton = document.createElement("span");
  closeButton.classList.add(...closeButtonClasses);
  closeButton.textContent = "x";
  onClickXFunctions.forEach((func) => {
    closeButton.addEventListener("pointerdown", func);
  });

  // Assemble the window components
  header.appendChild(closeButton);
  windowBox.appendChild(header);
  windowBox.appendChild(content);

  return windowBox;
}
