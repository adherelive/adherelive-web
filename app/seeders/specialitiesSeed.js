const Speciality = require("../models/speciality");
const Mongo = require("../../libs/mongo");
const Config = require("../../config/config");
Config();
(async () => {
  try {
    const mongo = new Mongo();
    var conn = (async function() {
      try {
        const connection = await mongo.getConnection();
      } catch (err) {
        console.log("errr in connection :::", err);
      }
    })();
    const options = [
      {
        specialityName: "Cardiologist"
      },
      {
        specialityName: "Dentist"
      },
      {
        specialityName: "Neurologist"
      },
      {
        specialityName: "Radiologist"
      }
    ];
    await Speciality.remove({});
    for (let i = 0; i < options.length; i++) {
      let status = await Speciality.create(options[i]);
    }
    mongo.disconnectConnection();
  } catch (err) {
    console.log("log=====err", err);
  }
})();
