const mongoose = require("mongoose");

const dispensationSchema = new mongoose.Schema(
  {
    benefitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "benefitPlan"
    },
    status: { type: String, enum: ["Pending", "Completed", "Rejected"] },
    products: { type: Object },
    isDelete: { type: Boolean, default: false },
    contributionsId: { type: mongoose.Schema.Types.ObjectId },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    pharmacyId: { type: mongoose.Schema.Types.ObjectId },
    charityGenericDocs: { type: Object },
    regenerateMRL: { type: Boolean, default: false },
    completionDate: { type: Date },
    MRL: [
      {
        type: mongoose.Schema.Types.ObjectId
      }
    ]
  },
  {
    collection: "dispensations",
    timestamps: true
  }
);

module.exports = mongoose.model("dispensation", dispensationSchema);
