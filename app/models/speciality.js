const mongoose = require("mongoose");

const SpecialitySchema = new mongoose.Schema(
  {
    specialityName: {
      type: String,
      required: true,
      unique: true,
      index: true
    }
  },
  {
    collection: "specialities",
    timestamps: true
  }
);

SpecialitySchema.statics = {};

module.exports = mongoose.model("speciality", SpecialitySchema);
