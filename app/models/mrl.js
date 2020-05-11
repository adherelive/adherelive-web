const mongoose = require("mongoose");

const mrlSchema = new mongoose.Schema(
  {
    mrlCode: { type: String },
    generatedOn: { type: Date },
    generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    mrlDocs: { type: Object }
  },
  {
    collection: "mrls",
    timestamps: true
  }
);

module.exports = mongoose.model("mrl", mrlSchema);
