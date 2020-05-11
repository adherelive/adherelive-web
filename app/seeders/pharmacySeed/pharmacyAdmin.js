const bcrypt = require("bcrypt");
const user = require("../../models/user");
const Mongo = require("../../../libs/mongo");
const uuid = require("uuid/v4");
const SHA256 = require("crypto-js/sha256");
var ObjectId = require("mongodb").ObjectID;

(async () => {
  try {
    const mongo = new Mongo();

    var conn = (async function() {
      try {
        const connection = await mongo.getConnection();
      } catch (err) {}
    })();

    const salt = await bcrypt.genSalt(Number(process.config.saltRounds));
    const options = [
      {
        _id: ObjectId("211000000001"),
        name: "Pharmacy Admin 1",
        email: "pa1@mailinator.com",
        loginEmail: SHA256("pa1@mailinator.com").toString(),
        category: "pharmacyAdmin",
        password: await bcrypt.hash("Password@123", salt),
        isProfileCompleted: true
      },
      {
        _id: ObjectId("311000000002"),
        name: "Pharmacy Admin 2",
        email: "pa2@mailinator.com",
        loginEmail: SHA256("ca2@mailinator.com").toString(),
        category: "pharmacyAdmin",
        password: await bcrypt.hash("Password@123", salt),
        isProfileCompleted: true
      },
      {
        _id: ObjectId("411000000003"),
        name: "Pharmacy Admin 3",
        email: "pa3@mailinator.com",
        loginEmail: SHA256("pa3@mailinator.com").toString(),
        category: "pharmacyAdmin",
        password: await bcrypt.hash("Password@123", salt),
        isProfileCompleted: true
      }
    ];

    let status;
    for (let i = 0; i < options.length; i++) {
      status = await user.create(options[i]);
    }
    mongo.disconnectConnection();
  } catch (err) {
    console.log("ERRR: ", err);
  }
})();
