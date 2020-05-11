const path = require("path");
const CryptoJS = require("crypto-js");

const encryption_decryption_key = process.config.DB_ENCRYPTION_KEY;

export const formatUserData = data => {
  const {
    isProfileCompleted,
    isIdProofUploaded,
    isConsentFormUploaded,
    isBenefitsApplicable,
    isBenefitDocumentsRequired,
    _id,
    category,
    name,
    email,
    homeAddress,
    work,
    settings,
    documents,
    contacts,
    contactNo,
    insurance,
    tempContactNo,
    dob,
    gender,
    profilePicLink,
    programId,
    visitingHospitals,
    status,
    calendar,
    createdAt,
    pharmacy,
    referralDate,
    education,
    segmentation,
    risk,
    height,
    weight,
    therapyInitiationDate,
    nationality,
    charity
  } = data || {};

  const userDp = profilePicLink
    ? `http://${path.join(process.config.IMAGE_HOST, profilePicLink)}`
    : profilePicLink;

  // let decryptedName = name;
  // if (category === "patient") {
  //   decryptedName = getDecryptedValue(name);
  // }

  return {
    basicInfo: {
      _id: _id,
      name,
      category,
      profilePicLink: userDp,
      createdAt
    },
    work,
    personalInfo: {
      contactNo,
      email,
      dob,
      gender,
      contacts,
      tempContactNo,
      homeAddress,
      pharmacy,
      referralDate,
      education,
      segmentation,
      risk,
      height,
      weight,
      therapyInitiationDate,
      nationality
    },
    settings,
    insurance,
    status,
    programId,
    documents,
    visitingHospitals,
    isProfileCompleted,
    isConsentFormUploaded,
    isIdProofUploaded,
    isBenefitsApplicable,
    isBenefitDocumentsRequired,
    calendar,
    charity
  };
};

export const getEncryptedValue = plainValue => {
  console.log("To encr: ", plainValue);
  if (plainValue && plainValue.length > 0) {
    let encryptedValue = CryptoJS.AES.encrypt(
      plainValue,
      encryption_decryption_key
    ).toString();
    console.log("encrypted val: ", encryptedValue);
    return encryptedValue;
  } else return "";
};

export const getDecryptedValue = encryptedValue => {
  //console.log("to decrypt: ", encryptedValue);
  try {
    if (encryptedValue && encryptedValue.length > 0) {
      let decryptValue = CryptoJS.AES.decrypt(
        encryptedValue,
        encryption_decryption_key
      ).toString(CryptoJS.enc.Utf8);
      //console.log("decrypt val: ", decryptValue);
      return decryptValue;
    } else return "";
  } catch (error) {
    console.log(
      "in getDecrypted",
      error,
      encryptedValue,
      encryption_decryption_key
    );
  }
};

export const getAllEncryptedValues = plainObj => {
  let encryptedObj = {};
  for (let key in plainObj) {
    switch (key) {
      case "name":
      case "email": {
        encryptedObj[key] = getEncryptedValue(plainObj[key]);
        break;
      }
      case "contactNo": {
        let { countryCode, phoneNumber, verified } = plainObj[key];
        encryptedObj[key] = {
          countryCode: getEncryptedValue(countryCode),
          phoneNumber: getEncryptedValue(phoneNumber),
          verified
        };
        break;
      }
      case "tempContactNo": {
        let { countryCode, phoneNumber, verified } = plainObj[key];
        encryptedObj[key] = {
          countryCode: getEncryptedValue(countryCode),
          phoneNumber: getEncryptedValue(phoneNumber),
          verified
        };
        break;
      }
      case "homeAddress": {
        const { addressLine1, addressLine2, city, country, zipCode } = plainObj[
          key
        ];

        encryptedObj[key] = {
          addressLine1: getEncryptedValue(addressLine1),
          addressLine2: getEncryptedValue(addressLine2),
          city,
          country,
          zipCode
        };
        break;
      }
      case "contacts": {
        let {
          emergencyContact,
          relatives,
          useRelativeAsEmergencyContact
        } = plainObj[key];
        let {
          name: eName,
          contactNo: { countryCode: eCountryCode, phoneNumber: ePhoneNumber }
        } = emergencyContact;
        let {
          name: rName,
          contactNo: { countryCode: rCountryCode, phoneNumber: rPhoneNumber },
          relation
        } = relatives;

        encryptedObj[key] = {
          emergencyContact: {
            name: getEncryptedValue(eName),
            contactNo: {
              countryCode: getEncryptedValue(eCountryCode),
              phoneNumber: getEncryptedValue(ePhoneNumber)
            }
          },
          relatives: {
            name: getEncryptedValue(rName),
            contactNo: {
              countryCode: getEncryptedValue(rCountryCode),
              phoneNumber: getEncryptedValue(rPhoneNumber)
            },
            relation
          },
          useRelativeAsEmergencyContact
        };
        break;
      }
      default: {
        encryptedObj[key] = plainObj[key];
        break;
      }
    }
  }
  return encryptedObj;
};
