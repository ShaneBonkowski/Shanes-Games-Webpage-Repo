import { createFooter } from "/Main-Website-Assets/js/footer.js";
import { addClickAnimation } from "/Shared-General-Assets/js/click-animation.js";
import { handleContentBoxHover } from "/Main-Website-Assets/js/content-box-hover-handling.js";
import { createDropdown } from "./dropdown.js";
import { createSearchBarContainer } from "/Main-Website-Assets/js/search-bar.js";
import { createFunctionButtonContainer } from "/Main-Website-Assets/js/buttons.js";

// Array of content box data
export const contentBoxes = [
  {
    imageUrl: "/games/Game-Of-Life/webps/game-of-life-cover.webp",
    linkUrl: "/games/Game-Of-Life/Game-Of-Life.html",
    title: "Conway's Game of Life",
    description:
      "Experience the emergent world of cellular automata. Classic Conway's Game of Life with advanced customization options to create your own.",
    search_tags:
      "conway, conways, conway's, game, of, life, cell, cellular, automata",
    content_type: "games",
    openInNewTab: false,
  },
  {
    imageUrl: "/games/Better-Boids-Game/webps/Game-Cover-Picture.webp",
    linkUrl: "/games/Better-Boids-Game/Better-Boids.html",
    title: "Better Boids",
    description:
      "A unique twist to the classic Boids algorithm. Player controlled Boid, predator-prey relationships, customizable toggles & more.",
    search_tags: "birds, bird, boid, flying, simulation",
    content_type: "games",
    openInNewTab: false,
  },
  {
    imageUrl: "/games/Flip-Tile-Game/webps/Cover-Art.webp",
    linkUrl: "/games/Flip-Tile-Game/Flip-Tile.html",
    title: "Flip Tile",
    description:
      "Classic 'lights out' style puzzle game. Flipping one tile causes neighboring tiles to flip as well. Match them all to advance further!",
    search_tags: "flip, flop, tile, matrix",
    content_type: "games",
    openInNewTab: false,
  },
  {
    imageUrl: "/Main-Website-Assets/webps/SOSS-cover-art.webp",
    linkUrl:
      "https://store.steampowered.com/app/2061040/Save_Our_Solar_System/",
    title: "Save Our Solar System",
    description:
      "(Steam Game) Stave off countless waves of asteroids as you fight to protect the Solar System from extinction. A fresh look on the tower defense genre!",
    search_tags: "SOSS, SOS, radiohead, radio, head, asteroid",
    content_type: "games",
    openInNewTab: true,
  },
  {
    imageUrl: "/Main-Website-Assets/webps/AD-cover-art.webp",
    linkUrl: "https://store.steampowered.com/app/2506740/Abyssal_Descent/",
    title: "Abyssal Descent",
    description:
      "(Steam Game) Embark on an epic platformer adventure through procedurally generated caves, solving intricate puzzles, and battling fearsome enemies!",
    search_tags: "ghost, boi, boy, jump, endless",
    content_type: "games",
    openInNewTab: true,
  },
  {
    imageUrl: "/writing/webps/I-am-immortal-image.webp",
    linkUrl: "/writing/I-am-immortal.html",
    title: "I am Immortal",
    description:
      "If you ask me, I’m at least 13.8 billion years old. Born in the aftermath of the Big Bang. My life began the same way it will end: Scattered across Infinity.",
    search_tags:
      "life, death, universe, immortal, live, forever, spooky, eerie, sci-fi, science, fiction",
    content_type: "writing",
    openInNewTab: false,
  },
  {
    imageUrl: "/writing/webps/Before-The-World-Dried-Boat-Cropped.webp",
    linkUrl: "/writing/Before-the-world-dried-up.html",
    title: "Before the World Dried Up",
    description:
      "They ask me why I plan on sticking around this place. Why I haven't jumped ship with the rest of them. I let out a sigh as I gaze off across the lifeless desertscape.",
    search_tags:
      "earth, world, universe, boat, water, ocean, existential, spooky, eerie, sci-fi, science, fiction",
    content_type: "writing",
    openInNewTab: false,
  },
  {
    imageUrl: "/writing/webps/The-Sun-Tarot.webp",
    linkUrl: "/writing/The-Sun.html",
    title: "The Sun",
    description:
      "To my firstborn: Do you ever stop and wonder, if the wind did not blow, would the wilted flowers remain in frozen perfection for all eternity?",
    search_tags:
      "Tarot, Sun, Stars, Star, Sun, Card, Shimmer, Glitter, Space, Crow, Crows, Bird, Birds, Flowers, Flower, tree, forest",
    content_type: "writing",
    openInNewTab: false,
  },
  {
    imageUrl: "/writing/webps/The-Moon-Tarot.webp",
    linkUrl: "/writing/The-Moon.html",
    title: "The Moon",
    description:
      "Step by step, I trudge on through the long night. My body aches and my bones tremble under the weight of her gaze, a constant reminder of my imprisonment.",
    search_tags: "Tarot, Moon, Stars, Star, Sun, Card, Shimmer, Glitter, Space",
    content_type: "writing",
    openInNewTab: false,
  },
  {
    imageUrl: "/writing/webps/The-Star-Tarot.webp",
    linkUrl: "/writing/The-Star.html",
    title: "The Star",
    description:
      "She was the healer. The silent observer. The glue that held it all together until the very end. Great fires would rage and she would drag the ocean down from the heavens.",
    search_tags:
      "Tarot, Stars, Star, Card, Shimmer, Glitter, Space, Goddess, God",
    content_type: "writing",
    openInNewTab: false,
  },
  {
    imageUrl: "/writing/webps/Death-Tarot.webp",
    linkUrl: "/writing/Death.html",
    title: "Death",
    description:
      "A man sits alone at a rundown bar after a long day of work, his soulless eyes projecting a heavy, lingering despair. Deep in the mind of the troubled man, a war is brewing.",
    search_tags:
      "Tarot, Death, Revelation, Card, Revelations, Bible, Space, Goddess, God, Horse",
    content_type: "writing",
    openInNewTab: false,
  },
  {
    imageUrl: "/writing/webps/My-Final-Thought.webp",
    linkUrl: "/writing/My-Final-Thought.html",
    title: "My Final Thought",
    description:
      "As I sit here and watch the unforgiving grains of sand trickle down from my hourglass, there is nothing left to do but ponder.",
    search_tags: "Death, Bible, Hunting, Deer, Life, Universe, dad",
    content_type: "writing",
    openInNewTab: false,
  },
  {
    imageUrl: "/writing/webps/The-Lovers.webp",
    linkUrl: "/writing/The-Lovers.html",
    title: "The Lovers",
    description:
      "Deep within the hidden corridors of Genesis Labs, two scientists are developing what may go down as mankind’s final invention.",
    search_tags:
      "Love, Lovers, Bible, Adam, Eve, Universe, Nova, Lux, Mammon, Barachiel, Dr, Dr., Doctor, Scientist, AI, Artificial, Intelligence",
    content_type: "writing",
    openInNewTab: false,
  },
];

