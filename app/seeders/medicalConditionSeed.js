const medicalCondition = require("../models/medicalCondition");
const Mongo = require("../../libs/mongo");
var ObjectId = require("mongodb").ObjectID;

(async () => {
  try {
    const mongo = new Mongo();

    var conn = (async function() {
      try {
        const connection = await mongo.getConnection();
      } catch (err) {}
    })();
    const options = [
      {
        userId: ObjectId("353535303030303030303030"),
        basicCondition: {
          chiefComplaint: "Fever"
        }
      },
      {
        userId: ObjectId("222220303030303030303030"),
        basicCondition: {
          chiefComplaint: "Flu"
        }
      },
      {
        userId: ObjectId("888880303030303030303030"),
        basicCondition: {
          chiefComplaint: "Cancer"
        }
      }
    ];

    await medicalCondition.remove({});
    for (let i = 0; i < options.length; i++) {
      status = await medicalCondition.create(options[i]);
    }

    mongo.disconnectConnection();
  } catch (err) {}
})();
