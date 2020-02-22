const charity = require("../../models/charity");
const Mongo = require("../../../libs/mongo");
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
        _id: ObjectId("100000000001"),
        name: "Dubai Cares",
        charityAdmin: {
          "313131303030303030303031": { level: "Level-1" },
          "313131303030303030303032": { level: "Level-2", uploadPO: true }
        }
      },
      {
        _id: ObjectId("200000000001"),
        name: "Emirates Red Crescent",
        charityAdmin: {
          "313131303030303030303033": { level: "Level-1", uploadPO: true }
        }
      },
      {
        _id: ObjectId("300000000001"),
        name: "Dar el Ber Society"
      },
      {
        _id: ObjectId("400000000001"),
        name: "Make A Wish UAE"
      }
    ];

    await charity.remove({});
    for (let i = 0; i < options.length; i++) {
      status = await charity.create(options[i]);
      console.log("status", status);
    }

    mongo.disconnectConnection();
  } catch (err) {
    console.log("err", err);
  }
})();