/**
 * Creates a content box containing an image button linked to a piece of content such as game, art, or writing, and a description of the content.
 * @param {string} imageSrc - The source URL (local path in this case) of the image for the content button. Must be 500 by 422 px!
 * @param {string} linkUrl - The URL of the content page or website to be taken to clicked on.
 * @param {string} titleText - The title text to display for the content.
 * @param {string} contentDescriptionText - The description text of the content.
 * @param {boolean} [openInNewTab=false] - A boolean indicating whether the link should open in a new tab.
 */
export function createContentBox(
  imageSrc,
  linkUrl,
  titleText,
  contentDescriptionText,
  content_type,
  openInNewTab = false
) {
  // Create a container div for the box
  const boxContainer = document.createElement("div");
  boxContainer.classList.add("content-box");

  // Create a container div for the button
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("content-box-button-container");

  // Create an anchor element for the button link
  const buttonLinkElement = document.createElement("a");
  buttonLinkElement.href = linkUrl;
  buttonLinkElement.classList.add("content-box-button-link-anchor");

  if (openInNewTab) {
    buttonLinkElement.target = "_blank";
  }

  // Create an image element for the button.
  // Image must be 500 by 422 px!
  const imageButton = document.createElement("img");
  imageButton.src = imageSrc;
  imageButton.classList.add("content-button");
  // imageButton.classList.add("content-button-hover-effect"); // Add hover effects with CSS

  // Create an anchor element for the title link
  const titleLinkElement = document.createElement("a");
  titleLinkElement.href = linkUrl;
  titleLinkElement.classList.add("title-link-anchor");

  if (openInNewTab) {
    titleLinkElement.target = "_blank";
  }

  // Create a div for the title
  const titleDiv = document.createElement("div");
  titleDiv.classList.add("content-title");
  titleDiv.textContent = titleText;

  // Create a container div for the content desc. text
  const contentDescContainer = document.createElement("div");
  contentDescContainer.classList.add("content-desc-container");

  // Create a div for the content desc. text
  const contentDescTextDiv = document.createElement("div");
  contentDescTextDiv.classList.add("content-description-text");
  contentDescTextDiv.textContent = contentDescriptionText;

  // Add an icon based on the content-type
  const iconElement = document.createElement("i");

  if (content_type.toLowerCase() === "games") {
    iconElement.classList.add(...["fas", "fa-gamepad"]);
  } else if (content_type.toLowerCase() === "writing") {
    iconElement.classList.add(...["fas", "fa-pen-nib"]);
  } else if (content_type.toLowerCase() === "art") {
    iconElement.classList.add(...["fas", "fa-paint-brush"]);
  }

  // Append elements to their containers
  buttonLinkElement.appendChild(imageButton);
  buttonContainer.appendChild(buttonLinkElement);

  titleLinkElement.appendChild(iconElement);
  titleLinkElement.appendChild(titleDiv);
  contentDescContainer.appendChild(titleLinkElement);
  contentDescContainer.appendChild(contentDescTextDiv);

  boxContainer.appendChild(buttonContainer);
  boxContainer.appendChild(contentDescContainer);

  // Append the container to the body of the document
  document.body.appendChild(boxContainer);
}

