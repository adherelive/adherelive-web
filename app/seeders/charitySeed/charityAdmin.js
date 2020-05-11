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
        _id: ObjectId("111000000001"),
        name: "Charity Admin 1",
        email: "ca1@mailinator.com",
        loginEmail: SHA256("ca1@mailinator.com").toString(),
        category: "charityAdmin",
        hashContactNo: "1234568",
        password: await bcrypt.hash("Password@123", salt),
        charity: "313030303030303030303031",
        isProfileCompleted: true
      },
      {
        _id: ObjectId("111000000002"),
        name: "Charity Admin 2",
        email: "ca2@mailinator.com",
        loginEmail: SHA256("ca2@mailinator.com").toString(),
        category: "charityAdmin",
        hashContactNo: "1234569",
        password: await bcrypt.hash("Password@123", salt),
        charity: "313030303030303030303031",
        isProfileCompleted: true
      },
      {
        _id: ObjectId("111000000003"),
        name: "Charity Admin 3",
        email: "ca3@mailinator.com",
        hashContactNo: "1234570",
        loginEmail: SHA256("ca3@mailinator.com").toString(),
        category: "charityAdmin",
        password: await bcrypt.hash("Password@123", salt),
        charity: "323030303030303030303031",
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
