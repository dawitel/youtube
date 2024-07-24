import express from "express";
import watchVideo from "../controllers/watch.controller";
import getAllVideos from "../controllers/home.controller";
import getRecommendations from "../recommendation engine/recommendation.engine"
const router = express.Router();

// route for handling requests to watch video
router.get("/", watchVideo);

// route for filtering and suggesting videos using the recommendation engine
router.get('/recommendations', getRecommendations)
// route for handling the requests to the home page
router.get("/home", getAllVideos);

export default router;
