const mongoose = require("mongoose");
const collectionName = "smsLogs";

const smsLogger = new mongoose.Schema(
  {
    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "program"
    },
    activityId: { type: String },
    loggedInUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    },
    type: { type: String, required: true },
    message: { type: String },
    status: { type: String, enum: ["SENT", "FAILED"] }
  },
  {
    collection: collectionName,
    timestamps: true
  }
);

module.exports = mongoose.model("smsLogger", smsLogger);
