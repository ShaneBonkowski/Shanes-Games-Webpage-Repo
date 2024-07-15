/**
 * @module CookieBanner
 *
 * @author Shane Bonkowski
 */

import { addClickAnimation } from "/Shared-General-Assets/js/click-animation.js";

/**
 * Creates a cookie banner that tracks whether a user wants cookies or not.
 */
export function createCookieBanner() {
  const cookieBanner = document.getElementById("cookie-banner");
  const enableCookiesBtn = document.getElementById("enable-cookies");
  const disableCookiesBtn = document.getElementById("disable-cookies");

  // NOTE: cookiesEnabled true or false is stored in localStorage
  // so that even if a user clears all cookies, we still know if they
  // want cookies or not. localStorage is a separate storage location from cookies.
  let cookiesEnabled = localStorage.getItem("cookiesEnabled");

  // Hide banner if cookie decision has already been made
  if (cookiesEnabled === "true" || cookiesEnabled === "false") {
    cookieBanner.style.display = "none";
  }
  // First time visiting site, and/or no decision has been
  // made yet with cookies
  else if (cookiesEnabled === null) {
    // Do things here at some point?
  }

  // Hide banner and update cookie variable on click
  if (enableCookiesBtn && disableCookiesBtn) {
    enableCookiesBtn.addEventListener("click", () => {
      localStorage.setItem("cookiesEnabled", "true");
      cookiesEnabled = "true";
      cookieBanner.style.display = "none";
      onCookieEnable();
    });

    disableCookiesBtn.addEventListener("click", () => {
      localStorage.setItem("cookiesEnabled", "false");
      cookiesEnabled = "false";
      cookieBanner.style.display = "none";
      onCookieDisable();
    });

    // Add click events for the cookie buttons to do
    // an anim on click
    addClickAnimation(enableCookiesBtn);
    addClickAnimation(disableCookiesBtn);
  } else {
    console.error("Enable/Disable cookies buttons not found.");
  }
}

/**
 * Callback function to perform actions when cookies are enabled.
 *
 * @returns {void}
 */
function onCookieEnable() {
  enableTracking();
}

/**
 * Callback function to perform actions when cookies are disabled.
 *
 * @returns {void}
 */
function onCookieDisable() {
  disableTracking();
}

/**
 * Enables Google Analytics tracking and reloads the page.
 *
 * @returns {void}
 */
function enableTracking() {
  // GitHub actions html injection tha occurs during build ensures
  // that Google Analytics knows to enable/disable
  // tracking based on the state of localStorage.cookiesEnabled.

  // Reload the page to ensure the changes take effect and Google Analytics
  // can be re-initialized with latest changes to localStorage.cookiesEnabled.
  window.location.reload();
}

/**
 * Disables Google Analytics tracking, removes existing tracking scripts and cookies,
 * and reloads the page to ensure the changes take effect.
 *
 * @returns {void}
 */
function disableTracking() {
  // GitHub actions html injection tha occurs during build ensures
  // that Google Analytics knows to enable/disable
  // tracking based on the state of localStorage.cookiesEnabled.

  // Remove existing tracking scripts
  document
    .querySelectorAll('script[src^="https://www.google-analytics.com"]')
    .forEach((script) => {
      script.remove();
    });

  // Remove all existing cookies
  document.cookie.split(";").forEach(function (c) {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });

  // Reload the page to ensure the changes take effect and Google Analytics
  // can be re-initialized with latest changes to localStorage.cookiesEnabled.
  window.location.reload();
}
