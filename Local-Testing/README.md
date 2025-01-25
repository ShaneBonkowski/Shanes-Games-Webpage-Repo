# Local Testing Server for Shane's Games

The JavaScript file `local-test-server.js` creates a local test server that allows you to preview changes to the website code etc. in your browser before deploying them live. Follow the instructions below to set up and run the local test server.

## Prerequisites

- Node.js installed on your system. You can download and install Node.js from [here](https://nodejs.org/).

## Getting Started

1. Clone or download the Shane's Games repository to your local machine.

2. Navigate to the main repository directory in your terminal/command prompt (i.e. `cd /path/to/ShanesGames`).

3. Run the following command to start the local test server:

```bash
node .\Local-Testing\local-test-server.js
```

OR (because I have defined it in package.json), call:

```bash
npm start
```

4. Once the server is running, you should see a message indicating that the server is live and listening on a specific port. The default port is `3000`.

5. Open a web browser and go to the following URL:

```
http://localhost:3000/
```

6. You should now be able to view the website hosted by the local test server. Any changes you make to the files in the Shane's Games repository will be reflected immediately when you refresh the page in your browser.

## Notes

- If you encounter any issues while running the server or accessing the website, double-check that Node.js is installed correctly and that you are in the correct directory.
- Remember to stop the server when you're done testing by pressing `Ctrl + C` in the terminal/command prompt where the server is running.
