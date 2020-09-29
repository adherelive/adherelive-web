import Log from "../libs/log";
import schedule from "node-schedule";
const Logger = new Log("EVENT SCHEDULE CREATOR");

// FOR TEST...
// const Config = require("../config/config");
// Config();

import QueueService from "../app/services/awsQueue/queue.service";

const queueService = new QueueService();

const SqsObserver = import("./sqsObserver")
  .then(module => {
    const sqs = new module.default();
    const cron = schedule.scheduleJob("*/30 * * * * *", async () => {
      await sqs.observe(queueService);
    });
  })
  .catch(err => {
    console.log("dynamic import err", err);
  });

// while(true) {
//     (async () => {
//         await SqsObserver.observe(queueService);
//     })();
// }
