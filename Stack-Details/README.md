# Shane's Games Stack

## Domain Management: [Squarespace](https://account.squarespace.com/)

- Managing domain settings such as DNS records and SSL certificates.

## Web Hosting: [Firebase](https://console.firebase.google.com/)

- Shane's Games is linked to the `black hole reject` Firebase project.
- Allows for hosting of custom HTML, CSS, and JavaScript files.
- Future ease of integration with databases, ads, transactions, etc.
- `firebase.json` specifies the `deploy` folder as the one that Google Firebase uses to get the website assets. This folder is created during the GitHub Actions workflow that builds and deploys the website. This is so that additional steps can be taken to clean up files prior to sending them off to Google Firebase. More information can be found in the `.github/workflows/README.md` file.

## Backend:
### Database: [Firestore Database](https://firebase.google.com/docs/firestore)
Useful database, mostly used for storing API keys etc. that are useful to keep private and be able to access via Firebase Cloud Functions.
### Server-interaction: [Firebase Cloud Functions](https://firebase.google.com/docs/functions)
More information on this can be found in `functions/README.md`.

## Analytics: [Google Analytics](https://analytics.google.com/)

- Website traffic, user behavior, and performance metrics.

## Front End: JavaScript, HTML, CSS

- Website employs fully custom code written in JavaScript, HTML, and CSS.

## Deployment Automation: GitHub Actions

- GitHub Actions automatically builds and deploys the website whenever changes are merged into the main branch.
- GitHub secrets are leveraged during building in order to inject API keys etc. into the files for things such as Google Analytics to be turned on without users having access to the API keys.
- [Google Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts) are utilized so that GitHub Actions can authenticate into Firebase etc.
