const cityCountry = require("../models/cityCountry");
const Mongo = require("../../libs/mongo");
const cityCountryData = require("./countries.min.json");

(async () => {
  try {
    const mongo = new Mongo();

    var conn = (async function() {
      try {
        const connection = await mongo.getConnection();
      } catch (err) {}
    })();

    await cityCountry.remove({});

    let operations = new Array();

    for (country in cityCountryData) {
      let citiesName = cityCountryData[country].map(city => {
        return { name: city };
      });

      operations.push({
        insertOne: {
          document: { name: country, cities: citiesName }
        }
      });
    }

    const result = await cityCountry.bulkWrite(operations);
    console.log("result", result);
    mongo.disconnectConnection();
  } catch (err) {}
})();
