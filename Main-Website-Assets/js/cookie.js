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

  // If this is the first time trying to access the cookie variable from the
  // JS localStorage object, set it to false.
  var cookiesEnabled = localStorage.getItem("cookiesEnabled");

  if (cookiesEnabled == null) {
    localStorage.setItem("cookiesEnabled", false);
    cookiesEnabled = false;
  }

  // Hide banner if cookies are enabled
  if (cookiesEnabled === "true") {
    cookieBanner.style.display = "none";
  }

  // Hide banner and update cookie variable on click
  enableCookiesBtn.addEventListener("click", () => {
    localStorage.setItem("cookiesEnabled", true);
    cookieBanner.style.display = "none";
  });

  disableCookiesBtn.addEventListener("click", () => {
    localStorage.setItem("cookiesEnabled", false);
    cookieBanner.style.display = "none";
  });
}
