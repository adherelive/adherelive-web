const mongoose = require("mongoose");
const collectionName = "pharmaCompanies";
const pharmaCompaniesSchema = new mongoose.Schema(
  {
    name: {
      type: String
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }],
    programs: [{ type: mongoose.Schema.Types.ObjectId, ref: "program" }]
  },
  {
    collection: collectionName,
    timestamps: true
  }
);
module.exports = mongoose.model("pharmaCompanies", pharmaCompaniesSchema);
