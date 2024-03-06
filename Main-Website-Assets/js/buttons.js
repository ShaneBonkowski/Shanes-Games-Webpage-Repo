export function createButtonLinkElement(
  text,
  url,
  linkClasses = [],
  buttonTextClasses = [],
  iconClasses = [],
  containerClasses = [],
  openInNewTab = false
) {
  // Creates a button that on click takes you to a link.
  // The link element holds the button, text, and icon
  var linkElement = document.createElement("a");
  linkElement.href = url;
  if (openInNewTab) {
    linkElement.target = "_blank";
  }
  linkElement.classList.add(...linkClasses);

  // Initialize container and text
  var buttonContainer = document.createElement("div");
  buttonContainer.classList.add(...containerClasses);

  var buttonText = document.createElement("div");
  buttonText.classList.add(...buttonTextClasses);
  buttonText.textContent = text;

  // Optionally create button icon element
  if (iconClasses.length > 0) {
    var iconElement = document.createElement("i");
    iconElement.classList.add(...iconClasses);
    buttonContainer.appendChild(iconElement);
  }

  // Append children
  buttonContainer.appendChild(buttonText);
  linkElement.appendChild(buttonContainer);

  return linkElement;
}
