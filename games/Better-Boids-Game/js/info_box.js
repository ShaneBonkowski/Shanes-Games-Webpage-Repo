// Get references to the button and info box
const infoButton = document.getElementById("infoButton");
const infoBox = document.getElementById("infoBox");

// Show the info box when the button is clicked
infoButton.addEventListener("click", () => {
  infoBox.style.display = "block";
});

// Close the info box when the close button is clicked
function closeInfoBox() {
  infoBox.style.display = "none";
}
