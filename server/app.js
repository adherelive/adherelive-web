import express from "express";
import path from "path";
import schedule from "node-schedule";
import cookieSession from "cookie-session";
import cookieParser from "cookie-parser";
import cors from "cors";

import Database from "../libs/mysql";
import initMongo from "../libs/mongo";
// import connection from "../libs/dbConnection";

import ApiRouter from "../routes/api";
import mApiRouter from "../routes/m-api";
import EventObserver from "../app/proxySdk/eventObserver";
import ActivityObserver from "../app/activitySdk/activityObserver";

import Start from "../app/cronJobs/start";
import Passed from "../app/cronJobs/passed";
import Prior from "../app/cronJobs/prior";
import ActivePatient from "../app/cronJobs/activePatient";
import RemoveDocuments from "../app/cronJobs/removeDocuments";
// import RenewSubscription from "../app/cronJobs/renewSubscription";
import LongTerm from "../app/cronJobs/longTerm";
import RenewTxActivity from "../app/cronJobs/renewTxActivity";


// Set up the required variables and CORS sessions + cookies
const Events = import("../events")
    .then((module) => {})
    .catch((err) => {
        console.log("Event module error: ", err);
    });

// Create the App as an Express() app
const app = express();
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

/*
 * Schedule jobs
 * cron jobs run at every one minute.
 * for now, we have changed it to one hour intervals, due to performance on server
 * Example: const cron = schedule.scheduleJob("* /1 * * * *", async () => {
 */
// Schedule job at the start of every month
const monthlyRule = new schedule.RecurrenceRule();
const perDayUtcRule = new schedule.RecurrenceRule();

monthlyRule.dayOfWeek = [new schedule.Range(0, 6)];
monthlyRule.hour = 0;
monthlyRule.minute = 0;
perDayUtcRule.hour = 0;
perDayUtcRule.tz = "Etc/UTC";

const cron = schedule.scheduleJob("0 0 */1 * * *", async () => {
    await Prior.runObserver();
    await Passed.runObserver();
    await Start.runObserver();
});

const removeDocumentPerDayCron = schedule.scheduleJob(
    perDayUtcRule,
    async () => {
      await RemoveDocuments.runObserver();
    }
);

// const perHourCron = schedule.scheduleJob("0 0 */1 * * *", async () => {
schedule.scheduleJob("0 0 */2 * * *", async () => {
    await ActivePatient.runObserver();
    await RenewTxActivity.runObserver();
    await LongTerm.runObserver();
});

// Scheduled job at the start of every month, for the subscriptions
// schedule.scheduleJob(monthlyRule, async () => {
//     await RenewSubscription.runObserver();
// });


// Initialize database connections & event observers
(async () => {
    try {
        await Database.init();
        await initMongo();

        // Initialize event observers
        EventObserver.runObservers();
        ActivityObserver.runObservers();
    } catch (err) {
        console.error("Error during initialization: ", err);
    }
})();

// Middleware setup
app.use(express.json({limit: "50mb"}));
app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
  })
);
app.use(cookieParser());
app.use(cors());


/*
 * Add a check to handle cases where process.config.cookieKey might be undefined or not a valid JSON string
 */
// function generateCookieKey() {
//   return (
//     "key_" + Math.random().toString(36).substr(2) + Date.now().toString(36)
//   );
// }
// console.log(generateCookieKey());

let cookieKeys = [];

try {
    if (process.config && process.config.cookieKey) {
        cookieKeys = JSON.parse(process.config.cookieKey);
    } else {
        console.warn("process.config.cookieKey is undefined or null");
        // Set a default value if cookieKey is not defined
        cookieKeys = ["cookie938", "abc123xyz456abc789xyz012"];
    }
} catch (error) {
    console.error("Error parsing cookieKey: ", error);
    // Set a default value in case of error
    cookieKeys = ["cookie938", "abc123xyz456abc789xyz012"];
}

app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        keys: cookieKeys,
    })
);

// TODO: Remove the code that serves the React frontend
// Serve static files
app.use(express.static(path.join(__dirname, "../public")));

// Setup API routes
app.use("/api", ApiRouter);
app.use("/m-api", mApiRouter);

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'AdhereLive API Documentation',
        version: '1.0.0',
        description: 'This is the API documentation for the React & Node server AdhereLive application',
    },
};

const swaggerOptions = {
    swaggerDefinition,
    apis: ['../routes/**/*.js'], // Path to your API files
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// TODO: This is used for the frontend. As we have moved that to a different repository, removing from here.
app.get("/*", (req, res) => {
    res.sendFile(path.resolve("public/index.html"));
});

module.exports = app;
