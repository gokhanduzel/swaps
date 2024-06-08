import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { geocodeAddress } from "../utils/geocode.js";

const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

// Get user profile
export const getUserData = async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId).select("-passwordHash"); // Exclude sensitive data
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
};

// Register User
export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, location } = req.body;
  const userExists = await User.findOne({ $or: [{ email }, { username }] });

  if (userExists) {
    if (userExists.email === email) {
      res.status(400).json({ message: "Email already in use" });
      return;
    }
    if (userExists.username === username) {
      res.status(400).json({ message: "Username already in use" });
      return;
    }
  }

  let locationData = location;
  if (!location.coordinates || location.coordinates.length === 0) {
    if (location.address) {
      locationData = await geocodeAddress(location.address);
    } else {
      res
        .status(400)
        .json({ message: "Location coordinates or address is required" });
      return;
    }
  }

  const user = await User.create({
    username,
    email,
    passwordHash: password, // This will be hashed by our model's middleware
    location: locationData,
  });

  if (user) {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 900000, // 15 minutes
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(201).json({
      user,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// Login User
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.checkPassword(password))) {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 900000, // 15 minutes
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(201).json({
      user,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// Logout User
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("accessToken", "", { maxAge: 0 }); // Clear the accessToken cookie
  res.cookie("refreshToken", "", { maxAge: 0 }); // Clear the refreshToken cookie
  res.status(204).send();
});

// Refresh Token
export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id).select("-passwordHash");

    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }

    const newAccessToken = generateAccessToken(user);
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 900000, // 15 minutes
    });
    res.status(200).json({ message: "Token refreshed", user: user });
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
});

// Check if User is Authenticated
export const checkAuth = asyncHandler(async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User is authenticated",
      user,
    });
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
});
