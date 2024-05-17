# API Keys Documentation

This document outlines the websites where API keys are utilized and where they are stored for reference. For reference, a lot of these API's rely on one another and interact with eachother in complex ways. See the `.github/workflows/README.md` for more details on how many of the API's are used during the build and deploy process. Also see the `functions/README.md` for detail on how some API's are accessed by JavaScript functions in order to do things like turn on/off Google Analytics during runtime. Note also that `Stack-Details/README.md` touches on how Google Service Accounts are used for the authentication for GitHub Actions to access for example Firebase.

## Google Analytics API

- **Where to Find API**: Google Cloud > Google Cloud Console > APIs & Services > Credentials
- **Where to Find Property ID**: Google Analytics > Admin > Property > Property Settings > Property ID
- **Storage Location**: GitHub Secrets for deployment, Firebase Firestore database for runtime access

## GitHub API

- **Where to Find**: GitHub Developer Settings > Personal Access Tokens
- **Storage Location**: Stored in Google Service Accounts for secure access

## Firebase API

- **Where to Find**: Firebase Console > Project Settings > Service Accounts
- **Storage Location**: Stored in Google Service Accounts for secure access

## Google Service Accounts

- **Where to Find**: Google Cloud Console > IAM & Admin > Service Accounts
- **Storage Location**: GitHub Secrets for deployment
