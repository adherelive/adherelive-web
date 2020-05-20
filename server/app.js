import express from "express";
import mysql from "../libs/mysql";

import eventRouter from "../routes/api/events";
import twilioRouter from "../routes/api/twilio";

const app = express();

mysql();

app.set("view engine", "ejs");

app.use(express.json({ limit: "50mb" }));
app.use(
    express.urlencoded({
        extended: false,
        limit: "50mb"
    })
);

app.use('/api', eventRouter);
app.use("/api", twilioRouter);

module.exports = app;

// app.listen(process.config.PORT, () => {
//     console.log(`Server listening on port ${process.config.PORT}`);
// });
