function createFooter() {
  // Create a container div for the footer box
  var footerContainer = document.createElement("footer");
  footerContainer.classList.add("footer-banner");

  // Create a div for the footer main text
  var footerMainTextDiv = document.createElement("div");
  footerMainTextDiv.classList.add("footer-main-text");
  footerMainTextDiv.textContent =
    "Thanks for visiting!\nShane's (cool) games by me (Shane)";

  // LinkedIn button
  var linkedInLinkElement = document.createElement("a");
  linkedInLinkElement.href = "https://www.linkedin.com/in/shanebonkowski/";
  linkedInLinkElement.target = "_blank"; // Open link in a new tab
  linkedInLinkElement.classList.add("linkedIn-button-link");

  var linkedInButtonContainer = document.createElement("div");
  linkedInButtonContainer.classList.add("linkedIn-button-container");

  var linkedInText = document.createElement("div");
  linkedInText.classList.add("linkedIn-text");
  linkedInText.textContent = "LinkedIn";

  var linkedInIconElement = document.createElement("i");
  linkedInIconElement.classList.add("fab", "fa-linkedin");

  linkedInButtonContainer.appendChild(linkedInIconElement);
  linkedInButtonContainer.appendChild(linkedInText);
  linkedInLinkElement.appendChild(linkedInButtonContainer);

  // Append elements to their containers
  footerContainer.appendChild(footerMainTextDiv);
  footerContainer.appendChild(linkedInLinkElement);

  // Append the container to the body of the document
  document.body.appendChild(footerContainer);
}
