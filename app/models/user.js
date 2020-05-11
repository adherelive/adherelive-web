const mongoose = require("mongoose");
const { getDecryptedValue } = require("../services/user/helper");
const collectionName = "users";
const USER_STATUS = {
  ENROLLED: "ENROLLED",
  DISCHARGED: "DISCHARGED",
  INACTIVE: "INACTIVE",
  DROPPED: "DROPPED"
};

function getName(name) {
  if (this.category === "patient") {
    let decryptedName = getDecryptedValue(name);
    return decryptedName;
  } else return name;
}

function getContactNum(val) {
  if (this.category === "patient") {
    const { verified, countryCode, phoneNumber } = val || {};
    return {
      verified,
      countryCode: getDecryptedValue(countryCode),
      phoneNumber: getDecryptedValue(phoneNumber)
    };
  } else return val;
}

function getTempContactNum(val) {
  if (this.category === "patient") {
    const { otp, countryCode, phoneNumber } = val || {};
    return {
      otp,
      countryCode: getDecryptedValue(countryCode),
      phoneNumber: getDecryptedValue(phoneNumber)
    };
  } else return val;
}

function getHomeAddress(val) {
  if (this.category === "patient") {
    const { addressLine1, addressLine2, zipCode, city, country } = val || {};
    return {
      addressLine1: getDecryptedValue(addressLine1),
      addressLine2: getDecryptedValue(addressLine2),
      zipCode,
      city,
      country
    };
  } else {
    return val;
  }
}

function getContacts(val) {
  if (this.category === "patient") {
    const {
      relatives: {
        name: relName,
        relation,
        contactNo: {
          countryCode: relCountryCode,
          phoneNumber: relPhoneNumber
        } = {}
      } = {},
      useRelativeAsEmergencyContact,
      emergencyContact: {
        name: emName,
        contactNo: {
          countryCode: emCountryCode,
          phoneNumber: emPhoneNumber
        } = {}
      } = {}
    } = val || {};
    return {
      relatives: {
        relation,
        name: getDecryptedValue(relName),
        contactNo: {
          countryCode: getDecryptedValue(relCountryCode),
          phoneNumber: getDecryptedValue(relPhoneNumber)
        }
      },
      useRelativeAsEmergencyContact,
      emergencyContact: {
        name: getDecryptedValue(emName),
        contactNo: {
          countryCode: getDecryptedValue(emCountryCode),
          phoneNumber: getDecryptedValue(emPhoneNumber)
        }
      }
    };
  } else {
    return val;
  }
}

const calendar = new mongoose.Schema(
  {
    calendarId: {
      type: String
    },
    calendarAccessToken: {
      type: String
    },
    calendarRefreshToken: {
      type: String
    },
    scope: {
      type: [String]
    },
    accountId: {
      type: String
    },
    providerName: {
      type: String
    },
    profileId: {
      type: String
    },
    profileName: {
      type: String
    }
  },
  { _id: false }
);

const address = new mongoose.Schema(
  {
    addressLine1: {
      type: String
    },
    addressLine2: {
      type: String
    },
    zipCode: {
      type: String
    },
    city: {
      type: mongoose.Schema.Types.ObjectId
    },
    country: {
      type: mongoose.Schema.Types.ObjectId
    }
  },
  { _id: false }
);

const insurance = new mongoose.Schema(
  {
    providers: { type: [mongoose.Schema.Types.ObjectId] },
    data: { type: Object }
  },
  { _id: false }
);

const work = new mongoose.Schema(
  {
    organizationName: { type: String },
    speciality: { type: mongoose.Schema.Types.ObjectId, ref: "speciality" },
    officeAddress: address,
    licenseNumber: { type: String },
    services: { type: String },
    about: { type: String }
  },
  { _id: false }
);

const contactNo = new mongoose.Schema(
  {
    countryCode: { type: String },
    phoneNumber: { type: String, unique: true, sparse: true },
    verified: { type: Boolean, default: false }
  },
  { _id: false }
);

