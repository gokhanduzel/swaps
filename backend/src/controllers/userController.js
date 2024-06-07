import User from "../models/UserModel.js";
import { geocodeAddress, reverseGeocode } from "../utils/geocode.js";

// Get user profile
export const getUserProfile = async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId).select("-passwordHash"); // Exclude sensitive data
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
};

export const updateUserProfile = async (req, res) => {
  const userId = req.params.userId;
  const { username, email, location } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = username || user.username;
    user.email = email || user.email;

    if (location) {
      let locationData = location;

      if (!location.coordinates || location.coordinates.length === 0) {
        if (location.address) {
          locationData = await geocodeAddress(location.address);
        } else {
          return res
            .status(400)
            .json({ message: "Location coordinates or address is required" });
        }
      }

      user.location = {
        type: "Point",
        coordinates: locationData.coordinates || location.coordinates,
        address: locationData.address || location.address,
      };
    }

    await user.save();
    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete user profile
export const deleteUserProfile = async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({ message: "User deleted successfully" });
};

// Reverse geocode endpoint
export const reverseGeocodeController = async (req, res) => {
  const { lat, lng } = req.body;
  if (lat === undefined || lng === undefined) {
    return res
      .status(400)
      .json({ message: "Latitude and longitude are required" });
  }
  try {
    const address = await reverseGeocode(lat, lng);
    res.json({ address });
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    res.status(500).json({ message: "Unable to reverse geocode coordinates" });
  }
};
