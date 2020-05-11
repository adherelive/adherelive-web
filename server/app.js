// const createError = require("http-errors");
const Config = require("../config/config");
const express = require("express");
// const socketServer = require("../libs/socketServer");
// const SocketServer = new socketServer(8000);
// SocketServer.start();
// global.IO = SocketServer.getIO();
//
Config();

//
// const cookieSession = require("cookie-session");
// const path = require("path");
// const cookieParser = require("cookie-parser");
// const logger = require("morgan");
// const cors = require("cors");
// const helmet = require("helmet");
// const Mongo = require("../libs/mongo");
// const countryCityRouter = require("../Routes/api/cityCountry/index");
// const eventRouter = require("../Routes/api/event/index");
// const programRouter = require("../Routes/api/program/index");
// const userRouter = require("../Routes/api/user/userIndex");
// const calendarRouter = require("../Routes/api/user/calendarIndex");
// const medicationRouter = require("../Routes/api/medication");
// const insuranceRouter = require("../Routes/api/insurance");
// const pharmaCompaniesRouter = require("../Routes/api/pharmaCompanies");
// const proxySdkRouter = require("../Routes/api/proxySdk");
// const dashboardRouter = require("../Routes/api/dashboard");
// const hospitalRouter = require("../Routes/api/hospital");
// const searchRouter = require("../Routes/api/search");
// const specialityRouter = require("../Routes/api/speciality");
// const medicalConditionRouter = require("../Routes/api/medicalCondition");
// const surveyRouter = require("../Routes/api/survey");
// const productRouter = require("../Routes/api/product");
// const twilioRouter = require("../Routes/api/twilio");
// const articleRouter = require("../Routes/api/article");
// const notificationRouter = require("../Routes/api/notification");
// const programKeyValueRouter = require("../Routes/api/programKeyValue");
// const hospitalizationRouter = require("../Routes/api/hospitalization");
// const charityAppliedRouter = require("../Routes/api/charityApplied");
// const benefitPlanRouter = require("../Routes/api/benefitPlan");
// const charityDocumentRouter = require("../Routes/api/charityDocument");
// const dispensationRouter = require("../Routes/api/dispensation");
// const charityRouter = require("../Routes/api/charity");
// const userDeviceRouter = require("../Routes/api/userDevices/userDeviceRouter");
// const jwt = require("jsonwebtoken");
// const userService = require("../app/services/user/user.service");
// const userController = require("../app/controllers/user/user.controller");
// const EventObserver = require("../app/proxySdk/eventObserver");
// let { Proxy_Sdk, EVENTS } = require("../app/proxySdk");
// //const rbac = require("../app/helper/rbac");
// const rbacNew = require("../Routes/api/middleware/rbac");
// const schedule = require("node-schedule");
// const Activity = require("../app/activitySdk/activityObserver");
// const NotificationObserver = require("../app/notificationSdk/notificationObeserver");
const app = express();
// const mongo = new Mongo();
//
// EventObserver.runObservers();
// Activity.runObservers();
// NotificationObserver.runObservers();
//
// // (async () => {
// //   await rbac.init();
// // })();
//
// (async () => {
//   await rbacNew.init();
// })();
//
// var conn = (async function() {
//   try {
//     const connection = await mongo.getConnection();
//   } catch (err) {
//     console.log(err);
//   }
// })();
// var j = schedule.scheduleJob("*/15 * * * *", function() {
//   Proxy_Sdk.executeScheduledEvent();
// });
//
// // view engine setup
// app.set("views", path.join(__dirname, "../app/views"));
// app.set("view engine", "ejs");
//
// app.use(logger("dev"));
// app.use(express.json({ limit: "50mb" }));
// app.use(
//   express.urlencoded({
//     extended: false,
//     limit: "50mb"
//   })
// );
// app.use(cookieParser());
// // app.use(express.static(path.join(__dirname, "public")));
// app.use(express.static(path.join(__dirname, "../public")));
//
// app.use(helmet());
// app.use(cors());
// app.use(
//   cookieSession({
//     maxAge: 30 * 24 * 60 * 60 * 1000,
//     keys: JSON.parse(process.config.cookieKey)
//   })
// );
//
// app.use(async function(req, res, next) {
//   try {
//     const { query: { m } = {} } = req;
//     // let accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzNDM0MzQzMDMwMzAzMDMwMzAzMDMwMzAiLCJpYXQiOjE1NzExMTk5MzQsImV4cCI6MTU3MTIwNjMzNH0.c0fSmeWgFbGcqMLAhQkpPoJH1rCt2hvFqr_nN1gxVPE';
//     let accessToken;
//     if (m) {
//       const { authorization = "" } = req.headers || {};
//       const bearer = authorization.split(" ");
//       if (bearer.length === 2) {
//         accessToken = bearer[1];
//       }
//     } else {
//       const { cookies = {} } = req;
//       if (cookies.accessToken) {
//         accessToken = cookies.accessToken;
//       }
//     }
//
//     if (accessToken) {
//       const secret = process.config.TOKEN_SECRET_KEY;
//       const decodedAccessToken = await jwt.verify(accessToken, secret);
//       let user = await userService.getUser({ _id: decodedAccessToken.userId });
//       if (user) {
//         req.userDetails = {
//           exists: true,
//           userId: decodedAccessToken.userId,
//           userData: user
//         };
//       } else {
//         req.userDetails = {
//           exists: false
//         };
//       }
//     } else {
//       req.userDetails = {
//         exists: false
//       };
//     }
//     next();
//   } catch (err) {
//     req.userDetails = {
//       exists: false
//     };
//     next();
//   }
// });
//
// app.get("/accept-invite/:link", userController.acceptInvite);
// app.use("/api", countryCityRouter);
//
// app.use("/api", dashboardRouter);
// app.use("/api", eventRouter);
// app.use("/api", hospitalRouter);
// app.use("/api", programRouter);
// app.use("/api", userRouter);
// app.use("/api", calendarRouter);
// app.use("/api", insuranceRouter);
// app.use("/api", proxySdkRouter);
// app.use("/api", searchRouter);
// app.use("/api", specialityRouter);
// app.use("/api", medicalConditionRouter);
// app.use("/api", pharmaCompaniesRouter);
// app.use("/api", medicationRouter);
// app.use("/api", twilioRouter);
// app.use("/api", articleRouter);
// app.use("/api", notificationRouter);
// app.use("/api", programKeyValueRouter);
// app.use("/api", hospitalizationRouter);
// app.use("/api", charityAppliedRouter);
// app.use("/api", benefitPlanRouter);
// app.use("/api", charityDocumentRouter);
// app.use("/api", charityRouter);
// app.use("/api", dispensationRouter);
// app.use("/api", userDeviceRouter);
//
// app.use("/api", productRouter);
// //doctor accessible route
// app.use("/api", surveyRouter);
//
// app.use((req, res) => {
//   return res.sendFile(path.join(__dirname, "../public/index.html"));
// });
//
// if (process.env.NODE_ENV === "production") {
//   // app.use(express.static("../../client/build"));
//   // const path = require("path");
//   // app.get("*", (req, res) => {
//   //   res.sendFile(path.resolve("../../", "client", "build", "index.html"));
//   // });
// }
//
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//   console.log(err);
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};
//   // render the error page
//   res.status(err.status || 500);
//   res.render("error");
// });
//

app.use("/user", UserRouter);

module.exports = app;
