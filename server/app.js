import express from "express";
import path from "path";
import schedule from "node-schedule";
import cookieSession from "cookie-session";
import cookieParser from "cookie-parser";
import cors from "cors";

import Database from "../libs/mysql";
import initializeMongo from "../libs/mongo";
import ApiRouter from "../routes/api";
import mApiRouter from "../routes/m-api";
import EventObserver from "../app/proxySdk/eventObserver";
import ActivityObserver from "../app/activitySdk/activityObserver";

import Start from "../app/Crons/start";
import Passed from "../app/Crons/passed";
import Prior from "../app/Crons/prior";
import ActivePatient from "../app/Crons/activePatient";
import RemoveDocuments from "../app/Crons/removeDocuments";
import LongTerm from "../app/Crons/longTerm";
import RenewTxActivity from "../app/Crons/renewTxActivity";

// Initialize database connections
(async () => {
  try {
    await Database.init();
    await initializeMongo();
    // Initialize event observers
    EventObserver.runObservers();
    ActivityObserver.runObservers();
  } catch (err) {
    console.error("Error during initialization:", err);
  }
})();

const app = express();

// Middleware setup
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(cors());

try {
  const cookieKeys = JSON.parse(process.env.cookieKey);
  app.use(
    cookieSession({
      maxAge: 30 * 24 * 60 * 60 * 1000,
      keys: cookieKeys,
    })
  );
} catch (error) {
  console.error("Error parsing cookieKey:", error);
}

/* ananjay add code
 * Add a check to handle cases where process.config.cookieKey might be undefined or not a valid JSON string
 */
// let cookieKeys = [];
// if (process.config.cookieKey) {
//   try {
//     cookieKeys = JSON.parse(process.config.cookieKey);
//   } catch (error) {
//     console.error('Error parsing cookieKey:', error);
//   }
// } else {
//   console.warn('process.config.cookieKey is undefined or null');
// }
//
// app.use(
//   cookieSession({
//     maxAge: 30 * 24 * 60 * 60 * 1000,
//     keys: cookieKeys,
//   })
// );

// Serve static files
app.use(express.static(path.join(__dirname, "../public")));

// Setup API routes
app.use("/api", ApiRouter);
app.use("/m-api", mApiRouter);

app.get("/*", (req, res) => {
  res.sendFile(path.resolve("public/index.html"));
});

/*
 * Schedule jobs
 * cron jobs run at every one minute.
 * for now, we have changed it to one hour intervals, due to performance on server
 * Example: const cron = schedule.scheduleJob("* /1 * * * *", async () => {
 */
schedule.scheduleJob("0 0 */1 * * *", async () => {
  await Prior.runObserver();
  await Passed.runObserver();
  await Start.runObserver();
});

const perDayUtcRule = new schedule.RecurrenceRule();
perDayUtcRule.hour = 0;
perDayUtcRule.tz = "Etc/UTC";

schedule.scheduleJob(perDayUtcRule, async () => {
  await RemoveDocuments.runObserver();
});

//const perHourCron = schedule.scheduleJob("0 0 */1 * * *", async () => {
schedule.scheduleJob("0 0 */2 * * *", async () => {
  await ActivePatient.runObserver();
  await RenewTxActivity.runObserver();
  await LongTerm.observer();
});

// Schedule job at the start of every month
const monthlyRule = new schedule.RecurrenceRule();
monthlyRule.dayOfWeek = [new schedule.Range(0, 6)];
monthlyRule.hour = 0;
monthlyRule.minute = 0;

// Example of a scheduled job at the start of every month
// schedule.scheduleJob(monthlyRule, async () => {
//     await RenewSubscription.runObserver();
// });

module.exports = app;
