const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true
    },
    countryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cityCountry"
    },
    cityId: {
      type: mongoose.Schema.Types.ObjectId
    },
    contactNo: {
      _id: false,
      countryCode: { type: String },
      phoneNumber: { type: String, unique: true, sparse: true }
    }
  },
  {
    collection: "hospitals",
    timestamps: true
  }
);

module.exports = mongoose.model("hospital", hospitalSchema);
