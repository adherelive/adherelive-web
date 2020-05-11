const question = require("../surveySdk/schema/question");
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
        statement: "what is supernova?",
        options: [],
        type: "TEXT"
      },
      {
        statement: "when was supernova found??",
        options: [
          {
            id: "a",
            value: "1991"
          },
          {
            id: "b",
            value: "1990"
          },
          {
            id: "c",
            value: "1978"
          }
        ],
        type: "RADIO"
      },
      {
        statement: "when was supernova found??",
        options: [
          {
            id: "a",
            value: "1991"
          },
          {
            id: "b",
            value: "1990"
          },
          {
            id: "c",
            value: "1978"
          }
        ],
        type: "CHECKBOX"
      }
    ];

    await question.remove({});
    for (let i = 0; i < options.length; i++) {
      status = await question.create(options[i]);
      console.log(status);
    }

    mongo.disconnectConnection();
  } catch (err) {}
})();
