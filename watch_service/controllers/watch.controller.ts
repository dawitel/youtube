import { Response, Request } from "express";
import AWS from "aws-sdk";

/**
 * @description handler for geting the signed URl of a video in S3
 * @param videokey: string
 * @returns Promise of signed video URL
 */
const getSignedUrl = async (videokey: string) => {
  // configure S3 and AWS
  const S3 = new AWS({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: "ap-south-1",
  });

  // parameter for getting the signed URL
  const params = {
    Bucket: process.env.AWS_BUCKET,
    key: videokey,
    Expires: 3600, // Expires in one Hour
  };

  // create a promise object to get the signed URL and resolve or reject the errors
  return new Promise((resolve: any, reject: any) => {
    S3.getSignedUrl("getObject", params, (err: any, url: any) => {
      if (err) reject(err);
      else resolve(url);
    });
  });
};

/**
 * @description handler for the watch video route
 * @param req: express Request
 * @param res: express Response
 * @requires getSignedUrl
 * @returns Signed video URl
 */
const watchVideo = async (req: Request, res: Response) => {
  try {
    // get the video Key from the query params
    const videokey = req.query.key;
    console.log("✅VIDEO_KEY: ", videokey);

    // sign the video key into URL and return it
    const signedUrl = await getSignedUrl(videokey);
    res.json({ signedUrl });
  } catch (error) {
    console.log("🔴ERROR GETTING REQUESTED VIDEO: ", error);
    res.status("500").json({ error: "Internal Server Error" });
  }
};

export default watchVideo;
