"""
Author: Shane Bonkowski
Date: June 8, 2024
Description: This Python script resizes a provided png file.
"""

import os
from PIL import Image
import argparse
from typing import Optional


def resize_png(
    png_filepath: str,
    x: int,
    y: int,
) -> None:
    """
    Resizes png to desired x and y size.

    Parameters
    ----------
    png_filepath : str
        The path to the png file to be resized.
    x : int
        The width to resize the images to.
    y : int
        The height to resize the images to.

    Returns
    -------
    None
    """

    if not os.path.isfile(png_filepath):
        print(
            f"The provided png '{png_filepath}' is not a valid file "
            "(likely wrong filepath)."
        )
        return

    with Image.open(png_filepath) as img:

        # Resize the image to the desired size
        x_orig, y_orig = img.size
        img = img.resize((x, y))
        img.save(png_filepath, "png")
        print(f"Converted {png_filepath} from size ({x_orig}, {y_orig}) to ({x}, {y})")


def main() -> None:
    """
    Parses command line arguments and calls the resize_png function.

    Parameters
    ----------
    None

    Returns
    -------
    None
    """
    parser = argparse.ArgumentParser(description="Resize PNG files.")
    parser.add_argument(
        "png_filepath", type=str, help="Path to the png file to be resized."
    )
    parser.add_argument(
        "--width",
        type=int,
        help="Width to resize images to.",
    )
    parser.add_argument(
        "--height",
        type=int,
        help="Height to resize images to.",
    )

    args = parser.parse_args()
    resize_png(args.png_filepath, args.width, args.height)


if __name__ == "__main__":
    main()
