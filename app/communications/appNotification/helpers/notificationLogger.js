const mongoose = require("mongoose");
const collectionName = "notificationLogs";
const chalk = require("chalk");
const moment = require("moment");

mongoose.set('strictQuery', true); // Add this line to handle the deprecation warning

let notificationSchema = new mongoose.Schema(
  {
    data: { type: mongoose.Schema.Types.Mixed },
    status: { type: String, required: true },
  },
  {
    collation: collectionName,
    timestamps: true,
  }
);

let notificationModel = mongoose.model("NotificationLog", notificationSchema);

const notificationLogger = {
  success: function (message, data = null) {
    notificationModel
      .insertMany({ data, status: "success" })
      .then((result) => {})
      .catch((err) => {
        console.log(
          chalk.red(
            `Notifications [ ${moment().format("DD-MM-YY HH:MM:SS")}]:`
          ),
          "Error while logging data to db",
          err
        );
      });
  },
  error: function (message, data = null, errObj = null) {
    console.log(
      chalk.red(`Notifications [ ${moment().format("DD-MM-YY HH:MM:SS")}]:`),
      message,
      data,
      errObj
    );
    notificationModel
      .insertMany({ data, status: "failed" })
      .then((result) => {
        console.log(
          chalk.blue(
            `Notifications [ ${moment().format("DD-MM-YY HH:MM:SS")}]:`
          ),
          "Notification logged to db",
          result
        );
      })
      .catch((err) => {
        console.log(
          chalk.red(
            `Notifications [ ${moment().format("DD-MM-YY HH:MM:SS")}]:`
          ),
          "Error while logging error logs to db",
          err
        );
      });
  },
};

module.exports = {
  notificationModel,
  notificationLogger,
};
