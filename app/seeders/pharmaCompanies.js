const pharmaCompanies = require("../models/pharmaCompanies");
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
        _id: ObjectId("100000000001"),
        name: "Apollo Services Inc.",
        products: [
          "313030303030303030303030",
          "323030303030303030303030",
          "333030303030303030303030",
          "343030303030303030303030"
        ],
        programs: ["333330303030303030303030", "223330303030303030303030"]
      }
    ];

    await pharmaCompanies.remove({});
    for (let i = 0; i < options.length; i++) {
      status = await pharmaCompanies.create(options[i]);
      console.log("status", status);
    }

    mongo.disconnectConnection();
  } catch (err) {
    console.log("err", err);
  }
})();
