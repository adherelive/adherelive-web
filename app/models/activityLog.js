import mongoose from "mongoose";
const collectionName = "activityLog";

const activityLogSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId },
    message: { type: String },
    data: { type: Object },
    updatedBy: { type: String }, // updatedBy cannot be ObjectId because in some cases it id "default"
    status: {
      type: String,
      enum: ["pending", "cancelled", "completed", "expired"],
      default: "pending"
    }
  },
  {
    collection: collectionName,
    timestamps: true
  }
);

export default mongoose.model("activityLog", activityLogSchema);
