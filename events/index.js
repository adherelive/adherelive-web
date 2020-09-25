import Log from "../libs/log";
import schedule from "node-schedule";
const Config = require("../config/config");
Config();
const Logger = new Log("EVENT SCHEDULE CREATOR");

// import SqsObserver from "./sqsObserver";
//
//
// const cron = schedule.scheduleJob("*/30 * * * * *", async () => {
//     await SqsObserver.observe();
// });