import { kafka } from "kafkajs";
import fs from "fs";
import path from "path";

class KafkaConfig {
  constructor() {
    this.kafka = new kafka({
      clientId: "youtube uploader service",
      brokers: ["<broker-url>"],
      ssl: {
        ca: [fs.readFileSync(path.resolve("./ca.perm"), "utf-8")],
      },
      sasl: {
        username: "admin",
        password: "<pwd>",
        mechanism: "plain",
      },
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({
      groupId: "youtube-uploader",
    });
  }
}
