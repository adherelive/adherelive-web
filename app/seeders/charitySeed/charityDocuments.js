const Mongo = require("../../../libs/mongo");
var ObjectId = require("mongodb").ObjectID;
const charityDocumentModel = require("../../models/charityDocument");
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
        _id: ObjectId("100000000011"),
        name: "Form 16",
        documentType: "Generic"
      },
      {
        _id: ObjectId("100000000021"),
        name: "Address Proof",
        documentType: "Generic"
      },
      {
        _id: ObjectId("100000000031"),
        name: "Dubai Cares Document",
        documentType: "Charity",
        charities: ["313030303030303030303031"]
      }
    ];

    await charityDocumentModel.remove({});
    for (let i = 0; i < options.length; i++) {
      status = await charityDocumentModel.create(options[i]);
    }
    mongo.disconnectConnection();
  } catch (err) {
    console.log("ERRR: ", err);
  }
})();
