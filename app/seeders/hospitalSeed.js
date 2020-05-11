const hospital = require("../models/hospital");
const cityCountryModel = require("../models/cityCountry");
const Mongo = require("../../libs/mongo");
var ObjectId = require("mongodb").ObjectID;

const getcitiesforseed = async () => {
  const cities = await cityCountryModel.find(
    { "cities.name": "Kabul" },
    { "cities.$._id": "" }
  );
  const cityId = ObjectId(cities[0].cities[0]._id);
  return cityId;
};

const getcountriesforseed = async () => {
  const country = await cityCountryModel.find({ name: "Afghanistan" });
  const countryId = ObjectId(country[0]._id);
  return countryId;
};

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
        name: "Fortis Escorts",
        contactNo: {
          countryCode: "+91",
          phoneNumber: "1234567890"
        },
        countryId: await getcountriesforseed(),
        cityId: await getcitiesforseed()
      },
      {
        name: "Moolchand Hospital",
        contactNo: {
          countryCode: "+91",
          phoneNumber: "1234567895"
        },
        countryId: await getcountriesforseed(),
        cityId: await getcitiesforseed()
      }
    ];
    await hospital.remove({});
    for (let i = 0; i < options.length; i++) {
      let status = await hospital.create(options[i]);
      console.log("status", status);
    }
    mongo.disconnectConnection();
  } catch (err) {}
})();
