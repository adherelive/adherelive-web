import express from "express";
import mysql from "../libs/mysql";

import EventObserver from "../app/proxySdk/eventObserver";
import Activity from "../app/activitySdk/activityObserver";
// import NotificationObserver from "../app/notificationSdk/notificationObeserver";

import eventRouter from "../routes/api/events";
import appEventRouter from "../routes/m-api/events";
import twilioRouter from "../routes/api/twilio";
import userRouter from "../routes/api/user";

const Config = require("../config/config");
//
Config();


//
const cookieSession = require("cookie-session");
//const path = require("path");
const cookieParser = require("cookie-parser");
// const logger = require("morgan");
const cors = require("cors");

const jwt = require("jsonwebtoken");
const userService = require("../app/services/user/user.service");
const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({
    extended: false,
    limit: "50mb"
  })
);
app.use(cookieParser());
app.use(cors());
console.log("123893y 1", JSON.parse(process.config.cookieKey));
app.use(
    cookieSession({
     maxAge: 30 * 24 * 60 * 60 * 1000,
     keys: JSON.parse(process.config.cookieKey)
   })
 );

//
app.use(async function(req, res, next) {
  try {
    const { query: { m } = {} } = req;
    let accessToken;
    if (m) {
      const { authorization = "" } = req.headers || {};
      const bearer = authorization.split(" ");
      if (bearer.length === 2) {
        accessToken = bearer[1];
      }
    } else {
      const { cookies = {} } = req;
      if (cookies.accessToken) {
        accessToken = cookies.accessToken;
      }
    }

    if (accessToken) {
      const secret = process.config.TOKEN_SECRET_KEY;
      const decodedAccessToken = await jwt.verify(accessToken, secret);
      let user = await userService.getUser({ _id: decodedAccessToken.userId });
      if (user) {
        req.userDetails = {
          exists: true,
          userId: decodedAccessToken.userId,
          userData: user
        };
      } else {
        req.userDetails = {
          exists: false
        };
      }
    } else {
      req.userDetails = {
        exists: false
      };
    }
    next();
  } catch (err) {
    req.userDetails = {
      exists: false
    };
    next();
  }
});
//

mysql();

EventObserver.runObservers();
Activity.runObservers();
// NotificationObserver.runObservers();

// app.set("view engine", "ejs");
//
// app.use(express.json({ limit: "50mb" }));
// app.use(
//     express.urlencoded({
//         extended: false,
//         limit: "50mb"
//     })app
// );

// -------------------- WEB APIs -----------------------
app.use("/api", userRouter);
app.use('/api', eventRouter);
app.use("/api", twilioRouter);

// -------------------- APP APIs -----------------------

app.use("/m-api", appEventRouter);

module.exports = app;

// app.listen(process.config.PORT, () => {
//     console.log(`Server listening on port ${process.config.PORT}`);
// });
