const cityCountry = require("../models/cityCountry");
const Mongo = require("../../libs/mongo");
const countryPharmacyData = require("./country-city-pharmacy.json");

(async () => {
  try {
    const mongo = new Mongo();

    var conn = (async function() {
      try {
        const connection = await mongo.getConnection();
      } catch (err) {}
    })();

    //await cityCountry.remove({});

    let operations = new Array();

    for (country in countryPharmacyData) {
      let pharmacyName = countryPharmacyData[country]["pharmacies"].map(
        pharmacy => {
          return { name: pharmacy };
        }
      );

      operations.push({
        updateOne: {
          filter: { name: country },
          update: {
            $set: {
              pharmacies: pharmacyName
            }
          }
        }
      });
    }
    const result = await cityCountry.bulkWrite(operations);
    console.log("result", result);
    mongo.disconnectConnection();
  } catch (err) {
    console.log("Err: ", err);
  }
})();
