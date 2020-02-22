const mongoose = require("mongoose");
const collectionName = "survey";
const { Date, String, Array, ObjectId, Mixed } = mongoose.Schema.Types;
const STATUS_ENUM = ["INPROGRESS", "COMPLETED"];
const CATEGORY_ENUM = [
  "doctor",
  "patient",
  "programAdmin",
  "careCoach",
  "superAdmin"
];

const responseSchema = new mongoose.Schema({
  responseId: { type: ObjectId },
  questionId: { type: ObjectId, ref: "question" },
  response: { type: Mixed, default: "" }
});

const surveySchema = new mongoose.Schema(
  {
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    status: { type: String, enum: STATUS_ENUM },
    surveyCreator: {
      id: { type: ObjectId, ref: "user" },
      category: { type: String, enum: CATEGORY_ENUM },
      _id: false
    },
    participants: [
      {
        participantId: { type: ObjectId, ref: "user" },
        participantCategory: { type: String, enum: CATEGORY_ENUM },
        status: { type: String, enum: STATUS_ENUM },
        response: [responseSchema],
        surveySentDate: { type: Date },
        completedOn: { type: Date },
        _id: false
      }
    ],
    template: {
      templateId: { type: ObjectId, ref: "surveyTemplate" },
      title: { type: String, required: true },
      description: { type: String, required: true },
      time_to_complete: { type: String, required: true },
      questions: [{ type: ObjectId, ref: "question" }],
      category: { type: String, default: "" },
      _id: false
    },
    program: { type: ObjectId, ref: "program" }
  },
  {
    timestamps: true,
    collection: collectionName
  }
);

module.exports = mongoose.model("Survey", surveySchema);
