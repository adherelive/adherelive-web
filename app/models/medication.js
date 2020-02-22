const mongoose = require("mongoose");
const collectionName = "medications";
const modelName = "medication";

const medicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", index: true },
    medicine: { type: [Object] }
  },
  {
    collection: collectionName,
    timestamps: true
  }
);

module.exports = mongoose.model(modelName, medicationSchema);
