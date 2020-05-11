const mongoose = require("mongoose");

// const invitee = new mongoose.Schema(
//   {
//     userCategory: {
//       type: String
//     },
//     email: {
//       type: String,
//       match: [
//         /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
//         "Please fill a valid email address"
//       ]
//     },
//     contactNo: {
//       _id: false,
//       countryCode: { type: String },
//       phoneNumber: { type: String }
//     },
//     programId: {
//       type: [mongoose.Schema.Types.ObjectId],
//       ref: "Program"
//     },
//     name: { type: String },
//     organizationName: { type: String },
//     speciality: { type: String },
//     licenseNumber: { type: String }
//   },
//   { _id: false }
// );

const eventSchema = new mongoose.Schema(
  {
    eventCategory: {
      required: true,
      type: String,
      index: true,
      enum: [
        "invitation",
        "forgotPassword",
        "appointment",
        "reminder",
        "adverse",
        "medication-reminder"
      ]
    },
    participantOne: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      index: true,
      required: true
    },
    participantTwo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      sparse: true
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date
    },
    description: {
      type: String
    },
    reason: {
      type: String
    },
    link: {
      type: String,
      sparse: true
    },
    status: {
      type: String,
      enum: ["pending", "cancelled", "completed", "expired"],
      default: "pending"
    },
    details: {
      type: Object
    }
  },
  {
    collection: "events",
    timestamps: true
  }
);

module.exports = mongoose.model("event", eventSchema);
