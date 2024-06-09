"""
Author: Shane Bonkowski
Date: June 9, 2024
Description: This Python script minify's all css files in the repo
so that they are smaller.
"""

import os
from csscompressor import compress


def minify_css_file(file_path: str) -> None:
    """
    This Python script minify's all css files in the repo in place
    so that they are smaller. Warning, this will make them virtually
    unreadable, so this utility is better off used only in the GitHub
    Action that calls it. This is to ensure that the original css files
    themselves will still be viewable and editable in GitHub etc. Basically
    want it so that only the ones that get sent during the build are changed.

    Parameters
    ----------
    file_path:
        The path to the CSS file.

    Returns
    ----------
        None
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File '{file_path}' not found")

    original_size = os.path.getsize(file_path)

    with open(file_path, "r") as file:
        css_content = file.read()

    minified_css = compress(css_content)

    with open(file_path, "w") as file:
        file.write(minified_css)

    minified_size = os.path.getsize(file_path)
    reduction_percentage = ((original_size - minified_size) / original_size) * 100
    print(f"CSS file minified: {file_path}")
    print(f"Original size: {original_size} bytes")
    print(f"Minified size: {minified_size} bytes")
    print(f"Reduction: {reduction_percentage:.2f}%")


def minify_css_in_repo(root_dir: str) -> None:
    """
    Minify CSS files in a repository recursively.

    Parameters
    ----------
    root_dir:
        The root directory of the repository.

    Returns
    ----------
        None
    """

    for root, dirs, files in os.walk(root_dir):
        for file_name in files:
            if file_name.endswith(".css"):
                file_path = os.path.join(root, file_name)
                minify_css_file(file_path)


if __name__ == "__main__":
    repo_path = "../../"
    minify_css_in_repo(repo_path)
