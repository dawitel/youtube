import s3Tos3 from "./hls/s3Tos3";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import KafkaConfig from "../../template/upload_service/kafka/kafka";

// load environment variables from dotenv
dotenv.config();

const port = process.env.TRANSCODER_SERVICE_PORT || 8081;
const app = express();
app.use(
  cors({
    allowedHeaders: ["*"],
    origin: ["*"],
  })
);

app.get("/", (req: Request, res: Response) => {
  res.send("Fullstack youtube clone transcoder service");
});

const kafkaConfiguration = new KafkaConfig();
kafkaConfiguration.consume("transcode", (value: any) => {
  console.log("✅GOT DATA FROM KAFKA: ", value);
});

app.listen(port, () => {
  console.log(`✅Server is running at http://localhost:${port}`);
});
