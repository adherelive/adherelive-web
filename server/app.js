import express from "express";
import mysql from "../libs/mysql";
import path from "path";
import schedule from "node-schedule";

import EventObserver from "../app/proxySdk/eventObserver";
import Activity from "../app/activitySdk/activityObserver";
// import NotificationObserver from "../app/notificationSdk/notificationObeserver";

// import Prior from "../app/Crons/prior";
import Start from "../app/Crons/start";
import Passed from "../app/Crons/passed";

import ApiRouter from "../routes/api";
import mApiRouter from "../routes/m-api";

const Config = require("../config/config");
Config();

const Events  = import("../events").then(module => {}).catch(err => {console.log("event module error", err)});

async function assertDatabaseConnectionOk() {
    console.log(`Checking database connection...`);
    try {
        await mysql.authenticate();
        console.log('Database connection OK!');
    } catch (error) {
        console.log('Unable to connect to the database:');
        console.log(error.message);
        process.exit(1);
    }
}

async function init() {
    await assertDatabaseConnectionOk();

    console.log(`Starting Sequelize + Express example on port`);
}

init();


const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

const cron = schedule.scheduleJob("*/1 * * * *", async () => {
    // await Prior.getPriorEvents();
    await Passed.runObserver();
    await Start.runObserver();
});

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

EventObserver.runObservers();
Activity.runObservers();
// NotificationObserver.runObservers();


// --------------------  API ROUTES -----------------------

app.use("/api", ApiRouter);
app.use("/m-api", mApiRouter);

module.exports = app;