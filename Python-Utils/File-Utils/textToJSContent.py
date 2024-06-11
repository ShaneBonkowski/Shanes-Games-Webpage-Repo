"""
Author: Shane Bonkowski
Date: June 10, 2024
Description: This Python script reads in a txt file and converts it into
a desired format for JS content to display in an html.
"""

import argparse
from typing import List, Dict


def format_content(file_path: str) -> List[Dict[str, str]]:
    """
    Formats the content of a text file into a list of dictionaries with headers,
    paragraphs, and lists. See cookie-policy.html or privacy-policy.html for
    examples of where this is used. Specifically the const content = [...] variable.

    The text file should have headers marked manually with <h1>, <h2>, or <h3>
    at the beginning of the line.

    Lists are indicated by lines starting with "-", which are treated as bullet
    points. This format is useful for providing content to be printed out in a
    clean way in HTML or other formats.

    Lines that do not start with these tags are considered regular paragraphs.

    Example format of the text file:
    -------------------------
    <h1>Header 1
    This is the first paragraph of text.
    It continues here.

    <h2>Header 2
    This is the second paragraph of text.

    - First bullet point
    - Second bullet point

    <h3>Header 3
    This is the third paragraph of text.
    -------------------------

    Parameters
    ----------
    file_path : str
        The path to the text file to be read and formatted.

    Returns
    -------
    List[Dict[str, str]]
        A list of dictionaries with 'type' and 'text' keys for headers, paragraphs, and lists.
    """
    with open(file_path, "r") as file:
        lines = file.readlines()

    content = []
    paragraph = []
    in_list = False
    list_items = []

    for line in lines:
        stripped_line = line.strip()

        if stripped_line.startswith("-"):
            in_list = True
            # Remove the "-" and leading/trailing spaces
            list_items.append(stripped_line[1:].strip())
            continue

        if in_list and stripped_line:
            # Continue adding list items until a non-list item is encountered
            list_items.append(stripped_line.strip())
            continue
        # End of the list
        elif in_list:
            content.append(
                {
                    "type": "list",
                    "text": list_items,
                }
            )
            list_items = []
            in_list = False

        # Non-empty line, treat as paragraph or header
        if stripped_line:
            if (
                stripped_line.startswith("<h1>")
                or stripped_line.startswith("<h2>")
                or stripped_line.startswith("<h3>")
            ):
                header_type = (
                    "h1"
                    if stripped_line.startswith("<h1>")
                    else "h2" if stripped_line.startswith("<h2>") else "h3"
                )
                # Remove <h1>, <h2>, or <h3>
                header = stripped_line[4:]
                content.append(
                    {
                        "type": header_type,
                        "text": header,
                    }
                )
            # Regular paragraph
            else:
                paragraph.append(stripped_line)
        # Completely blank line, treat as a new paragraph
        else:
            if paragraph:
                content.append(
                    {
                        "type": "paragraph",
                        "text": "\n".join(paragraph),
                    }
                )
                paragraph = []

    # Append the last paragraph if it exists
    if paragraph:
        content.append(
            {
                "type": "paragraph",
                "text": "\n".join(paragraph),
            }
        )

    return content


def generate_js_content(content: List[Dict[str, str]]) -> str:
    """
    Generates JavaScript content from a list of dictionaries.

    Parameters
    ----------
    content : List[Dict[str, str]]
        A list of dictionaries with 'type' and 'text' keys for headers, paragraphs, and lists.

    Returns
    -------
    str
        A string representing the JavaScript content.
    """
    js_content = "const content = [\n"
    for item in content:
        if item["type"] == "list":
            js_content += f'  {{\n    type: "{item["type"]}",\n    items: [\n'
            for list_item in item["text"]:
                js_content += f'      "{list_item}",\n'
            js_content += "    ]\n  },\n"
        else:
            js_content += f'  {{\n    type: "{item["type"]}",\n    text: "{item["text"]}",\n  }},\n'
    js_content += "];"
    return js_content


def main():
    """
    Main function to parse arguments and generate JavaScript
    content from a text file.
    """
    parser = argparse.ArgumentParser(
        description="Format a text file into JavaScript content.",
    )
    parser.add_argument(
        "file_path",
        type=str,
        help="The path to the text file to be formatted.",
    )
    args = parser.parse_args()

    content = format_content(args.file_path)
    js_content = generate_js_content(content)

    # Print the generated JavaScript content
    print(js_content)


if __name__ == "__main__":
    main()
