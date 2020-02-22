const mongoose = require("mongoose");
const collectionName = "charitiesApplied";

const POSchema = new mongoose.Schema(
  {
    //amount: { type: String },
    generatedOn: { type: Date },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    poNumber: { type: String },
    poType: { type: String },
    docs: [{ type: Object }],
    products: { type: Object }
  },
  { _id: false }
);

const charityAppliedSchema = new mongoose.Schema(
  {
    benefitPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "benefitPlan"
    },
    charityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "charity"
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    },
    dispensationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "dispensation"
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"]
    },
    currentLevel: [{ type: String }],
    levelApprovals: { type: Object },
    charityDocs: { type: Object },
    appliedOn: { type: Date },
    rejectReason: { type: String },
    invoice: { type: Object },
    PO: POSchema
  },
  {
    collection: collectionName,
    timestamps: true
  }
);

module.exports = mongoose.model("charityApplied", charityAppliedSchema);
