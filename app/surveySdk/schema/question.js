const mongoose = require("mongoose");
const collectionName = "questions";
const questionTypeEnum = ["TEXT", "STAR", "RADIO", "CHECKBOX"];
const questionSchema = new mongoose.Schema(
  {
    statement: { type: String, requried: true },
    options: [
      {
        id: { type: String },
        value: { type: String },
        _id: false
      }
    ],
    type: { type: String, enum: questionTypeEnum }
  },
  {
    timestamp: true,
    collection: collectionName
  }
);

module.exports = mongoose.model("question", questionSchema);
