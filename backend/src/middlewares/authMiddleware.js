import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import asyncHandler from "express-async-handler";

export const authenticate = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = await User.findById(decoded.id).select("-passwordHash");
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ message: "Token invalid or expired" });
  }
});
