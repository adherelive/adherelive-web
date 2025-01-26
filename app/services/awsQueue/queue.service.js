import { SQS } from "@aws-sdk/client-sqs";
import moment from "moment";
import Logger from "../../../libs/log";

const Log = new Logger("QUEUE > SERVICE");

export default class QueueService {
  constructor() {
    // JS SDK v3 does not support global configuration.
    // Codemod has attempted to pass values to each service client in this file.
    // You may need to update clients outside of this file, if they use global config.
    // AWS.config.update({
    //   accessKeyId: process.config.aws.access_key_id,
    //   secretAccessKey: process.config.aws.access_key,
    //   region: process.config.aws.region,
    // });
    this.sqs = new SQS({
      credentials: {
        accessKeyId: process.config.aws.access_key_id,
        secretAccessKey: process.config.aws.access_key,
      },
      region: process.config.aws.region,
    });
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
        Log.debug("createQueue error: ", err);
      } else {
        Log.debug("Success, data URL: ", data.QueueUrl);
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

      const response = await this.sqs.sendMessage(params);
      Log.debug("sendMessage response: ", response);
      return response;
    } catch (error) {
      Log.debug("sendMessage catch error: ", error);
    }
  };

  sendBatchMessage = async (dataArr) => {
    try {
      const formattedData = [];

      console.log("sendBatchMessage dataArr --> ", dataArr);
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

      const response = await this.sqs.sendMessageBatch(params);
      Log.debug("sendMessage batch response: ", response);
      return response;
    } catch (error) {
      Log.debug("sendMessage batch catch error: ", error);
    }
  };

  receiveMessage = async () => {
    try {
      Log.info(`Receive Message queue URI: ${this.getQueueUrl()}`);

      const params = {
        AttributeNames: ["SentTimestamp"],
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 10,
        MessageAttributeNames: ["All"],
        QueueUrl: this.getQueueUrl(),
      };

      const response = await this.sqs.receiveMessage(params);
      // Log.debug("receiveMessage response", response.Messages.length);

      return response.Messages || [];
    } catch (error) {
      console.log("receiveMessage 500 error: ", error);
    }
  };

  deleteMessage = async (ReceiptHandle) => {
    try {
      const params = {
        QueueUrl: await this.getQueueUrl(),
        ReceiptHandle,
      };

      const response = await this.sqs.deleteMessage(params);

      return response;
    } catch (error) {
      console.log("deleteMessage 500 error: ", error);
    }
  };

  purgeQueue = async (queueName) => {
    try {
      const params = {
        QueueUrl: await this.getQueueUrl(),
      };

      if (process.config.sqs.queue_name === queueName) {
        const response = await this.sqs.purgeQueue(params);
        return response;
      } else {
        return null;
      }
    } catch (error) {
      console.log("purgeQueue 500 error: ", error);
    }
  };
}
