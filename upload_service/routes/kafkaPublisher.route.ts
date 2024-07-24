import express from "express";
import sendMessageToKafka from "../controllers/kafkapublisher.controller";

const router = express.Router();

// route to post messages to kafka
router.post("/", sendMessageToKafka);

export default router;
