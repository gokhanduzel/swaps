// src/middleware/upload.js
import multer from "multer";
import { s3Client } from "../config/awsConfig.js";
import { Upload } from "@aws-sdk/lib-storage";
import { v4 as uuidv4 } from "uuid";

// Configure multer storage to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Function to upload files to S3
const uploadToS3 = async (file) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${uuidv4()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const parallelUploads3 = new Upload({
    client: s3Client,
    params: params,
  });

  const { Location } = await parallelUploads3.done();
  return Location;
};

// Middleware to handle file uploads and attach URLs to request body
const uploadFilesMiddleware = async (req, res, next) => {
  if (!req.files) return next();

  try {
    const uploadPromises = req.files.map((file) => uploadToS3(file));
    const uploadResults = await Promise.all(uploadPromises);
    req.body.images = uploadResults; // Attach URLs to the images field in the request body
    next();
  } catch (error) {
    console.error("Error uploading files to S3", error);
    res.status(500).json({ message: "Error uploading files to S3", error: error.toString() });
  }
};

export { upload, uploadFilesMiddleware };
