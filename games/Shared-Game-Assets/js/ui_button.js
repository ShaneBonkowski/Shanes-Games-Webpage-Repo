export function addUIButton(
  containerId,
  buttonId,
  imgSrc,
  imgAlt,
  buttonText,
  onClickButton,
  onOpen,
  buttonContainerClasses = [],
  buttonIconClasses = [],
  buttonTextClasses = [],
  buttonClasses = []
) {
  const buttonContainer = document.createElement("div");
  buttonContainer.id = containerId;
  buttonContainer.classList.add(...buttonContainerClasses);

  const button = document.createElement("button");
  button.id = buttonId;
  button.classList.add(...buttonClasses);

  const imgElement = document.createElement("img");
  imgElement.classList.add(...buttonIconClasses);
  imgElement.src = imgSrc;
  imgElement.alt = imgAlt;

  const textElement = document.createElement("span");
  textElement.classList.add(...buttonTextClasses);
  textElement.textContent = buttonText;

  button.addEventListener("click", onClickButton);
  button.addEventListener("click", onOpen);

  button.appendChild(imgElement);
  button.appendChild(textElement);
  buttonContainer.appendChild(button);

  return buttonContainer;
}
