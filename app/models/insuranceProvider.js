const mongoose = require("mongoose");

const insuranceProviderSchema = new mongoose.Schema(
  {
    providerName: {
      type: String,
      required: true,
      index: true
    },
    isActive: {
      type: Boolean,
      default: false
    },
    insuranceType: { type: String }
  },
  {
    collection: "insuranceProvider",
    timestamps: true
  }
);

module.exports = mongoose.model("insuranceProvider", insuranceProviderSchema);
