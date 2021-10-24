const { SURVEY_TEMPLATE } = require("../surveySdk");

export const preparePatientSurveyMailData = async data => {
  const { careCoachName, templateId, surveyId, userName } = data;
  const preparedData = {};
  const surveyTemplateDetail = await SURVEY_TEMPLATE({ _id: templateId }).get();
  const {
    title = "",
    questions = [],
    description = "",
    time_to_complete = ""
  } = surveyTemplateDetail[0];
  const totalQuestion = questions.length;
  preparedData.UserName = userName;
  preparedData.mainBodyText = `${careCoachName} invited you to Answer the following Survey`;
  preparedData.surveyTitle = title;
  preparedData.surveyDetail = `${totalQuestion} Questions. ${time_to_complete} to complete`;
  preparedData.surveyDescription = `${description}`;
  preparedData.link = `${process.config.WEB_URL}/survey/${surveyId}`;
  preparedData.buttonText = "Take Survey";
  preparedData.host = process.config.APP_URL;
  preparedData.contactTo = "your care coach";
  return preparedData;
};
