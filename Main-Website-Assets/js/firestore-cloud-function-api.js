/**
 * Fetches the Google Analytics Measurement ID from the cloud function.
 *
 * @returns {Promise<string|null>} A promise that resolves with the Measurement ID if fetched successfully, or null if there was an error.
 */
export async function getAnalyticsMeasurementId() {
  try {
    const response = await fetch(
      "https://us-central1-black-hole-reject.cloudfunctions.net/getAnalyticsMeasurementIdFromFirestore"
    );
    if (response.ok) {
      const measurementId = await response.text();
      console.log("Google Analytics Measurement ID found");
      return measurementId;
    } else {
      console.error("Failed to fetch Measurement ID:", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error fetching Measurement ID:", error);
    return null;
  }
}
