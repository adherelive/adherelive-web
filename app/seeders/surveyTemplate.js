const surveyTemplate = require("../surveySdk/schema/surveyTemplate");
const questionsModel = require("../surveySdk/schema/question");
const survey = require("../surveySdk/schema/survey");
const Mongo = require("../../libs/mongo");

const getquestionsforseed = async () => {
  const questions = await questionsModel.find({}, { id: "_id" });
  return questions;
};

(async () => {
  try {
    const mongo = new Mongo();

    var conn = (async function() {
      try {
        const connection = await mongo.getConnection();
      } catch (err) {}
    })();
    const questions = await getquestionsforseed();
    let questionIds = [];
    questions.forEach(question => {
      const { _id: questionId } = question;
      questionIds.push(questionId);
    });
    const options = [
      {
        title: "NO supernova Survey 88",
        description: "survey related to supernova99",
        questions: questionIds,
        programs: [
          "333330303030303030303030",
          "223330303030303030303030",
          "333220303030303030303030"
        ],
        category: "supernova",
        time_to_complete: "12 min"
      },
      {
        title: "NO supernova Survey 66",
        description: "survey related to supernova77",
        questions: questionIds,
        programs: [
          "333330303030303030303030",
          "223330303030303030303030",
          "333220303030303030303030"
        ],
        category: "supernova",
        time_to_complete: "12 min"
      }
    ];
    await surveyTemplate.remove({});
    await survey.remove({});
    let status = await surveyTemplate.create(options);
    console.log("status===>", status);
    mongo.disconnectConnection();
  } catch (err) {}
})();