export function postContentBoxRendering() {
  createFooter();
  handleContentBoxHover();

  // Apply click animation to all <a> elements
  const links = document.querySelectorAll("a");
  addClickAnimation(links);
}

function removePostContentBoxRendering() {
  const contentBoxElements = document.querySelectorAll(".content-box");
  contentBoxElements.forEach((element) => {
    element.remove();
  });

  const footerBannerElements = document.querySelectorAll(".footer-banner");
  footerBannerElements.forEach((element) => {
    element.remove();
  });

  const flexGrowForFooter = document.querySelectorAll(".flex-grow-for-footer");
  flexGrowForFooter.forEach((element) => {
    element.remove();
  });
}

/**
 * Creates all elements neccesary for the content search bar to function as intended.
 */
export function initContentSearchBar() {
  const searchBarContainer = createSearchBarContainer(
    ["content-search-container"],
    ["content-search-bar"],
    "Search games, writing, art..."
  );

  const searchButtonContainer = createFunctionButtonContainer(
    "searchButtonContainer",
    "searchButton",
    // No imgSrc or text since we are just using an icon for this button
    "",
    "",
    "",
    // No function passed in here, since we want to pass in a query
    // input to the search function. See below searchButton.addEventListener
    // for how this is done.
    [],
    ["content-search-button-container"],
    // No imgSrc or text classes since we are just using an icon for this button
    [],
    [],
    ["content-search-button"],
    ["fas", "fa-magnifying-glass"]
  );
  searchBarContainer.appendChild(searchButtonContainer);

  // Add content type dropdown box to the search bar container
  const dropdownOptions = ["All", "Games", "Writing", "Art"];
  const classNames = {
    dropdown: "content-dropdown-container",
    button: "content-dropdown-button",
    content: "content-dropdown-option",
  };
  const contentDropdownBoxContainer = createDropdown(
    dropdownOptions,
    classNames
  );
  searchBarContainer.insertBefore(
    contentDropdownBoxContainer,
    searchBarContainer.firstChild
  );

  function queryAndSearch() {
    // Re-query to get these elements. Not necc. needed for a static site,
    // but good practice for dynamic elements that can change often.
    const searchButtonContainer = document.body.querySelector(
      ".content-search-container"
    );
    const searchBar = searchButtonContainer.querySelector(
      ".content-search-bar"
    );

    // Search!
    const query = searchBar.value.trim();
    searchContent(query);
  }

  // If search button is pressed, then search
  const searchButton = searchButtonContainer.querySelector(
    ".content-search-button"
  );
  searchButton.addEventListener("pointerdown", queryAndSearch);

  // If content type is changed, then search
  const contentDropdownButtons =
    contentDropdownBoxContainer.querySelectorAll("a");
  contentDropdownButtons.forEach((button) => {
    button.addEventListener("pointerdown", queryAndSearch);
  });

  // If enter is pressed while the search bar is selected, search
  const searchBar = searchBarContainer.querySelector(".content-search-bar");
  searchBar.addEventListener("keydown", (event) => {
    // Enter == key code 13
    if (event.keyCode === 13) {
      // Have the event re-query to get these elements.
      // Not necc. needed for a static site, but good practice
      // for dynamic elements that can change often.
      const searchButtonContainer = document.body.querySelector(
        ".content-search-container"
      );
      const searchBar = searchButtonContainer.querySelector(
        ".content-search-bar"
      );
      // Check if the search bar is focused
      if (document.activeElement === searchBar) {
        // Prevent form submission or other default action
        event.preventDefault();

        // Search!
        const query = searchBar.value.trim();
        searchContent(query);
      }
    }
  });

  document.body.appendChild(searchBarContainer);
}

