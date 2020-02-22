const mongooose = require("mongoose");
const collectionName = "eventErrorLogs";

const eventErrorLoggerSchema = new mongooose.Schema(
  {
    eventType: { type: String },
    errorData: { type: Object }
  },
  {
    collection: collectionName,
    timestamps: true
  }
);

eventErrorLoggerSchema.index({ eventType: 1 });

module.exports = mongooose.model("eventErrorLogger", eventErrorLoggerSchema);
