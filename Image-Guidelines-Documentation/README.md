## A primer on Image Sizing

An important consideration for optimizing speed and download sizes on a website is the size of images. With my workflow, I typically create an image asset of a certain size as a png file, and then downsize and convert that image to the webp format in order to compress it to a smaller file size. The decision on lossy vs. lossless compression depends on use case and how nice the image needs to look. Typically images that are already fairly small on a website can be converted in a lossy way, which results in smaller file sizes.

## Why Use WebP:

### Compression Efficiency:

WebP offers great compression efficiency, resulting in smaller file sizes without significant loss in image quality.

### Transparency Support:

Unlike JPEG, WebP supports transparency, allowing for images with smooth edges and transparent backgrounds!

### Animation:

WebP supports animated images through the WebP Animation format (WebPAN), providing a more efficient alternative to GIF animations with better compression and quality.

### Lossy and Lossless Compression:

WebP supports both lossy and lossless compression modes!

## Workflow

- Use `/Python-Utils/Image-Utils/resize-png.py` to shrink images to a smaller width and/or height. Follow the guidelines detailed in `/games` for more discretion on how large images are expected to be for cover images, logos, etc.
- Use `/Python-Utils/Image-Utils/png-to-webp.py` to convert an entire folder's worth of pngs into a brand new folder of webp's. This also works for single png files.
- <b>NOTE:</b> all references to images in the code should be to the `webps` folder! This is because while it is standard practice to leave the `pngs` folder in the code so that someone can still reference the original un-compressed source image, during the build process all `pngs` get ignored so that the actual build of the website does not include them!
