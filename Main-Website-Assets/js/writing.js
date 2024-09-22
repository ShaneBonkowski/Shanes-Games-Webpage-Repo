/**
 * Creates an article with specified title, subtitle, date, and body content.
 * Each paragraph in the body can have its own textAlign style.
 *
 * @param {string} title - The title of the article.
 * @param {string} subtitle - The subtitle of the article.
 * @param {string} date - The date of the article.
 * @param {Array} body - An array of objects where each object contains 'content' (string) and optional 'textAlign' and 'fontStyle' (string).
 * @param {Array} body_phone - (optional) Same as above, but for phone, so it can be slightly different. Can be null if phone matches regular body.
 * @param {string} image_url - (optional) url to the image to display at the top of the article.
 */
export function createArticle(
  title,
  subtitle,
  date,
  body,
  body_phone = null,
  image_url = null
) {
  // Clear previous content
  const articleContainer = document.createElement("div");
  articleContainer.classList.add("article-container");

  // Create and style elements for title, subtitle, and date
  const titleElem = document.createElement("h1");
  titleElem.innerHTML = title;

  const subtitleElem = document.createElement("h2");
  subtitleElem.innerHTML = subtitle;

  const dateElem = document.createElement("h4");
  dateElem.innerHTML = date;

  var imgElem = null;
  if (image_url) {
    imgElem = document.createElement("img");
    imgElem.classList.add("article-container-image");
    imgElem.src = image_url;
    imgElem.alt = "Image to accompany the story.";
  }

  const bodyElem = document.createElement("div");

  // Set body phone equal to body if no phone body provided
  if (body_phone === null) {
    body_phone = body;
  }

  // Iterate over each item in the body list,
  // set it to body by default.
  var totalWordCount = 0;
  body.forEach((item) => {
    const contentElem = document.createElement("p");
    // Preserve whitespace and newlines using <pre>
    contentElem.innerHTML = item.content;
    contentElem.style.textAlign = item.textAlign || "center"; // Use defaultTextAlign of center if none provided
    contentElem.style.fontStyle = item.fontStyle || "normal";

    // If textAlign is "justify", make this look book-like with hyphens etc.
    if (item.textAlign === "justify") {
      // Enable automatic hyphenation
      contentElem.style.hyphens = "auto";

      // WebKit-specific properties for Safari
      contentElem.style.webkitHyphens = "auto"; // Enable hyphenation in WebKit browsers
      contentElem.style.webkitHyphenateLimitBefore = "3"; // Max chars before hyphen
      contentElem.style.webkitHyphenateLimitAfter = "3"; // Max chars after hyphen
      contentElem.style.webkitHyphenateLimitChars = "6 3 3"; // Min chars in word, max before/after hyphen
      contentElem.style.webkitHyphenateLimitLines = "2"; // Max lines with hyphenation
      contentElem.style.webkitHyphenateLimitLast = "always"; // Last line can be hyphenated
      contentElem.style.webkitHyphenateLimitZone = "8%"; // Zone margin for hyphenation

      // Mozilla-specific properties for Firefox
      contentElem.style.mozHyphens = "auto"; // Enable hyphenation in Firefox
      contentElem.style.mozHyphenateLimitChars = "6 3 3"; // Min chars in word, max before/after hyphen
      contentElem.style.mozHyphenateLimitLines = "2"; // Max lines with hyphenation
      contentElem.style.mozHyphenateLimitLast = "always"; // Last line can be hyphenated
      contentElem.style.mozHyphenateLimitZone = "8%"; // Zone margin for hyphenation

      // Microsoft-specific properties for Edge
      contentElem.style.msHyphens = "auto"; // Enable hyphenation in MS browsers
      contentElem.style.msHyphenateLimitChars = "6 3 3"; // Min chars in word, max before/after hyphen
      contentElem.style.msHyphenateLimitLines = "2"; // Max lines with hyphenation
      contentElem.style.msHyphenateLimitLast = "always"; // Last line can be hyphenated
      contentElem.style.msHyphenateLimitZone = "8%"; // Zone margin for hyphenation
    } else {
      // Disable automatic hyphenation
      contentElem.style.hyphens = "none";

      // WebKit-specific properties for Safari
      contentElem.style.webkitHyphens = "none";

      // Mozilla-specific properties for Firefox
      contentElem.style.mozHyphens = "none";

      // Microsoft-specific properties for Edge
      contentElem.style.msHyphens = "none";
    }

    bodyElem.appendChild(contentElem);

    const wordCount = item.content.trim().split(/\s+/).length;
    totalWordCount += wordCount;
  });

  // Read duration:
  // Avg WPM source https://www.sciencedirect.com/science/article/abs/pii/S0749596X19300786#:~:text=Based%20on%20the%20analysis%20of,and%20260%20wpm%20for%20fiction.
  const avgWPMReading = 238;
  var totalReadDurationMinutes = Math.ceil(totalWordCount / avgWPMReading) + 1;

  const readDurationElem = document.createElement("h3");
  readDurationElem.innerHTML = `${totalReadDurationMinutes} minute read`;
  readDurationElem.style.textAlign = "center";
  console.log("Total Read Duration:", Math.ceil(totalReadDurationMinutes));

  // Horizontal line
  const hrElemTop = document.createElement("hr");
  hrElemTop.classList.add("top-hr");
  const hrElemBot = document.createElement("hr");
  hrElemBot.classList.add("bottom-hr");

  // Append elements to container
  articleContainer.appendChild(titleElem);
  articleContainer.appendChild(subtitleElem);
  if (imgElem) {
    articleContainer.appendChild(imgElem);
  }
  articleContainer.appendChild(readDurationElem);
  articleContainer.appendChild(hrElemTop);
  articleContainer.appendChild(bodyElem);
  articleContainer.appendChild(hrElemBot);
  articleContainer.appendChild(dateElem);
  document.body.appendChild(articleContainer);

  // Programmatically decide if this should be
  // in phone orientation or computer, since the
  // paragraphs can be slightly different formatted
  phone_or_pc_body(body, body_phone);

  // Re-render if neccesary on resize or orientation change.
  window.addEventListener("resize", () => {
    phone_or_pc_body(body, body_phone);
  });
  window.addEventListener("orientationchange", () => {
    phone_or_pc_body(body, body_phone);
  });
}

/**
 * Adjusts the content and styles of paragraphs based on device type (PC or phone).
 * @param {Array} body - The content and styles for paragraphs on PC.
 * @param {Array} body_phone - The content and styles for paragraphs on phone.
 */
function phone_or_pc_body(body, body_phone) {
  // PC by default
  let body_to_use = body;

  // Check if conditions for phone-like layout hold true
  let isPortrait = window.matchMedia("(orientation: portrait)").matches;
  if (window.innerWidth <= 600 || isPortrait) {
    body_to_use = body_phone;
  } else {
  }

  // Overwrite the paragraphs to the ideal body_to_use
  const paragraphs = document.querySelectorAll(".article-container p");
  paragraphs.forEach((paragraph, index) => {
    if (body_to_use[index]) {
      let item = body_to_use[index];

      // Apply styles and content from item to current paragraph
      if (paragraph.innerHTML !== item.content) {
        paragraph.innerHTML = item.content || "";
        paragraph.style.textAlign = item.textAlign || "center";
        paragraph.style.fontStyle = item.fontStyle || "normal";
      }
    } else {
      debug.log("Error: No body found");
    }
  });
}
