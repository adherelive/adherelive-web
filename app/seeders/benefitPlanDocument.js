const benefitPlanDocument = require("../models/benefitPlanDocuments");
const Mongo = require("../../libs/mongo");

(async () => {
  try {
    const mongo = new Mongo();

    var conn = (async function() {
      try {
        const connection = await mongo.getConnection();
      } catch (err) {}
    })();

    //await cityCountry.remove({});
    const options = [
      {
        _id: "777770303030303030303037",
        name: "PAN card"
      },
      {
        _id: "777780303030303030303037",
        name: "Passport"
      },
      {
        _id: "777790303030303030303037",
        name: "Residency Proof"
      }
    ];

    await benefitPlanDocument.remove({});
    for (let i = 0; i < options.length; i++) {
      status = await benefitPlanDocument.create(options[i]);
    }

    mongo.disconnectConnection();
  } catch (err) {
    console.log("ERRR: ", err);
  }
})();
