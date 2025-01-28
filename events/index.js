import schedule from "node-schedule";
import Log from "../libs/log";

import queueService from "../app/services/awsQueue/queue.service";
import { importModule } from '../libs/helper.js'; // A helper function for dynamic imports

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
const SqsObserver = importModule("./sqsObserver")
    .then((module) => {
        const sqs = new module.default();
        const QueueService = new queueService();

        const circuitBreaker = createCircuitBreaker({
            failureThreshold: 5, // Number of consecutive failures before opening the circuit
            timeoutMs: 5 * 60 * 1000, // Time in milliseconds before trying again (5 minutes)
        });

        // TODO: Check if changing the SQS timing to 10 mins from 30 seconds helps in the performance
        const cron = schedule.scheduleJob("0 */10 * * * *", async () => {
            try {
                await circuitBreaker.execute(async () => {
                    await sqs.observe(QueueService);
                });
            } catch (error) {
                console.error("Error processing SQS messages: ", error);
                // You can implement more sophisticated error handling here,
                // such as sending alerts or triggering a monitoring system.
            }
        });
    })
    .catch((err) => {
        console.error("Dynamic import error in Events: ", err);
    });

// Basic Circuit Breaker Implementation
function createCircuitBreaker({ failureThreshold, timeoutMs }) {
    let failureCount = 0;
    let lastFailureTime = 0;
    let isOpen = false;

    return {
        execute: async (fn) => {
            if (isOpen) {
                const now = Date.now();
                if (now - lastFailureTime < timeoutMs) {
                    throw new Error('Circuit is open!');
                }
                isOpen = false; // Reset circuit breaker after timeout
            }

            try {
                const result = await fn();
                failureCount = 0; // Reset failure count on success
                return result;
            } catch (error) {
                failureCount++;
                if (failureCount >= failureThreshold) {
                    isOpen = true;
                    lastFailureTime = Date.now();
                }
                throw error;
            }
        },
    };
}
