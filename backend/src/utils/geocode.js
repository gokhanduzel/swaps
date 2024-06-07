import axios from "axios";

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export const geocodeAddress = async (address) => {
  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address,
          key: API_KEY,
        },
      }
    );

    if (response.data.status === "OK") {
      const location = response.data.results[0].geometry.location;
      return {
        coordinates: [location.lng, location.lat],
        address: response.data.results[0].formatted_address,
      };
    } else {
      throw new Error("Unable to geocode address");
    }
  } catch (error) {
    console.error("Geocoding error:", error);
    throw error;
  }
};

export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          latlng: `${lat},${lng}`,
          key: API_KEY,
        },
      }
    );

    if (response.data.status === "OK" && response.data.results.length > 0) {
      return response.data.results[0].formatted_address;
    } else {
      throw new Error("Unable to reverse geocode coordinates");
    }
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    throw error;
  }
};
