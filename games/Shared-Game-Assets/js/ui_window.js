export function createUIWindow(
  boxID,
  headerText,
  contentHTML,
  onClickX,
  onClose,
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
  closeButton.onclick = onClickX;
  closeButton.addEventListener("click", onClose);

  // Assemble the window components
  header.appendChild(closeButton);
  windowBox.appendChild(header);
  windowBox.appendChild(content);

  return windowBox;
}
