import { Kafka } from "kafkajs";
import fs from "fs";
import path from "path";

type kafkaConfigurationParams = {
  kafka: any;
  producer: any;
  consumer: any;
};
class KafkaConfig<kafkaConfigurationParams> {
  constructor() {
    this.kafka = new Kafka({
      clientId: "youtube upload service",
      brokers: ["<broker-url>"],
      ssl: {
        ca: [fs.readFileSync(path.resolve("./ca.pem"), "utf-8")],
      },
      sasl: {
        username: "avnadmin",
        password: "<pwd>",
        mechanism: "plain",
      },
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: "youtube-upload-service" });
  }

  async produce(topic: any, messages: any) {
    try {
      const result = await this.producer.connect();
      console.log("kafka connected... : ", result);
      await this.producer.send({
        topic: topic,
        messages: messages,
      });
    } catch (error) {
      console.log(error);
    } finally {
      await this.producer.disconnect();
    }
  }

  async consume(topic: any, callback: (value: any) => void) {
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({ topic: topic, fromBeginning: true });
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          const value = message.value.toString();
          callback(value);
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
}
export default KafkaConfig;
