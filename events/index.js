import Log from "../libs/log";
import schedule from "node-schedule";

const Logger = new Log("EVENT SCHEDULE CREATOR");

// FOR TEST...
// const Config = require("../config/config");
// Config();

import queueService from "../app/services/awsQueue/queue.service";

// const cron = schedule.scheduleJob("*/1 * * * * *", async () => {
//     const QueueService = new queueService();
//     QueueService.receiveMessage("test_queue").then(response => {
//         // console.log("Response ---> ", response);
//     });
// });

const SqsObserver = import("./sqsObserver")
  .then(module => {
    const sqs = new module.default();
    const QueueService = new queueService();
    const cron = schedule.scheduleJob("*/30 * * * * *", async () => {
      await sqs.observe(QueueService);
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
