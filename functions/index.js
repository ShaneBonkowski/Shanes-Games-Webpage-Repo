const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

admin.initializeApp();
const firestore = admin.firestore();

const app = express();
app.use(cors());

/**
 * Retrieves the Google Analytics Measurement ID from Firestore.
 *
 * @return {Promise<string>} A Promise that resolves to the Measurement ID.
 */
async function getAnalyticsMeasurementIdFromFirestore() {
  try {
    const snapshot = await firestore
        .collection("keys")
        .doc("google_analytics")
        .get();
    return snapshot.data().measurement_id;
  } catch (error) {
    console.error("Error retrieving Measurement ID:", error);
    throw error;
  }
}

/**
 * Cloud Function to retrieve the Google Analytics Measurement ID.
 *
 * @param {import('firebase-functions').https.Request} req
 * The HTTP request object.
 * @param {import('firebase-functions').https.Response} res
 * The HTTP response object.
 */
app.get("/getAnalyticsMeasurementId", async (req, res) => {
  try {
    const measurementId = await getAnalyticsMeasurementIdFromFirestore();

    // Return the Measurement ID in the response
    res.status(200).send(measurementId);
  } catch (error) {
    res.status(500).send("Error retrieving Measurement ID");
  }
});

exports.getAnalyticsMeasurementId = functions.https.onRequest(app);
