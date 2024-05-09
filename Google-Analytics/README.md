# Website Analytics Tracking

This repository utilizes Google Analytics to track website analytics.

## Google Analytics

Analytics for this website are tracked using [Google Analytics](https://analytics.google.com/).

## Tracking Key

The Google Analytics tracking key is stored securely in the repository's secret variables on GitHub. For security reasons, this key is not directly visible in the repository files.

## Integration with HTML Pages

To ensure that analytics are tracked on all HTML pages, the Google Analytics tracking code is added to each HTML page during the build process. As more HTML pages are added to the website, the GitHub Actions workflow YAML file will need to be updated in order to include the tracking code for those pages as well. Ideally this can be automated to apply to all html files
