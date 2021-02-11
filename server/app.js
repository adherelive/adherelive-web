import express from "express";
import Database from "../libs/mysql";
import path from "path";
import schedule from "node-schedule";

import Start from "../app/Crons/start";
import Passed from "../app/Crons/passed";
import RenewSubscription from "../app/Crons/renewSubscription";
import activePatient from "../app/Crons/activePatient";

import ApiRouter from "../routes/api";
import mApiRouter from "../routes/m-api";

import EventObserver from "../app/proxySdk/eventObserver";
import Activity from "../app/activitySdk/activityObserver";

Database.init();

const Events  = import("../events").then(module => {}).catch(err => {console.log("event module error", err)});

const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

/****************************  CRONS  *********************************/

// CRONS RUNNING EVERY 1 MINUTE
const cron = schedule.scheduleJob("*/1 * * * *", async () => {
    // await Prior.getPriorEvents();
    await Passed.runObserver();
    await Start.runObserver();
});

// CRONS RUNNING EVERY 1 HOUR
const perHourCron = schedule.scheduleJob("0 0 */1 * * *", async () => {
   await activePatient.runObserver();
});

// CRONS RUNNING AT START OF EVERY MONTH
const rule = new schedule.RecurrenceRule();
rule.dayOfWeek=[new schedule.Range(0,6)];
rule.hour = 0;
rule.minute = 0;

const perDayCron = schedule.scheduleJob(rule, async () => {
    await RenewSubscription.runObserver();
});

EventObserver.runObservers();
Activity.runObservers();

app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb"
  })
);
app.use(cookieParser());
app.use(cors());
app.use(
    cookieSession({
     maxAge: 30 * 24 * 60 * 60 * 1000,
     keys: JSON.parse(process.config.cookieKey)
   })
 );

app.use(express.static(path.join(__dirname, "../public")));


// --------------------  API ROUTES -----------------------

app.use("/api", ApiRouter);
app.use("/m-api", mApiRouter);

module.exports = app;