const tempContactNo = new mongoose.Schema(
  {
    countryCode: { type: String },
    phoneNumber: { type: String, sparse: true },
    otp: { type: Number }
  },
  { _id: false }
);

const contacts = new mongoose.Schema(
  {
    relatives: {
      _id: false,
      name: { type: String },
      contactNo: {
        _id: false,
        countryCode: { type: String },
        phoneNumber: { type: String }
      },
      relation: { type: String, enum: ["Parent", "Spouse", "Guardian"] }
    },
    useRelativeAsEmergencyContact: { type: Boolean, default: false },
    emergencyContact: {
      _id: false,
      name: { type: String },
      contactNo: {
        _id: false,
        countryCode: { type: String },
        phoneNumber: { type: String }
      }
    }
  },
  {
    _id: false
  }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      get: getName
    },
    profilePicLink: {
      type: String
    },
    code: {
      type: String,
      unique: true,
      index: true,
      sparse: true
    },
    nationality: {
      type: mongoose.Schema.Types.ObjectId
    },
    homeAddress: { type: address, get: getHomeAddress },
    programId: [{ type: mongoose.Schema.Types.ObjectId, ref: "program" }],
    visitingHospitals: [
      { type: mongoose.Schema.Types.ObjectId, ref: "hospital" }
    ],
    category: {
      required: true,
      type: String,
      enum: [
        "doctor",
        "patient",
        "careCoach",
        "programAdmin",
        "superAdmin",
        "charityAdmin",
        "pharmacyAdmin"
      ],
      index: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      get: getName
      // match: [
      //   /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/,
      //   "Please fill a valid email address"
      // ]
      //https://emailregex.com/  General Email Regex (RFC 5322 Official Standard)
    },
    loginEmail: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    hashContactNo: {
      type: String,
      unique: true,
      index: true
    },
    contactNo: { type: contactNo, get: getContactNum },
    tempContactNo: { type: tempContactNo, get: getTempContactNum },
    calendar: calendar,
    password: {
      type: String
    },
    insurance: insurance,
    dob: { type: Date },
    referralDate: { type: Date },
    segmentation: { type: String },
    education: { type: String },
    risk: { type: String },
    height: { type: String },
    weight: { type: String },
    therapyInitiationDate: { type: Date },
    gender: { type: String, enum: ["M", "F"] },
    work: work,
    pharmacy: { type: mongoose.Schema.Types.ObjectId },
    isProfileCompleted: { type: Boolean, default: false },
    isConsentFormUploaded: { type: Boolean, default: false },
    isIdProofUploaded: { type: Boolean, default: false },
    settings: {
      _id: false,
      isCalendarSynced: { type: Boolean, default: false },
      preferences: {
        _id: false,
        smsAlerts: { type: Boolean, default: true },
        emailAlerts: { type: Boolean, default: true },
        pushAlerts: { type: Boolean, default: true },
        reminderAlerts: { type: Boolean, default: true }
      }
    },
    contacts: { type: contacts, get: getContacts },
    documents: {
      type: Object
    },
    status: {
      type: String,
      enum: [
        USER_STATUS.ENROLLED,
        USER_STATUS.DISCHARGED,
        USER_STATUS.INACTIVE,
        USER_STATUS.DROPPED
      ],
      default: USER_STATUS.INACTIVE
    },
    dropped: {
      _id: false,
      date: { type: Date },
      causality: { type: String },
      reason: { type: String },
      comment: { type: String }
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    },
    charity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "charity"
    },
    pharmacy: {
      type: mongoose.Schema.Types.ObjectId
    },
    isBenefitsApplicable: { type: Boolean, default: false },
    isBenefitDocumentsRequired: { type: Boolean, default: false }
  },
  {
    collection: collectionName,
    timestamps: true
  }
);

module.exports = mongoose.model("user", userSchema);
