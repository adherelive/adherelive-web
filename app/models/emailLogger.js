const mongoose = require("mongoose");

const collectionName = "emailLogs";
const emailLoggerSchema = new mongoose.Schema(
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
    toAddress: { type: String },
    title: { type: String },
    templateData: { type: Object },
    templateName: { type: String },
    status: { type: String, enum: ["SENT", "FAILED"] }
  },
  {
    collection: collectionName,
    timestamps: true
  }
);

module.exports = mongoose.model("emailLogger", emailLoggerSchema);
