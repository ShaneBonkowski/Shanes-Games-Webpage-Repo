/**
 * @module CookieBanner
 *
 * @author Shane Bonkowski
 */

import { createYesNoBox } from "/Main-Website-Assets/js/yes-no-box.js";

/**
 * Creates a cookie banner that tracks whether a user wants cookies or not.
 */
export function createCookieBanner() {
  // NOTE: cookiesEnabled true or false is stored in localStorage
  // so that even if a user clears all cookies, we still know if they
  // want cookies or not. localStorage is a separate storage location from
  // cookies.
  let cookiesEnabled = localStorage.getItem("cookiesEnabled");

  // Skip creating the banner if the user has already made a choice
  if (cookiesEnabled === "true" || cookiesEnabled === "false") {
    return;
  }

  // Create the cookie banner enable/disable box IF user has not agreed or disagreed
  // to cookies yet
  const cookieBanner = createYesNoBox(
    "cookie-banner",
    'This website uses cookies to ensure you get the best experience. By continuing to use this site, you accept our use of cookies. Learn more about our <a href="/Main-Website-Assets/cookie-policy.html">cookie policy</a> here.',
    "enable-cookies",
    "Enable Cookies",
    () => {
      // Inline lamda for enableCookies
      localStorage.setItem("cookiesEnabled", "true");
      cookieBanner.style.display = "none";
      onCookieEnable();
    },
    "disable-cookies",
    "Disable Cookies",
    () => {
      // Inline lamda for disableCookies
      localStorage.setItem("cookiesEnabled", "false");
      cookieBanner.style.display = "none";
      onCookieDisable();
    },
    ["cookie-banner"], // Box classes
    ["cookie-button-container"] // Button container classes
  );

  document.body.appendChild(cookieBanner);
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
