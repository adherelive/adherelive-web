const mongoose = require("mongoose");
const collectionName = "hospitalization";
const modelName = "hospitalization";

const hospitalizationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", index: true },
    hospitalization: {
      type: [
        {
          _id: false,
          hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: "hospital" },
          admissionDate: { type: Date },
          dischargeDate: { type: Date },
          comment: { type: String }
        }
      ]
    }
  },
  {
    collection: collectionName,
    timestamps: true
  }
);

module.exports = mongoose.model(modelName, hospitalizationSchema);
