import { Request, Response } from "express";
import KafkaConfig from "../kafka/kafka";

type globalParams = {
  req: Request;
  res: Response;
};

const sendMessageToKafka = async ({ req, res }: globalParams) => {
  console.log("✅Publishing message to kafka from UPLOAD_SERVICE: ");
  try {
    // extract the message from the request body
    const message = req.body;
    const kafkaConfiguration = new KafkaConfig();
    const msgs = [
      {
        key: "key1",
        value: JSON.stringify(message),
      },
    ];

    const result = await kafkaConfiguration.produce("transcode", msgs);
    console.log("✅RESULT_OF_MSG_PRODUCTION: ", result);
    res.status(200).json("✅MESSAGE_PUBLISHED_SUCCESSFULLY");
  } catch (error) {
    console.log("🔴Error publishing message to kafka: ", error);
  }
};

export default sendMessageToKafka;
