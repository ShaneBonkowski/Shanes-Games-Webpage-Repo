# Shane's Games
<B>DEPRECATED:</B> moved to [shane-bonkowski-dot-com](https://github.com/ShaneBonkowski/shane-bonkowski-dot-com).

Welcome to Shane's Games! This repository contains the source code for Shane's Games website and most of the games featured on the platform.

## About Shane's Games

Shane's Games is a collection of small browser games and projects created by Shane Bonkowski. The goal of this project is to provide a platform for sharing and playing __free__ fun games while also promoting collaboration and open-source contributions.

## Repository Structure

- `Main-Website-Assets`, `index.html`, and `about.html`: Contain the source code for Shane's Games main website.
- `games`: Contains the source code for all the games featured on Shane's Games.
- `Shared-General-Assets`: Helper functions and assets accessed by the games and the main website.

## Contributing

I welcome contributions from the community to improve and expand Shane's Games. If you have ideas, suggestions, or bug reports, please feel free to open an issue ticket. Additionally, I encourage pull requests for new features, bug fixes, and enhancements.

To contribute:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with clear, descriptive messages.
4. Push your changes to your fork.
5. Submit a pull request to the main repository's `main` branch.

## Open Source Philosophy

I believe in the power of open source and collaboration. All games featured on the platform are open source, allowing anyone to modify, enhance, and contribute to the codebase. I encourage developers of all skill levels to get involved.

## General Style Guidelines
All code should be formatted according to the formatter / formatting guidelines described below for a given language. For documentation, please document all functions and files within reason! It not only is great for crediting yourself as an author of any files or functions you have created, but also makes it much easier for others to build upon your work in the future.

### Python
#### Formatting
For Python, the `black` formatter is used in order to enforce [PEP-8](https://peps.python.org/pep-0008/) formatting. 

#### Documentation
For Python, the documentation style from [Numpy](https://numpydoc.readthedocs.io/en/latest/format.html) is used. In addition, type hints from the `typing` library are used. It looks as follows:
```python
def add(number1: int, number2: int) -> int:
    """
    This function adds two numbers together.

    Parameters
    ----------
    number1 : type
        Description of number1.
    number2 : type
        Description of number2.

    Returns
    -------
    int
        The sum of number1 and number2.
    """
    
    return number1 + number2

```

### JavaScript, html, css
#### Formatting
For JavaScript, html, and css the `Prettier - Code Formatter` is used.

#### Documentation
For JavaScript, the documentation style [JSDoc](https://github.com/shri/JSDoc-Style-Guide) is used. It looks as follows:
```javascript
/**
 * Calculates the sum of two numbers.
 * 
 * @param {number} num1 - The first number.
 * @param {number} num2 - The second number.
 * @returns {number} The sum of num1 and num2.
 */
function calculateSum(num1, num2) {
    return num1 + num2;
}

```

### Setting up VisualStudio (VSCode) to auto-format
- Download `prettier` and `black` formatter extensions in VSCode. Be sure to select the verified extensions from the trusted sources (`Prettier` and `Microsoft` respectively)!
- Go into `Settings` and at the top search bar type `@lang:{language name} Default Formatter` for each language mentioned above. e.g. `@lang:html Default Formatter`, `@lang:JavaScript Default Formatter`, etc.
- For each language, specify the correct formatter as the default. This means `black` for Python, and `Prettier` for JavaScript, html, and css.
- You can even configure it in the settings so that it automatically formats every time you save the file!
