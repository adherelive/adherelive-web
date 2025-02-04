import schedule from "node-schedule";
import { createLogger } from "../libs/logger";

import queueService from "../app/services/awsQueue/queue.service";
import { importModule } from '../libs/helper.js'; // A helper function for dynamic imports

const logger = createLogger("EVENT SCHEDULE CREATOR");

/**
 * Demonstrate the use of a helper function (importModule) for dynamically importing a module (./sqsObserver).
 * Here's why this approach is beneficial:
 *
 * Centralized Import Logic:
 * By encapsulating the dynamic import logic within a helper function (importModule), you centralize this functionality.
 * If you need to change how dynamic imports are handled (e.g., adding error handling, caching, or code splitting),
 * you only need to modify the importModule function itself.
 * This improves code maintainability and reduces code duplication.
 * Improved Readability:
 *
 * Using importModule makes the main code more concise and easier to read.
 * The core logic of the SqsObserver is not cluttered with the details of dynamic imports.
 * Potential for Advanced Features:
 *
 * The importModule function can be extended to include features like:
 * Caching imported modules to improve performance.
 * Implementing loading indicators or progress bars during module loading.
 * Handling different import strategies (e.g., lazy loading, code splitting).
 *
 * Uses the schedule.scheduleJob() method to schedule a task to run every 30 seconds (* /30 * * * * * in cron format).
 * Within the scheduled task, calls the sqs.observe() method, presumably to process messages from an SQS queue.
 */
const SqsObserver = import("./sqsObserver")
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
                logger.error("Error processing SQS messages: ", error);
                // You can implement more sophisticated error handling here,
                // such as sending alerts or triggering a monitoring system.
            }
        });
    })
    .catch((err) => {
        logger.error("Dynamic import error in Events: ", err);
    });

/**
 * Basic Circuit Breaker Implementation
 * Circuit Breaker Implementation:
 *
 * createCircuitBreaker function:
 * Initializes with failureThreshold (number of allowed failures before opening the circuit) and timeoutMs
 * (time in milliseconds to wait before trying again).
 * Tracks failureCount, lastFailureTime, and isOpen state.
 * execute() method:
 * Checks if the circuit is open. If open, it throws an error if the timeoutMs has not elapsed.
 * Tries to execute the provided function (fn).
 * If the function succeeds, resets the failure count.
 * If the function fails, increments the failure count and opens the circuit if the threshold is reached.
 * Integration with SQS Observer:
 *
 * The cron job now uses circuitBreaker.execute() to wrap the sqs.observe() call.
 * If the circuit is open, the sqs.observe() will not be executed, preventing unnecessary calls to the SQS service.
  */
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

/**
 * // FOR TEST...
 const Config = require("../config/config");
 Config();

 const cron = schedule.scheduleJob("*!/1 * * * * *", async () => {
     const QueueService = new queueService();
     QueueService.receiveMessage("test_queue").then(response => {
        logger.debug("Response ---> ", response);
     });
 });
 */
