const mongoose = require("mongoose");
const collectionName = "notificationLogs";

const notificationLoggerSchema = new mongoose.Schema(
  {
    programId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "program"
    },
    activityId: {
      type: String,
      required: true
    },
    notificationPayload: {
      type: String
    },
    type: {
      type: String
    },
    status: { enum: ["SENT", "FAILED"] }
  },
  {
    collection: collectionName,
    timestamps: true
  }
);

module.exports = mongoose.model("notificationLogger", notificationLoggerSchema);
