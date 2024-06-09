"""
Author: Shane Bonkowski
Date: June 9, 2024
Description: This Python script minifies all JavaScript files in the repo
so that they are smaller.
"""

import os
from jsmin import jsmin


def minify_js_file(file_path: str) -> None:
    """
    Minify a JavaScript file in place.

    Parameters
    ----------
    file_path : str
        The path to the JavaScript file.

    Returns
    -------
    None
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File '{file_path}' not found")

    original_size = os.path.getsize(file_path)

    with open(file_path, "r") as file:
        js_content = file.read()

    minified_js = jsmin(js_content)

    with open(file_path, "w") as file:
        file.write(minified_js)

    minified_size = os.path.getsize(file_path)
    reduction_percentage = ((original_size - minified_size) / original_size) * 100
    print(f"JavaScript file minified: {file_path}")
    print(f"Original size: {original_size} bytes")
    print(f"Minified size: {minified_size} bytes")
    print(f"Reduction: {reduction_percentage:.2f}%")


def minify_js_in_repo(root_dir: str) -> None:
    """
    Minify JavaScript files in a repository recursively.

    Parameters
    ----------
    root_dir : str
        The root directory of the repository.

    Returns
    -------
    None
    """

    for root, dirs, files in os.walk(root_dir):
        for file_name in files:
            if file_name.endswith(".js"):
                file_path = os.path.join(root, file_name)
                minify_js_file(file_path)


if __name__ == "__main__":
    repo_path = "../../"
    minify_js_in_repo(repo_path)
