const mongoose = require("mongoose");

const benefitPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    },
    name: { type: String },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    upcomingDispensation: {
      type: mongoose.Schema.Types.ObjectId
    },
    benefitDocs: {
      type: Object
    },
    isBenefitDocsVerified: { type: Boolean },
    status: { type: String, enum: ["Pending", "Completed", "Rejected"] }
  },
  {
    collection: "benefitPlans",
    timestamps: true
  }
);

module.exports = mongoose.model("benefitPlan", benefitPlanSchema);
