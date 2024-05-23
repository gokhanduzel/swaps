import mongoose from "mongoose";
import dotenv from "dotenv";

// dotenv to read environment variables
dotenv.config();

// Connect to the database
const connectDB = async () => {
  try {

    // Database URI imported from env variables
    const dbURI = process.env.MONGO_URI;

    // Establishing the database connection
    const conn = await mongoose.connect(dbURI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

// Function to close the database connection
const closeDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("MongoDB Disconnected");
  } catch (error) {
    console.error(`Error disconnecting from MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Exporting the connect and close functions
export { connectDB, closeDB };
