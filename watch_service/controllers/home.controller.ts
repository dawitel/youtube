import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
/**
 * @description handler for getting all videos data
 * @param req : express Request
 * @param res : express Response
 * @returns allVideoData
 */
const getAllVideos = async (req: Request, res: Response) => {
  // initialize prisma
  const prisma = new PrismaClient();
  try {
    // query the VMD database for all video data
    const allVideosData = await prisma.$queryRaw`SELECT * FROM "Video_Data"`;
    res.status(200).send(allVideosData);
  } catch (error) {
    console.log("🔴ERROR GETTING VIDEOS DATA: ", error);
    res.status(500).json({ error: "Internal Server Error" }).send();
  }
};

export default getAllVideos;
