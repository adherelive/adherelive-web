import express from "express";
import mysql from "../libs/mysql";

import EventObserver from "../app/proxySdk/eventObserver";

import eventRouter from "../routes/api/events";
import appEventRouter from "../routes/m-api/events";
import twilioRouter from "../routes/api/twilio";

const app = express();

mysql();

EventObserver.runObservers();

app.set("view engine", "ejs");

app.use(express.json({ limit: "50mb" }));
app.use(
    express.urlencoded({
        extended: false,
        limit: "50mb"
    })
);

// -------------------- WEB APIs -----------------------

app.use('/api', eventRouter);
app.use("/api", twilioRouter);

// -------------------- APP APIs -----------------------

app.use("/m-api", appEventRouter);

module.exports = app;

// app.listen(process.config.PORT, () => {
//     console.log(`Server listening on port ${process.config.PORT}`);
// });
