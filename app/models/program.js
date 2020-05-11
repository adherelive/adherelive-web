const mongoose = require("mongoose");
const collectionName = "programs";

const patients = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    },
    patients: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "user",
      default: []
    }
  },
  { _id: false }
);

const patientAndHospital = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: "hospital" }
});

// const insuranceProviders = new mongoose.Schema({
//   providerName: { type: String },
//   isActive: { type: Boolean },
//   insuranceType: { type: String }
// });

const programSchema = new mongoose.Schema(
  {
    name: {
      type: String
    },
    programCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    pharmaCo: { type: mongoose.Schema.Types.ObjectId, ref: "pharmaCompanies" },
    programCode: { type: String, unique: true },
    targetLocation: {
      _id: false,
      city: { type: String },
      country: { type: String }
    },
    description: { type: String },
    insuranceProviders: [
      { type: mongoose.Schema.Types.ObjectId, ref: "insuranceProvider" }
    ],
    activeFrom: { type: Date, default: Date.now },
    expiresOn: { type: Date },
    products: { type: [mongoose.Schema.Types.ObjectId] },
    accessLevel: {
      type: String,
      enum: ["ALL_USERS", "CARE_COACHES", "DOCTORS"]
    },
    doctors: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        patients: [patientAndHospital]
      }
    ],
    careCoaches: [patients],
    isBenefitsApplicable: { type: Boolean, default: true },
    isBenefitDocumentsRequired: { type: Boolean, default: true }
  },
  {
    collection: collectionName,
    timestamps: true
  }
);

module.exports = mongoose.model("program", programSchema);