/**
 * Filters and displays content boxes based on the search query.
 * @param {string} query - The search query.
 */
export function searchContent(query) {
  // Query and delete everything that is rendered after the content boxes
  removePostContentBoxRendering();

  // Remove no-results-found-text if it exists
  const noResultsFoundText = document.querySelectorAll(
    ".no-results-found-text"
  );
  noResultsFoundText.forEach((element) => {
    element.remove();
  });

  // Filter by selected dropdown box content_type, e.g. games, or writing, or art
  let filteredContentBoxes;
  const dropdownButton = document.querySelector(".content-dropdown-button");
  if (dropdownButton) {
    // Button text is the type we filter by, e.g. games, or writing, or art
    const content_type_dropdown_selected = dropdownButton.textContent.trim();

    if (content_type_dropdown_selected.toLowerCase() !== "all") {
      filteredContentBoxes = contentBoxes.filter((contentBox) => {
        const contentTypeDropdownMatch =
          contentBox.content_type.toLowerCase() ===
          content_type_dropdown_selected.toLowerCase();

        return contentTypeDropdownMatch;
      });
    } else {
      // If "all" is specified return all content boxes
      filteredContentBoxes = contentBoxes;
    }
  } else {
    // If query is empty, return all content boxes
    filteredContentBoxes = contentBoxes;
  }

  // Filter to find close matches to titles, tags, and descriptions of content
  let queryFilteredContentBoxes;
  if (query !== "") {
    // Filter based on search config
    queryFilteredContentBoxes = filteredContentBoxes.filter((contentBox) => {
      const nameMatch = contentBox.title
        .toLowerCase()
        .includes(query.toLowerCase());
      const descriptionMatch = contentBox.description
        .toLowerCase()
        .includes(query.toLowerCase());
      const tagsMatch = contentBox.search_tags
        .toLowerCase()
        .includes(query.toLowerCase());

      return nameMatch || descriptionMatch || tagsMatch;
    });
  } else {
    // If query is empty, return all filteredContentBoxes from before
    queryFilteredContentBoxes = filteredContentBoxes;
  }

  // Re-render the content boxes
  if (queryFilteredContentBoxes.length > 0) {
    queryFilteredContentBoxes.forEach((contentBox) => {
      createContentBox(
        contentBox.imageUrl,
        contentBox.linkUrl,
        contentBox.title,
        contentBox.description,
        contentBox.content_type,
        contentBox.openInNewTab
      );
    });
  } else {
    // No results found!
    const noResultsDiv = document.createElement("div");
    noResultsDiv.classList.add("no-results-found-text");
    noResultsDiv.innerHTML = "<p>No results found...</p>";
    document.body.appendChild(noResultsDiv);
  }

  // Re-render everything that comes after the content box rendering
  postContentBoxRendering();
}
