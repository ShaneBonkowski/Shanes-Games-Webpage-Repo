/**
 * Creates a search bar and button with specified class names and attaches a search function.
 * @param {Array} searchContainerClasses - List of class names for the container that holds the search bar and button.
 * @param {Array} searchBarClasses - List of class names for the search bar.
 * @param {string} placeholderText - Text to show when search box is empty
 * @returns {HTMLElement} - The search bar container element.
 */
export function createSearchBarContainer(
  searchContainerClasses,
  searchBarClasses,
  placeholderText
) {
  const container = document.createElement("div");
  searchContainerClasses.forEach((className) =>
    container.classList.add(className)
  );

  const searchBar = document.createElement("input");
  searchBar.type = "text";
  searchBar.placeholder = placeholderText;
  searchBarClasses.forEach((className) => searchBar.classList.add(className));

  container.appendChild(searchBar);

  return container;
}
