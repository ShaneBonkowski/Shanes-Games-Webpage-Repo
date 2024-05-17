# Setting Up Firebase Cloud Functions

Firebase Cloud Functions offer a serverless solution for executing backend code. They run in response to events triggered by Firebase services or HTTP requests. This approach is very useful as well for interacting with things such as the Firestore Database, in order to for example use and store API keys in a safe way.

## Setup:

A one time setup step that has already been completed in this project is to call the following from the CLI `firebase init functions`. This will add the `functions` folder to a repository full of useful functions and dependencies to reference when working with Firebase Cloud Functions.

## Step 0: Optional Prerequisites

Store any required API keys / required variables in the Firestore Database if they both:

1. Need to be private
2. May be useful to have access to in the server frontend

Ensure that only authenticated users (including the Cloud Function) have access to this data.

## Step 1: Write Cloud Function

Create a Firebase Cloud Function to complete the desired task. Cloud functions can be written in the `functions/index.js` file or other files if preferred.

## Step 2: Deployment

### Method 1: Automated

Merge into the `main` branch and let the custom GitHub Actions .yml file deploy the Firebase Cloud Function to the Firebase app.

### Method 2: Manual

Deploy the Firebase Cloud Function to your Firebase app from the CLI:

```bash
firebase deploy --only functions
```

## Step 3: Client-side Integration

Create a JavaScript function that calls upon the cloud function created, or kicks off an event that the cloud function is listening to. This is how you can use and interact with the cloud functions from the frontend code! A good example is the following function which calls a `getAnalyticsApiKey` cloud function to grab the Google Analytics API key stored on the Firestore Database.

```
async function getAnalyticsApiKey() {
    try {
        const response = await fetch('https://us-central1-your-project-id.cloudfunctions.net/getAnalyticsApiKey');
        if (response.ok) {
            const apiKey = await response.text();
            console.log('Google Analytics API Key:', apiKey);
        } else {
            console.error('Failed to fetch API key:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching API key:', error);
    }
}

// Call the function to get the API key
getAnalyticsApiKey();
```

## Final Step: Testing

Before deployment, Cloud Functions can be tested locally using the Firebase Emulator Suite. Refer to the Firebase documentation for more details: [Firebase Emulator Suite Documentation](https://firebase.google.com/docs/emulator-suite)
