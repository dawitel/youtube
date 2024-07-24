import express, {Response,Request} from "express";
import uploadRouter from "./routes/upload.route";
import cors from "cors";

import dotenv from "dotenv";
import kafkaPublisherRouter from "./routes/kafkaPublisher.route";

// load environment vaariables to the service
dotenv.config();
const port = process.env.PORT || 8080;

// initialize the app
const app = express();
// configure CORS for security
app.use(
  cors({
    allowedRoutes: ["*"], // TODO: apply strict security measures
    origin: ["*"],
  })
);

// parse the data(req, res) into json globally
app.use(express.json());

// route for uploading video files with the uploadRouter handler
app.use("/upload", uploadRouter);

// route for publishing messages to kafka cluster with the kafkaPublisherRouter handler
app.use("/publish", kafkaPublisherRouter);

// accecpt get requests to the home route
app.get("/", (res: Response, req: Request) => {
  res.send("Fullstack Youtube clone ");
});

app.listen(port, () => {
  console.log("✅Server running on http://localhost:8080");
});
