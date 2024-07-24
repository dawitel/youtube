import AWS from "aws-sdk";
import { addVideoDetailsToDB } from "../db/db.ts";
import { Response, Request } from "express";

type globalParams = {
  req: Request,
  res: Response
}

// Initialize file uploads from the client
export const initializeUpload = async ({res, req}: globalParams) => {
  try {
    console.log("✅Initializing file Upload...");
    const { fileName } = req.body;
    console.log("FILE_NAME: ", fileName);

    // configure AWS and S3
    const S3 = new AWS({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: "ap-south-1",
    });

    // get the bucket name
    const bucketName = process.env.AWS_BUCKET;

    // parameter configuration for AWS createMultiPartUpload
    const params = {
      Bucket: bucketName,
      key: fileName,
      ContentType: "video/mp4",
    };

    //  initialize the multipart upload for the chuncks and get the uploadId
    const multipartParams = await S3.createMultiPartUpload(params).promise(); // returns a promise of the UploadId;
    console.log("✅MULTIPART_UPLOAD_PARAMS: ", multipartParams);

    // extract the uploadId from the promise and send it back as the response
    const uploadId = multipartParams.UploadId;
    return res.status(200).json({ uploadId });
  } catch (error) {
    // handle the error
    console.error("🔴Error initializing multipart upload: ", error);
    res.status(500).send("Multipart upload initialization failed");
  }
};

export const uploadChunck = async ({ res, req }: globalParams) => {
  try {
    // destructure the data
    console.log("✅Uploading chuncks...");
    const { uploadId, fileName, chunckIndex } = req.body;

    // configure S3 and AWS
    const S3 = new AWS({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: "ap-south-1",
    });

    const bucketName = process.env.AWS_BUCKET;

    // parameters for the uploader
    const partParams = {
      Bucket: bucketName,
      Key: fileName,
      UploadId: uploadId,
      PartNumber: parseInt(chunckIndex) + 1,
      Body: req.file.buffer,
    };

    // upload the file
    const data = await S3.uploadPart(partParams).promise();
    console.log("UPLOAD_DATA: ", data);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("🔴Error uploading chuncks: ", error);
    return res.status(500).send("chunk could not be uploaded");
  }
};

export const completeUpload = async ({ res, req }: globalParams) => {
  type ArrayType = {
    PartNumber: number;
    ETag: string;
  };

  try {
    console.log("✅Completing upload...");
    // destructure data from the request
    const { fileName, totalChunks, uploadId, title, description, author } =
      req.body;

    // building the uploaded parts array from the request body
    const uploadedParts: Array<ArrayType> = [];
    for (let i = 0; i < totalChunks; i++) {
      uploadedParts.push({
        PartNumber: i + 1,
        ETag: req.body[`part${i + 1}`],
      });
    }

    // configure S3 and AWS
    const S3 = new AWS({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: "ap-south-1",
    });

    // bucket name and completion parameters
    const bucketName = process.env.AWS_BUCKET;
    const completeParams = {
      Bucket: bucketName,
      key: fileName,
      UploadId: uploadId,
    };

    // Listing parts using the promise from the uploading
    const data = await S3.listParts(completeParams).promise();
    type partsType = {
      ETag: string,
      PartNumber: number
    }
    const parts = data.parts.map((part: partsType) => ({
      ETag: part.ETag,
      PartNumber: part.PartNumber,
    }));

    // @ts-expect-error
    completeParams.MultipartUpload = {
      Parts: parts,
    };

    // completing the multiPart upload using the promise
    const uploadResult = await S3.completeMultipartUpload(
      completeParams
    ).promise();
    const url = uploadResult.location;
    console.log("UPLOAD_RESULT_DATA: ", uploadResult);

    // push VMD to postgres via prisma
    await addVideoDetailsToDB({ title, description, author, url });
    // push event to Kafka topic
    return res.status(200).json({ message: "File Uploaded Successfully!!" });
  } catch (error) {
    console.error("🔴Error Completing file upload: ", error);
    return res.status(500).json({ message: " Upload completion failed." });
  }
};

// push VMD to postgres via prisma
export const uploadToDB = async ({ res, req }: globalParams) => {
  console.log("✅Adding VMD to DB...");
  try {
    const { title, description, author, url } = req.body.videoDetails;
    await addVideoDetailsToDB({ title, description, author, url });
    return res.status(200).send("success");
  } catch (error) {
    console.error("🔴ERROR_ADDING_VMD_TO_DB: ", error);
    return res.status(400).send(error);
  }
};
