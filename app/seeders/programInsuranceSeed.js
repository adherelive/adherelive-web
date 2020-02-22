const program = require("../models/program");
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

    // let operations = new Array();

    // for (country in cityCountryData) {
    //   let citiesName = cityCountryData[country].map(city => {
    //     return { name: city };
    //   });

    //   operations.push({
    //     insertOne: {
    //       document: { name: country, cities: citiesName }
    //     }
    //   });
    // }

    // const result = await cityCountry.bulkWrite(operations);

    const insuranceData = [
      {
        providerName: "NSSF",
        isActive: true
      },
      {
        providerName: "MOH",
        isActive: true
      },
      {
        providerName: "Lebanese Army",
        isActive: true
      },
      {
        providerName: "ISF",
        isActive: true
      }
    ];
    let result = await program.updateOne(
      { _id: "333330303030303030303030" },
      { $set: { insuranceProviders: insuranceData } }
    );
    console.log("result", result);
    mongo.disconnectConnection();
  } catch (err) {}
})();
