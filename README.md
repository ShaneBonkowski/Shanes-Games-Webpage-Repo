# Shane's Games

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

## Style Guidelines

### Python
#### Formatting
For Python, the `black` formatter is used in order to enforce PEP-8 formatting. 

### JavaScript, html, css
#### Formatting
For JavaScript, html, and css the `Prettier - Code Formatter` is used.

### Setting up VisualStudio (VSCode) to auto-format
- Download `prettier` and `black` formatter extensions in VSCode. Be sure to select the verified extensions from the trusted sources (`Prettier` and `Microsoft` respectively)!
- Go into `Settings` and at the top search bar type `@lang:{language name} Default Formatter` for each language mentioned above. e.g. `@lang:html Default Formatter`, `@lang:JavaScript Default Formatter, etc.
- For each language, specify the correct formatter as the default. This means `black` for Python, and `Prettier` for JavaScript, html, and css!
