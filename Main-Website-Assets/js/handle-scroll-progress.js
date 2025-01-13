/**
 * @fileOverview Handles saving and loading of scroll position. Great for users jumping to the
 * last location they were at when reading a story.
 *
 * @module HandleScrollProgress
 *
 * @author Shane Bonkowski
 */

import { createYesNoBox } from "/Main-Website-Assets/js/yes-no-box.js";

/**
 * Handles the saving/loading of scroll position on a page.
 *
 * @param {string} pageName - The name of the page (used to generate a unique key for localStorage).
 */
export function handleScrollProgress(pageName) {
  // Key to store scroll progress in localStorage
  const progressKey = `${pageName}-page-progress`;

  // Check if there is already previously saved scroll progress for the page,
  // and if so pop up a banner for a user to pick up where they left off.
  const savedProgress = localStorage.getItem(progressKey);

  if (savedProgress) {
    const scrollPosition = parseFloat(savedProgress);
    if (!isNaN(scrollPosition)) {
      // Create a yes/no box for a user to decide if they want
      // to pick up where they left off
      const scrollProgressBanner = createYesNoBox(
        "scroll-progress",
        "Pick up where you left off?",
        "yes-scroll-progress",
        "Yes",
        () => {
          // Inline lamda for "yes"
          scrollProgressBanner.style.display = "none";
          window.scrollTo({ top: scrollPosition, behavior: "smooth" });
        },
        "no-scroll-progress",
        "No",
        () => {
          // Inline lamda for "no"
          scrollProgressBanner.style.display = "none";
        },
        ["scroll-progress"], // Box classes
        ["scroll-progress-button-container"] // Button container classes
      );

      document.body.appendChild(scrollProgressBanner);
    } else {
      console.error("Invalid saved progress value.");
    }
  }

  // Save the scroll position as a user scrolls
  // (only after they are done scrolling so that it is more performant)
  let debounceTimeout;
  const saveScrollPosition = () => {
    clearTimeout(debounceTimeout); // Clear the previous timeout if scrolling continues
    debounceTimeout = setTimeout(() => {
      const scrollPosition = window.scrollY;
      localStorage.setItem(progressKey, scrollPosition.toString());
    }, 200); // Save after this many millisec of inactivity
  };

  window.addEventListener("scroll", saveScrollPosition);
}
