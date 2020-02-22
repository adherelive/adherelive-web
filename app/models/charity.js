const mongoose = require("mongoose");
const collectionName = "charities";
const charitySchema = new mongoose.Schema(
  {
    name: {
      type: String
    },
    charityAdmin: { type: Object },
    shouldCarecoachImpersonate: {
      type: Boolean,
      default: true
    }
  },
  {
    collection: collectionName,
    timestamps: true
  }
);

module.exports = mongoose.model("charity", charitySchema);
