# Shane's Games Stack

## Domain Management: [Squarespace](https://account.squarespace.com/)

- Managing domain settings such as DNS records and SSL certificates.

## Web Hosting: [Firebase](https://console.firebase.google.com/)

- Static hosting of custom HTML, CSS, and JavaScript files.
- Future ease of integration with databases, ads, transactions, etc.
- Shane's Games is linked to the `black hole reject` Firebase project.

## Analytics: [Google Analytics](https://analytics.google.com/)

- Website traffic, user behavior, and performance metrics.

## Front End: JavaScript, HTML, CSS

- Website employs fully custom code written in JavaScript, HTML, and CSS.

## Deployment Automation: GitHub Actions

- GitHub Actions automatically builds and deploys the website whenever changes are merged into the main branch.
- GitHub secrets are leveraged during building in order to inject API keys etc. into the files for things such as Google Analytics to be turned on without users having access to the API keys.
- [Google Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts) are utilized so that GitHub Actions can authenticate into Firebase etc.
