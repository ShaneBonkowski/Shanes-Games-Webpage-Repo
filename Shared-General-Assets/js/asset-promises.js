// Promisified method for loading in an image. This allows us to wait for
// completion of image being loaded in befirte continuing with the next line of code.
export function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      resolve(image);
    };
    image.onerror = () => {
      reject(new Error(`Failed to load image: ${url}`));
    };
    image.src = url;
  });
}
