const program = require("../models/program");
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
      // {
      //   _id: ObjectId("110000000000"),
      //   name: "Program A",
      //   pharmaCo: "Pharma A",
      //   programCreatedBy: "323232303030303030303030",
      //   targetLocation: {
      //     city: "Delhi",
      //     country: "India"
      //   },
      //   description: "This Program is by Pharma A",
      //   activeFrom: new Date(Date.now()).toISOString(),
      //   expiresOn: new Date(Date.now() + 30 * 86400000).toISOString(),
      //   products: ["313030303030303030303030"],
      //   accessLevel: "ALL_USERS",
      //   doctors: [{ id: "333333303030303030303030" }]
      // },
      // {
      //   _id: ObjectId("220000000000"),
      //   name: "Program B",
      //   pharmaCo: "Pharma B",
      //   programCreatedBy: "323232303030303030303030",
      //   targetLocation: {
      //     city: "Mumbai",
      //     country: "India"
      //   },
      //   description: "This Program is by Pharma B",
      //   activeFrom: new Date(Date.now()).toISOString(),
      //   expiresOn: new Date(Date.now() + 30 * 86400000).toISOString(),
      //   products: ["323030303030303030303030"],
      //   accessLevel: "ALL_USERS",
      //   doctors: [{ id: "333333303030303030303030" }]
      // },
      {
        _id: ObjectId("330000000000"),
        name: "Program C",
        pharmaCo: "Pharma C",
        programCode: "PROG-C",
        programCreatedBy: "323232303030303030303030",
        targetLocation: {
          city: "Kolkata",
          country: "India"
        },
        description: "This Program is by Pharma C",
        activeFrom: new Date(Date.now()).toISOString(),
        expiresOn: new Date(Date.now() + 30 * 86400000).toISOString(),
        products: [
          "333030303030303030303030",
          "323030303030303030303030",
          "313030303030303030303030"
        ],
        accessLevel: "ALL_USERS",
        careCoaches: [
          {
            id: "343434303030303030303030",
            patients: []
          }
        ]
      },
      // {
      //   _id: ObjectId("440000000000"),
      //   name: "Program D",
      //   pharmaCo: "Pharma D",
      //   programCreatedBy: "323232303030303030303030",
      //   targetLocation: {
      //     city: "Delhi",
      //     country: "India"
      //   },
      //   description: "This Program is by Pharma D",
      //   activeFrom: new Date(Date.now()).toISOString(),
      //   expiresOn: new Date(Date.now() + 30 * 86400000).toISOString(),
      //   products: ["343030303030303030303030"],
      //   accessLevel: "ALL_USERS",
      //   doctors: [{ id: "333333303030303030303030" }]
      // },
      {
        _id: ObjectId("223330303030303030303030"),
        name: "E Program",
        pharmaCo: "Pharma C",
        programCode: "PROG-E",
        programCreatedBy: "323232303030303030303030",
        targetLocation: {
          city: "Pune",
          country: "India"
        },
        description: "This Program is by Pharma C",
        activeFrom: new Date(Date.now()).toISOString(),
        expiresOn: new Date(Date.now() + 30 * 86400000).toISOString(),
        products: ["333030303030303030303030"],
        accessLevel: "ALL_USERS",
        careCoaches: [
          {
            id: "343434303030303030303030",
            patients: []
          }
        ]
      },
      {
        _id: ObjectId("333220303030303030303030"),
        name: "New Program",
        pharmaCo: "Pharma C",
        programCode: "PROG-NEW",
        programCreatedBy: "323232303030303030303030",
        targetLocation: {
          city: "Dehradun",
          country: "India"
        },
        description: "This Program is by Pharma C",
        activeFrom: new Date(Date.now()).toISOString(),
        expiresOn: new Date("12-06-2016").toISOString(),
        products: ["333030303030303030303030"],
        accessLevel: "ALL_USERS",
        careCoaches: [
          {
            id: "343434303030303030303030",
            patients: []
          }
        ]
      }
    ];

    await program.remove({});
    for (let i = 0; i < options.length; i++) {
      status = await program.create(options[i]);
      console.log("status", status);
    }

    mongo.disconnectConnection();
  } catch (err) {
    console.log("err", err);
  }
})();
