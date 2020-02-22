const mongoose = require("mongoose");

const CATEGORY = [
  "doctor",
  "patient",
  "programAdmin",
  "careCoach",
  "superAdmin"
];

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    participants: { type: Object },
    timeToRead: { type: String, required: true },
    views: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    url: { type: String }
  },
  {
    collection: "articles",
    timestamps: true
  }
);

module.exports = mongoose.model("article", articleSchema);
