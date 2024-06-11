/**
 * @module CookieBanner
 *
 * @author Shane Bonkowski
 */

import { getAnalyticsMeasurementId } from "./firestore_cloud_function_api.js";

/**
 * Creates a cookie banner that tracks whether a user wants cookies or not.
 */
export function createCookieBanner() {
  const cookieBanner = document.getElementById("cookie-banner");
  const enableCookiesBtn = document.getElementById("enable-cookies");
  const disableCookiesBtn = document.getElementById("disable-cookies");

  // NOTE: cookiesEnabled true or false is stored in localStorage
  // so that even if a user clears all cookies, we still know if they
  // want cookies or not.
  let cookiesEnabled = localStorage.getItem("cookiesEnabled");

  // Hide banner if cookie decision has already been made
  if (cookiesEnabled === "true" || cookiesEnabled === "false") {
    cookieBanner.style.display = "none";
  }
  // First time visiting site, and/or no decision has been
  // made yet with cookies
  else if (cookiesEnabled === null) {
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
 * Enables Google Analytics tracking by setting the corresponding flag and reloading the page.
 *
 * @returns {void}
 */
function enableTracking() {
  try {
    // Enable Google Analytics tracking
    const analyticsMeasurementId = getAnalyticsMeasurementId();
    window[`ga-disable-${analyticsMeasurementId}`] = false;

    // Reload the page to ensure the changes take effect
    window.location.reload();
  } catch (error) {
    console.error("Error enabling google analytics:", error);
    // Display error to user
    alert(
      "An error occurred while enabling google analytics cookies. Please try again later."
    );
  }
}

/**
 * Disables Google Analytics tracking, removes existing tracking scripts and cookies,
 * and reloads the page to ensure the changes take effect.
 *
 * @returns {void}
 */
function disableTracking() {
  try {
    // Disable Google Analytics tracking
    const analyticsMeasurementId = getAnalyticsMeasurementId();
    window[`ga-disable-${analyticsMeasurementId}`] = true;

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

    // Reload the page to ensure the changes take effect
    window.location.reload();
  } catch (error) {
    console.error("Error disabling google analytics:", error);
    // Display error to user
    alert(
      "An error occurred while disabling google analytics cookies. Please try again later."
    );
  }
}
