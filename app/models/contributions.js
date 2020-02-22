const mongoose = require("mongoose");

const contributionSchema = new mongoose.Schema(
  {
    status: {
      type: String
    },
    OOP: {
      amount: { type: Number, defaultValue: 0 },
      invoice: { type: Object },
      products: { type: Object }
    },
    Copay: {
      amount: { type: Number },
      invoice: { type: Object },
      products: { type: Object }
    },
    Insurance: { type: Object },
    CharityApplied: [{ type: mongoose.Schema.Types.ObjectId }]
  },
  {
    collection: "contributions",
    timestamps: true
  }
);

module.exports = mongoose.model("contribution", contributionSchema);
