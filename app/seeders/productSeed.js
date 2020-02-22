const product = require("../models/product");
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
        _id: ObjectId("100000000000"),
        name: "Drug A",
        pharmaCo: "Pharma A",
        volume: {
          strength: 100,
          quantity: 10
        },
        info:
          "Drug A is created by Pharma A pharmacy to treat people suffering from A."
      },
      {
        _id: ObjectId("200000000000"),
        name: "Drug B",
        pharmaCo: "Pharma B",
        volume: {
          strength: 50,
          quantity: 10
        },
        info:
          "Drug B is created by Pharma B pharmacy to treat people suffering from B."
      },
      {
        _id: ObjectId("300000000000"),
        name: "Drug C",
        pharmaCo: "Pharma C",
        volume: {
          strength: 100,
          quantity: 20
        },
        info:
          "Drug C is created by Pharma C pharmacy to treat people suffering from C."
      },
      {
        _id: ObjectId("400000000000"),
        name: "Drug D",
        pharmaCo: "Pharma D",
        volume: {
          strength: 30,
          quantity: 20
        },
        info:
          "Drug D is created by Pharma D pharmacy to treat people suffering from D."
      }
    ];

    await product.remove({});
    for (let i = 0; i < options.length; i++) {
      status = await product.create(options[i]);
      console.log("status", status);
    }

    mongo.disconnectConnection();
  } catch (err) {
    console.log("err", err);
  }
})();
