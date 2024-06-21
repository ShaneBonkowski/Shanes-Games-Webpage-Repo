/**
 * Creates an article with specified title, subtitle, date, and body content.
 * Each paragraph in the body can have its own textAlign style.
 *
 * @param {string} title - The title of the article.
 * @param {string} subtitle - The subtitle of the article.
 * @param {string} date - The date of the article.
 * @param {Array} body - An array of objects where each object contains 'content' (string) and optional 'textAlign' and 'fontStyle' (string).
 */
export function createArticle(title, subtitle, date, body) {
  // Clear previous content
  const articleContainer = document.createElement("div");
  articleContainer.classList.add("article-container");

  // Create and style elements for title, subtitle, and date
  const titleElem = document.createElement("h1");
  titleElem.innerHTML = title;

  const subtitleElem = document.createElement("h2");
  subtitleElem.innerHTML = subtitle;

  const dateElem = document.createElement("h3");
  dateElem.innerHTML = date;

  const bodyElem = document.createElement("div");

  // Iterate over each item in the body list
  body.forEach((item) => {
    const contentElem = document.createElement("p");
    // Preserve whitespace and newlines using <pre>
    contentElem.innerHTML = item.content;
    contentElem.style.textAlign = item.textAlign || "center"; // Use defaultTextAlign of center if none provided
    contentElem.style.fontStyle = item.fontStyle || "normal";
    bodyElem.appendChild(contentElem);
  });

  // Append elements to container
  articleContainer.appendChild(titleElem);
  articleContainer.appendChild(subtitleElem);
  articleContainer.appendChild(bodyElem);
  articleContainer.appendChild(dateElem);
  document.body.appendChild(articleContainer);
}
