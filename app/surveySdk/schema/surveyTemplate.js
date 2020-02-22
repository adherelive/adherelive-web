const mongoose = require("mongoose");
const collectioName = "surveyTemplate";
const { String, ObjectId, Array } = mongoose.Schema.Types;

const surveyTemplateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, unique: true },
    time_to_complete: { type: String, required: true },
    questions: [{ type: ObjectId, ref: "question" }],
    programs: [{ type: ObjectId, ref: "program" }],
    category: { type: String, default: "" }
  },
  {
    timestamps: true,
    collection: collectioName
  }
);

module.exports = mongoose.model("surveyTemplate", surveyTemplateSchema);
