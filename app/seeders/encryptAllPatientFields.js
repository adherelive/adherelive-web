const userModel = require("../models/user");
const Mongo = require("../../libs/mongo");

const CryptoJS = require("crypto-js");
var ObjectId = require("mongodb").ObjectID;
const getEncryptedValue = plainValue => {
  if (plainValue && plainValue.length > 0)
    return CryptoJS.AES.encrypt(plainValue, "12345").toString();
  else return "";
};
(async () => {
  try {
    const mongo = new Mongo();

    var conn = (async function() {
      try {
        const connection = await mongo.getConnection();
      } catch (err) {}
    })();
    let allPatients = await userModel.find({ category: "patient" });

    for (var i = 0; i < allPatients.length; i++) {
      (async function(patient, index) {
        console.log("patient id and name: ", patient._id, patient.name);
        let random_string = "";
        for (let i = 0; i < 5; i++) {
          random_ascii = Math.floor(Math.random() * 25 + 65);
          random_string += String.fromCharCode(random_ascii);
        }
        let patient_name = getEncryptedValue(patient.name);
        let patient_email = getEncryptedValue(patient.email);
        console.log("encr: ", patient_name, patient_email);
        let patient_contactNo = {
          countryCode: getEncryptedValue("+91"),
          phoneNumber: getEncryptedValue(
            Math.ceil(Math.random() * 1011123111).toString()
          ),
          verified: false
        };

        let patient_tempContactNo = {
          countryCode: "",
          phoneNumber: ""
        };

        let patient_contacts = {
          relatives: {
            name: "",
            contactNo: {
              countryCode: "",
              phoneNumber: ""
            },
            relation: "Parent"
          },
          emergencyContact: {
            name: "",
            contactNo: {
              countryCode: "",
              phoneNumber: ""
            }
          },
          useRelativeAsEmergencyContact: false
        };
        let patient_homeAddress = {
          addressLine1: "",
          addressLine2: "",
          zipCode:
            patient.homeAddress && patient.homeAddress.zipCode
              ? patient.homeAddress.zipCode
              : "",
          country: ObjectId("5cd2c0f47288f000587a199b"),
          city: ObjectId("5cd2c0f47288f000587a199f")
        };

        let updatePatient = await userModel.findOneAndUpdate(
          { _id: patient._id },
          {
            $set: {
              name: patient_name,
              email: patient_email,
              contactNo: patient_contactNo,
              contacts: patient_contacts,
              homeAddress: patient_homeAddress,
              tempContactNo: patient_tempContactNo
            }
          },
          {
            new: true
          }
        );
      })(allPatients[i], i);
    }
  } catch (err) {
    console.log("Errrrrr: ", err);
  }
})();
