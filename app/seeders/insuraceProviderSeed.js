const insuranceProvider = require("../models/insuranceProvider");
const Mongo = require("../../libs/mongo");

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
        providerName: "NSSF",
        insuranceType: "Government",
        isActive: true
      },
      {
        providerName: "MOH",
        insuranceType: "Private",
        isActive: true
      },
      {
        providerName: "Lebanese Army",
        insuranceType: "Government",
        isActive: true
      },
      {
        providerName: "ISF",
        insuranceType: "Private",
        isActive: true
      }
    ];
    await insuranceProvider.remove({});
    for (let i = 0; i < options.length; i++) {
      let status = await insuranceProvider.create(options[i]);
      console.log("status", status);
    }
    mongo.disconnectConnection();
  } catch (err) {}
})();
