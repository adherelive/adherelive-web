const mongoose = require("mongoose");

const benefitPlanDocumentSchema = new mongoose.Schema(
  {
    name: { type: String }
  },
  {
    collection: "benefitPlanDocuments",
    timestamps: true
  }
);

module.exports = mongoose.model(
  "benefitPlanDocuments",
  benefitPlanDocumentSchema
);
