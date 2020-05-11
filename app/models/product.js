const mongoose = require("mongoose");
const collectionName = "products";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String
    },
    pharmaCo: { type: String },
    volume: {
      _id: false,
      strength: { type: Number },
      quantity: { type: Number }
    },
    info: { type: String }
  },
  {
    collection: collectionName,
    timestamps: true
  }
);

module.exports = mongoose.model("product", productSchema);
