const userModel = require("../models/user");
const Mongo = require("../../libs/mongo");

const SHA256 = require("crypto-js/sha256");
var ObjectId = require("mongodb").ObjectID;
const CryptoJS = require("crypto-js");

const getDecryptedValue = encryptedValue => {
  console.log("to decrypt: ", encryptedValue);
  if (encryptedValue && encryptedValue.length > 0) {
    let decryptValue = CryptoJS.AES.decrypt(encryptedValue, "12345").toString(
      CryptoJS.enc.Utf8
    );
    console.log("decrypt val: ", decryptValue);
    return decryptValue;
  } else return "";
};
(async () => {
  try {
    const mongo = new Mongo();

    var conn = (async function() {
      try {
        const connection = await mongo.getConnection();
      } catch (err) {}
    })();
    let allUsers = await userModel.find({
      category: { $in: ["patient", "doctor", "careCoach"] }
    });

    for (var i = 0; i < allUsers.length; i++) {
      (async function(user, index) {
        let { email, category } = user;
        console.log("user email: ", email);
        if (category === "patient") {
          email = getDecryptedValue(email);
        }

        let loginEmail = SHA256(email.toLowerCase()).toString();

        let updateUser = await userModel.findOneAndUpdate(
          { _id: user._id },
          {
            $set: {
              loginEmail
            }
          },
          {
            new: true
          }
        );
      })(allUsers[i], i);
    }
  } catch (err) {
    console.log("Errrrrr: ", err);
  }
})();
