"""
Author: Shane Bonkowski
Date: June 8, 2024
Description: This Python script converts PNG files OR a single png file 
in a given folder to WebP format, and saves them in a new `webps` folder.
"""

import os
from PIL import Image
import argparse
from typing import Optional


def convert_png_to_webp(
    png_folder_or_file: str,
    lossless: bool = False,
    force: bool = False,
) -> None:
    """
    Converts PNG files in a given folder to WebP format, and
    saves them in a new `webps` folder.

    Parameters
    ----------
    png_folder_or_file : str
        The path to the folder containing PNG files to be converted
        OR just to a single png file!
    lossless : bool, optional
        Whether to use lossless compression, by default False (lossy compression).
    force : bool
        Whether to force overwrite an existing webp file if it exists, False by default.

    Returns
    -------
    None
    """

    if not os.path.isdir(png_folder_or_file) and not os.path.isfile(png_folder_or_file):
        print(
            f"The provided path '{png_folder_or_file}' is not a valid directory or file."
        )
        return

    # Create the webps folder
    if os.path.isdir(png_folder_or_file):
        webp_folder = os.path.join(png_folder_or_file, "../webps")
    elif os.path.isfile(png_folder_or_file):
        webp_folder = os.path.join(png_folder_or_file, "../../webps")
    os.makedirs(webp_folder, exist_ok=True)

    # Iterate over all files in the png_folder_or_file, and convert them
    # and store them in /webps
    if os.path.isdir(png_folder_or_file):
        for filename in os.listdir(png_folder_or_file):
            png_path = os.path.join(png_folder_or_file, filename)
            convert_single_png_to_webp(png_path, webp_folder, lossless, force)
    # If a single png is provided, just convert that!
    elif os.path.isfile(png_folder_or_file):
        png_path = png_folder_or_file
        convert_single_png_to_webp(png_path, webp_folder, lossless, force)


def convert_single_png_to_webp(
    png_path: str, webp_folder: str, lossless: bool, force: bool
):
    """
    Converts a single PNG file to WebP format and saves it in the specified webp_folder.

    Parameters
    ----------
    png_path : str
        The path to the single PNG file.
    webp_folder : str
        The path to the folder where the converted WebP file will be saved.
    lossless : bool
        Whether to use lossless compression (True) or lossy compression (False).
    force : bool
        Whether to force overwrite an existing webp file if it exists.

    Returns
    -------
    None
    """
    if png_path.lower().endswith(".png"):

        # Check if WebP file already exists, and dont upload if it does!
        # Unless if force == true
        filename = os.path.basename(png_path)
        filename_no_extension = os.path.splitext(filename)[0]
        webp_filename = f"{filename_no_extension}.webp"
        webp_path = os.path.join(webp_folder, webp_filename)
        if os.path.isfile(webp_path) and not force:
            print(f"WebP file for {filename} already exists. Skipping conversion.")
            return

        with Image.open(png_path) as img:

            # Save the image as WebP
            img.save(webp_path, "WEBP", quality=100 if lossless else 80)

            # Calculate reduction in file size
            png_size = os.path.getsize(png_path)
            webp_size = os.path.getsize(webp_path)
            reduction_percent = ((png_size - webp_size) / png_size) * 100

            print(f"Converted {filename} to {webp_filename}")
            print(
                f"Original size: {png_size} bytes, New size: {webp_size} bytes, Reduction: {reduction_percent:.2f}%"
            )


def main() -> None:
    """
    Parses command line arguments and calls the convert function.

    Parameters
    ----------
    None

    Returns
    -------
    None
    """
    parser = argparse.ArgumentParser(description="Convert PNG files to WebP format.")
    parser.add_argument(
        "png_folder_or_file",
        type=str,
        help="Path to the folder containing PNG files OR to a single png file.",
    )
    parser.add_argument(
        "--lossless",
        action="store_true",
        help="If provided, use lossless compression instead of lossy compression.",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="If provided, force overwrite existing webp files if one already exists.",
    )

    args = parser.parse_args()

    if args.force:
        confirmation = input(
            "Are you sure you want to overwrite existing WebP files? Be careful, "
            "because some images such as games/Flip-Tile-Game/pngs/Background.png "
            "are supposed to be lossless, and this tool by default makes images "
            "lossy compression. Only proceed if you know what you are doing! "
            "If you are not careful, you can degrade quality of images that are supposed "
            "to be lossy, while others are supposed to be lossless. If doing --force, "
            "it is reccomended to provide a single file instead of the entire folder to "
            "avoid accidental overwrites of images that need a specific configuration. "
            "Type (yes/no) to proceed: "
        )
        if confirmation.lower() != "yes":
            print("Conversion aborted.")
            return

    convert_png_to_webp(args.png_folder_or_file, args.lossless, args.force)


if __name__ == "__main__":
    main()
