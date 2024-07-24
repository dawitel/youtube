import { config } from "dotenv";
import AWS from "aws-sdk";
import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";

ffmpeg.setFfmpegPath(ffmpegStatic);

// load the environment variales
config();

// configure S3 and AWS
const S3 = new AWS({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCEESS_KEY,
  region: "us-east-1",
});

// configure the bucket
const mp4Fileame = "test-content/video.mp4";
const bucketName = process.env.AWS_BUCKET;
const hlsFolder = "hls";

/**
 * @param null
 * @description fuction to dowload, transcode, and upload files to S3
 * @returns null
 */
const s3Tos3 = async () => {
  console.log("✅SCRIPT_RUNNING...");
  console.time("req_time");

  try {
    // TODO: 1. implement a way to dowload files from S3
    console.log("✅Downloading files locally...");
    const mp4FilePath = `${mp4Fileame}`;
    const writeStream = fs.createWriteStream("local.mp4");
    const readStream = S3.getObject({
      Bucket: bucketName,
      key: mp4FilePath,
    }).createReadStream();
    readStream.pipe(writeStream);

    await new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    console.log("✅Downloaded files locally");

    // 2. Send the locally downloaded files to the trascoder
    const resolutions = [
      {
        resolution: "320x180",
        videoBitRate: "500k",
        audioBitRate: "64k",
      },
      {
        resolution: "854x480",
        videoBitRate: "1000k",
        audioBitRate: "128k",
      },
      {
        resolution: "1280x720",
        videoBitRate: "2500k",
        audioBitRate: "192k",
      },
    ];
    const variantPlaylists = [];
    for (const { audioBitRate, resolution, videoBitRate } of resolutions) {
      console.log(`✔HLS conversion started for resolution: ${resolution}`);
    }
    // 3. Upload the trasocded files and delete the local files
    // Delete locally generated files
    console.log("✔ Deleting locally stored files...");
    fs.unlinkSync("local.mp4");
    console.log("✔ Deleted locally stored files");
    // upload the files back to S3

  } catch (error) {
    console.error("🔴 ERROR: ", error);
  }
};

export default s3Tos3;
