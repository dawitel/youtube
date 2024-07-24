import { PrismaClient } from "@prisma/client";

// TODO: instantiate prisma once in separate file
const prisma = new PrismaClient();

type videoMetData = {
  title: string;
  description: string;
  author: string;
  url: URL;
};

export const addVideoDetailsToDB = async ({
  author,
  description,
  title,
  url,
}: videoMetData) => {
  const videoData = await prisma.videoData.create({
    data: {
      title,
      description,
      author,
      url,
    },
  });
  console.log("✅VIDEO_META_DATA: ", videoData);
};
