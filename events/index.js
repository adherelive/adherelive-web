import Log from "../libs/log";
// import schedule from "node-schedule";
const Config = require("../config/config");
Config();
const Logger = new Log("EVENT SCHEDULE CREATOR");

import SqsObserver from "./sqsObserver";
import QueueService from "../app/services/awsQueue/queue.service";

const queueService = new QueueService();

while(true) {
    await SqsObserver.observe(queueService);
}
//
//
// const cron = schedule.scheduleJob("*/30 * * * * *", async () => {
//     await SqsObserver.observe();
// });