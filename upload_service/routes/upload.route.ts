import express from "express";
import multer from "multer"; // handle file uploads
import {
  initializeUpload,
  uploadChunck,
  completeUpload,
  uploadToDB,
} from "../controllers/multipartupload.controller.ts";

const upload = multer();

// define the router
const router = express.Router();

// Route to handle initialization of uploads to S3
router.post("/initialize", upload.none(), initializeUpload);

// Route to handle uploading individual chunks
router.post("/", upload.single("chunck"), uploadChunck);

// Route to handle completion of Uploading chunks
router.post("/complete", completeUpload);

// Route to handle uploading video Meta Data to postgres
router.post("/uploadToDb", uploadToDB);

export default  router