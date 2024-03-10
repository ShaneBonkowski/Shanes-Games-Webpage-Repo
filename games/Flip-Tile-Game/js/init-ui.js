import { addUIButton } from "../../Shared-Game-Assets/js/ui_button.js";
import { customEvents } from "./tile-utils.js";
export function initUI() {
  // Add a button to update the tilegrid layout
  function onClickUpdateTileGrid() {
    document.dispatchEvent(customEvents.tileGridChangeEvent);
  }
  const updateTilegridButtonContainer = addUIButton(
    "updateTilegridContainer",
    "updateTilegrid",
    "../Better-Boids-Game/pngs/Boids_Logo_Option_2.png",
    "Update Tilegrid Icon",
    "New Puzzle",
    onClickUpdateTileGrid,
    null,
    ["updateTilegrid-button-container"],
    ["fliptile-icon-img"],
    ["fliptile-icon-text"],
    ["fliptile-button"]
  );

  // Add a button to reset the tilegrid layout back to how it was
  function onClickResetTileGrid() {
    document.dispatchEvent(customEvents.tileGridResetEvent);
  }
  const resetTilegridButtonContainer = addUIButton(
    "resetTilegridContainer",
    "resetTilegrid",
    "../Better-Boids-Game/pngs/Boids_Logo_Option_2.png",
    "Reset Tilegrid Icon",
    "Reset Puzzle",
    onClickResetTileGrid,
    null,
    ["resetTilegrid-button-container"],
    ["fliptile-icon-img"],
    ["fliptile-icon-text"],
    ["fliptile-button"]
  );

  document.body.appendChild(updateTilegridButtonContainer);
  document.body.appendChild(resetTilegridButtonContainer);
}
