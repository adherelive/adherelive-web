import AWS from "aws-sdk";
import Logger from "../../../libs/log";

const Log = new Logger("QUEUE > SERVICE");

export default class QueueService {
  constructor() {
    AWS.config.update({
      accessKeyId: process.config.aws.access_key_id,
      secretAccessKey: process.config.aws.access_key,
      region: process.config.aws.region
    });
    this.sqs = new AWS.SQS();
  }

  createQueue = (name = "test_queue") => {
    const params = {
      QueueName: name,
      Attributes: {
        DelaySeconds: "60",
        MessageRetentionPeriod: "86400"
      }
    };

    this.sqs.createQueue(params, (err, data) => {
      if (err) {
        Log.debug("createQueue err", err);
      } else {
        Log.debug("Success", data.QueueUrl);
      }
    });
  };

  getQueueUrl = (name = "test_queue") => {
    return `${process.config.sqs.domain_url}/${process.config.sqs.account_id}/${name}`;
  };

  sendMessage = async (queueName = "test_queue", data) => {
    try {
      const stringData = JSON.stringify(data);

      const params = {
        DelaySeconds: 10,
        MessageAttributes: {
        //     Title: {
        //         DataType: "String",
        //         StringValue: "The Whistler"
        //     },
        //     Author: {
        //         DataType: "String",
        //         StringValue: "John Grisham"
        //     },
        //     WeeksOn: {
        //         DataType: "Number",
        //         StringValue: "6"
        //     }
        },
        MessageBody: stringData,
        // MessageDeduplicationId: "TheWhistler",  // Required for FIFO queues
        // MessageGroupId: "Group1",  // Required for FIFO queues
        QueueUrl: this.getQueueUrl(queueName)
      };

      const response = await this.sqs.sendMessage(params).promise();
      Log.debug("sendMessage response", response);
      return response;
    } catch (error) {
      Log.debug("sendMessage catch error", error);
    }
  };

  receiveMessage = async (QueueName = "test_queue") => {

    Log.info(`queue url : ${this.getQueueUrl("test_queue")}`);
    try {
      const params = {
        AttributeNames: ["SentTimestamp"],
        MaxNumberOfMessages: 10,
        MessageAttributeNames: ["All"],
        QueueUrl: this.getQueueUrl(QueueName)
      };

      const response = await this.sqs.receiveMessage(params).promise();
      Log.debug("receiveMessage response", response);

      return response.Messages;
    } catch (error) {
      console.log("receiveMessage 500 error", error);
    }
  };

  deleteMessage = async (ReceiptHandle) => {
    Log.info("deleteMessage CALLED!!", ReceiptHandle);
    try {
      console.log("this.QueueUrl ---->>",this.getQueueUrl("test_queue"));

      const params = {
        QueueUrl: await this.getQueueUrl("test_queue"),
        ReceiptHandle
      };

      const response = await this.sqs.deleteMessage(params).promise();

      return response;
    } catch (error) {
      console.log("receiveMessage 500 error", error);
    }
  };
}
