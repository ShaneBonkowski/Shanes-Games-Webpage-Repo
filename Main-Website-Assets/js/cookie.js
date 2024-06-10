/**
 * @module CookieBanner
 *
 * @author Shane Bonkowski
 */

/**
 * Creates a cookie banner that tracks whether a user wants cookies or not.
 */
export function createCookieBanner() {
  const cookieBanner = document.getElementById("cookie-banner");
  const enableCookiesBtn = document.getElementById("enable-cookies");
  const disableCookiesBtn = document.getElementById("disable-cookies");

  let cookiesEnabled = localStorage.getItem("cookiesEnabled");

  if (cookiesEnabled === null) {
    // If this is the first time trying to access
    // the cookie variable from the JS localStorage
    // object, set it to "false" by default
    localStorage.setItem("cookiesEnabled", "false");
    cookiesEnabled = "false";
  } else if (cookiesEnabled === "true" || cookiesEnabled === "false") {
    // Hide banner if cookie decision has already been made
    cookieBanner.style.display = "none";
  }

  // Hide banner and update cookie variable on click
  if (enableCookiesBtn && disableCookiesBtn) {
    enableCookiesBtn.addEventListener("click", () => {
      localStorage.setItem("cookiesEnabled", "true");
      cookiesEnabled = "true";
      cookieBanner.style.display = "none";
    });

    disableCookiesBtn.addEventListener("click", () => {
      localStorage.setItem("cookiesEnabled", "false");
      cookiesEnabled = "false";
      cookieBanner.style.display = "none";
    });
  } else {
    console.error("Enable/Disable cookies buttons not found.");
  }
}
