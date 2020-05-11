const mongoose = require("mongoose");
const collectionName = "medicalConditions";
const modelName = "medicalCondition";

const medicalConditionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", index: true },
    basicCondition: {
      type: Object
    },
    vitals: [
      {
        _id: false,
        updatedAt: { type: Date },
        temperatureUnit: { type: "String", enum: ["c", "f"] },
        temperature: { type: Number },
        respirationRate: { type: Number },
        pulse: { type: Number },
        bloodPressure: { type: String }
      }
    ],
    clinicalReadings: {
      active: [{ type: String }],
      readings: { type: Object }
    },
    others: {
      type: Object
    }
  },
  {
    collection: collectionName,
    timestamps: true
  }
);

module.exports = mongoose.model(modelName, medicalConditionSchema);
