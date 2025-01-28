import schedule from "node-schedule";
import Log from "../libs/log";

import queueService from "../app/services/awsQueue/queue.service";

const Logger = new Log("EVENT SCHEDULE CREATOR");

// FOR TEST...
// const Config = require("../config/config");
// Config();
// const cron = schedule.scheduleJob("*/1 * * * * *", async () => {
//     const QueueService = new queueService();
//     QueueService.receiveMessage("test_queue").then(response => {
//         // console.log("Response ---> ", response);
//     });
// });

// Added more error handling and made the function simpler
const SqsObserver = import("./sqsObserver")
    .then((module) => {
        const sqs = new module.default();
        const QueueService = new queueService();
        let isProcessing = false; // Flag to track if a process is already running

        // TODO: Check if changing the SQS timing to 10 mins from 30 seconds helps in the performance
        const cron = schedule.scheduleJob("0 */10 * * * *", async () => {
            if (isProcessing) {
                console.warn("Previous SQS processing still in progress. Skipping this run.");
                return;
            }

            isProcessing = true;
            try {
                await sqs.observe(QueueService);
            } catch (error) {
                console.error("Error processing SQS messages:", error);
                // Implement exponential backoff or other retry strategies here
                // For example:
                // await new Promise(resolve => setTimeout(resolve, 1000 * 2)); // Retry after 2 seconds
            } finally {
                isProcessing = false;
            }
        });
    })
    .catch((err) => {
        console.error("Dynamic import error in Events: ", err);
    });
