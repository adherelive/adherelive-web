import Log from "../libs/log";
import schedule from "node-schedule";
const Logger = new Log("EVENT SCHEDULE CREATOR");

// const Config = require("../config/config");
// Config();

import QueueService from "../app/services/awsQueue/queue.service";

const queueService = new QueueService();

// console.log("19837192873 process.config", process.config);

const SqsObserver = import("./sqsObserver")
  .then(module => {
    console.log("18927312 module --> ", module);
    const sqs = new module.default();
    const cron = schedule.scheduleJob("*/10 * * * * *", async () => {
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
