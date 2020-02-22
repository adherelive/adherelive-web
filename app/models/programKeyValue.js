const mongoose = require("mongoose");
const collectionName = "programskeyvalues";

const programskeyvalueSchema = new mongoose.Schema(
  {
    _id: false,
    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "program"
    },
    values: {
      type: Object
    }
  },
  {
    collection: collectionName,
    timestamps: true
  }
);

module.exports = mongoose.model("programskeyvalue", programskeyvalueSchema);
