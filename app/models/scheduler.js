const mongoose = require("mongoose");
const collectionName = "schedulers";

const schedulerSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      enum: ["appointment", "reminder", "medication-reminder"],
      required: true
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "event",
      index: true
    },
    reason: {
      type: String
    },
    startTime: {
      type: Date
    },
    endTime: {
      type: Date
    },
    data: {
      type: Object
    },
    status: {
      type: String,
      enum: ["pending", "started", "passed", "completed", "inactive"],
      default: "pending"
    },
    completedBy: {
      type: mongoose.Schema.Types.ObjectId
    },
    joinedParticipants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default: undefined
      }
    ]
  },
  {
    collection: collectionName,
    timestamps: true
  }
);

module.exports = mongoose.model("scheduler", schedulerSchema);
