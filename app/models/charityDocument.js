const mongoose = require("mongoose");
const collectionName = "charityDocuments";

const charityDocumentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    documentType: {
      type: String,
      enum: ["Generic", "Charity"],
      required: true
    },
    charities: [{ type: mongoose.Schema.Types.ObjectId, ref: "charity" }]
  },
  {
    collection: collectionName,
    timestamps: true
  }
);

module.exports = mongoose.model("charityDocument", charityDocumentSchema);
