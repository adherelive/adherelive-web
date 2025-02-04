import AWS from "aws-sdk";
import moment from "moment";
import { createLogger } from "../../../libs/logger";

const logger = createLogger("QUEUE > SERVICE");

export default class QueueService {
  constructor() {
    AWS.config.update({
      accessKeyId: process.config.aws.access_key_id,
      secretAccessKey: process.config.aws.access_key,
      region: process.config.aws.region,
    });
    this.sqs = new AWS.SQS();
  }

  createQueue = (name = "test_queue") => {
    const params = {
      QueueName: name,
      Attributes: {
        DelaySeconds: "60",
        MessageRetentionPeriod: "86400",
      },
    };

    this.sqs.createQueue(params, (err, data) => {
      if (err) {
        logger.error("createQueue error: ", err);
      } else {
        logger.debug("Success ---> data queue URL: ", data.QueueUrl);
      }
    });
  };

  getQueueUrl = () => {
    return `${process.config.sqs.domain_url}/${process.config.sqs.account_id}/${process.config.sqs.queue_name}`;
  };

  sendMessage = async (data) => {
    try {
      const stringData = JSON.stringify(data);

      const params = {
        DelaySeconds: 30,
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
        QueueUrl: this.getQueueUrl(),
      };

      const response = await this.sqs.sendMessage(params).promise();
      logger.debug("Send Message response: ", response);
      return response;
    } catch (error) {
      logger.error("Sending Message has an error: ", error);
    }
  };

  sendBatchMessage = async (dataArr) => {
    try {
      const formattedData = [];

      logger.debug("sendBatchMessage -> dataArr: ", dataArr);
      dataArr.forEach((data, index) => {
        const stringData = JSON.stringify(data);
        const params = {
          Id: `${moment().format("x")}-${index}`,
          DelaySeconds: 5,
          MessageAttributes: {},
          MessageBody: stringData,
          // QueueUrl: this.getQueueUrl(queueName)
        };
        formattedData.push(params);
      });

      const params = {
        Entries: formattedData,
        QueueUrl: this.getQueueUrl(),
      };

      const response = await this.sqs.sendMessageBatch(params).promise();
      logger.debug("Send Batch Message response: ", response);
      return response;
    } catch (error) {
      logger.error("Send Batch Message has an error: ", error);
    }
  };

  receiveMessage = async () => {
    try {
      logger.debug(`Receive Message queue URI: ${this.getQueueUrl()}`);

      const params = {
        AttributeNames: ["SentTimestamp"],
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 10,
        MessageAttributeNames: ["All"],
        QueueUrl: this.getQueueUrl(),
      };

      const response = await this.sqs.receiveMessage(params).promise();
      // logger.debug("receiveMessage response", response.Messages.length);

      return response.Messages || [];
    } catch (error) {
      logger.debug("receiveMessage 500 error: ", error);
    }
  };

  deleteMessage = async (ReceiptHandle) => {
    try {
      const params = {
        QueueUrl: await this.getQueueUrl(),
        ReceiptHandle,
      };

      const response = await this.sqs.deleteMessage(params).promise();

      return response;
    } catch (error) {
      logger.debug("deleteMessage 500 error: ", error);
    }
  };

  purgeQueue = async (queueName) => {
    try {
      const params = {
        QueueUrl: await this.getQueueUrl(),
      };

      if (process.config.sqs.queue_name === queueName) {
        const response = await this.sqs.purgeQueue(params).promise();
        return response;
      } else {
        return null;
      }
    } catch (error) {
      logger.debug("purgeQueue 500 error: ", error);
    }
  };
}
