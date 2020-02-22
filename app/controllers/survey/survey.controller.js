import { preparePatientSurveyMailData } from "../../helper/getSurveyEmailTemplateDate";
import {
  USER_CATEGORY,
  NOTIFICATION_VERB,
  EVENT_IS,
  OPTION_TYPE
} from "../../../constant";
import { Parser as Json2csvParser } from "json2csv";

const _ = require("lodash");
const { SURVEY, SURVEY_TEMPLATE, QUESTION } = require("../../surveySdk");
const programServices = require("../../services/program/program.service");
const Log = require("../../../libs/log")("programController");
const Response = require("../../helper/responseFormat");
const { validationResult } = require("express-validator/check");
const rbac = require("../../helper/rbac");
const errMessage = require("../../../config/messages.json").errMessages;
const constants = require("../../../config/constants");
const { Proxy_Sdk, EVENTS } = require("../../proxySdk");
const { NotificationSdk } = require("../../notificationSdk");
const userServices = require("../../services/user/user.service");

const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const PATIENT = "patient";

class SurveyController {
  constructor() {}

  async createSurveyTemplate(req, res) {
    try {
      let error = validationResult(req);
      let response;
      if (!error.isEmpty()) {
        response = new Response(false, 422);
        response.setError(error.mapped());
        return res.status(422).json(response.getResponse());
      }
      if (req.userDetails.exists) {
        const { programId } = req.userDetails.userData;
        if (_.isEmpty(programId)) {
          response = new Response(false, 200);
          response.setError({ message: "Not registered to any program!!" });
          return res.status(200).send(response.getResponse());
        }

        let {
          title,
          description,
          questions,
          programs,
          category,
          time_to_complete
        } = req.body;
        if (_.isString(programs)) {
          programs = [programs];
        }

        let programValidation = await programServices.getPrograms({
          _id: { $in: programs }
        });

        if (_.isEmpty(programValidation)) {
          response = new Response(false, 200);
          response.setError({ message: "invalid program ids" });
          return res.send(response.getResponse());
        }
        let surveyTemplate = await SURVEY_TEMPLATE({
          title,
          description,
          questions,
          category,
          programs,
          time_to_complete
        }).create();
        response = new Response(true, 200);
        response.setData({});
        response.setMessage("survey Template created success fully");
        return res.send(response.getResponse());
      }

      response = new Response(false, 403);
      response.setError(errMessage.COOKIES_NOT_SET);
      return res.status(403).json(response.getResponse());
    } catch (err) {
      let payload;
      switch (err.message) {
        case constants.COOKIES_NOT_SET:
          payload = {
            code: 403,
            error: errMessage.COOKIES_NOT_SET
          };
          break;
        case constants.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE:
          payload = {
            code: 401,
            error: errMessage.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE
          };
          break;
        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
          break;
      }

      if (err.errmsg) {
        let response = new Response(false, 200);
        response.setError({ message: err.errmsg });
        return res.status(200).json(response.getResponse());
      }

      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async listUserSurveyTemplates(req, res) {
    try {
      let error = validationResult(req);
      let response = {};
      if (!error.isEmpty()) {
        response = new Response(false, 422);
        response.setError(error.mapped());
        return res.status(422).json(response.getResponse());
      }
      if (req.userDetails.exists) {
        const { programId } = req.userDetails.userData;
        if (_.isEmpty(programId)) {
          response = new Response(false, 200);
          response.setError({ message: "Not registered to any program!!" });
          return res.status(200).send(response.getResponse());
        }
        let surveyTemplate = await SURVEY_TEMPLATE({
          programId
        }).getDetails();
        if (_.isEmpty(surveyTemplate)) {
          response = new Response(true, 200);
          response.setData({});
          response.setMessage("No survey template found!!");
          return res.send(response.getResponse());
        }
        let surveyTemplateData = {};
        surveyTemplate.map(value => {
          surveyTemplateData[value._id] = value;
          surveyTemplateData[value._id]["templateId"] = value._id;
          delete surveyTemplateData[value._id]["_id"];
        });
        response = new Response(true, 200);
        response.setData({ templates: surveyTemplateData });
        response.setMessage("Survey template(s) found!!");
        return res.send(response.getResponse());
      }

      response = new Response(false, 403);
      response.setError(errMessage.COOKIES_NOT_SET);
      return res.status(403).json(response.getResponse());
    } catch (error) {
      let payload;
      switch (error.message) {
        case constants.COOKIES_NOT_SET:
          payload = {
            code: 403,
            error: errMessage.COOKIES_NOT_SET
          };
          break;
        case constants.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE:
          payload = {
            code: 401,
            error: errMessage.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE
          };
          break;
        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
          break;
      }

      if (error.errmsg) {
        let response = new Response(false, 200);
        response.setError({ message: error.errmsg });
        return res.status(200).json(response.getResponse());
      }

      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async getquestion(req, res) {
    try {
      let response;
      const { id } = req.params;
      if (id || id !== undefined) {
        let surveyDetail = await SURVEY_TEMPLATE({
          _id: id
        }).get();
        let questionsId = [];
        if (surveyDetail.length > 0) {
          const { questions } = surveyDetail[0];
          questionsId = questions;
        }
        const allQuestions = await QUESTION({
          _id: { $in: questionsId }
        }).get();

        response = new Response(true, 200);
        response.setData({
          questions: [...allQuestions]
        });
        return res.send(response.getResponse());
      } else {
        response = new Response(true, 200);
        response.setData({});
        response.setMessage("No questions template found!!");
        return res.send(response.getResponse());
      }
      // console.log('formatData', formatedData, doctorData, hospitalData);
    } catch (error) {
      console.log(error);
      let payload;
      switch (error.message) {
        case constants.COOKIES_NOT_SET:
          payload = {
            code: 403,
            error: errMessage.COOKIES_NOT_SET
          };
          break;
        case constants.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE:
          payload = {
            code: 401,
            error: errMessage.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE
          };
          break;
        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
          break;
      }

      if (error.errmsg) {
        let response = new Response(false, 200);
        response.setError({ message: error.errmsg });
        return res.status(200).json(response.getResponse());
      }

      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async createSurvey(req, res) {
    try {
      let error = validationResult(req);
      let response = {};
      if (!error.isEmpty()) {
        response = new Response(false, 422);
        response.setError(error.mapped());
        return res.status(422).json(response.getResponse());
      }
      if (req.userDetails.exists) {
        const { programId, _id, category, name } = req.userDetails.userData;
        if (_.isEmpty(programId)) {
          response = new Response(false, 200);
          response.setError("Not registered to any program!!");
          return res.status(200).send(response.getResponse());
        }

        const {
          startDate,
          endDate,
          participants,
          template,
          program
        } = req.body;
        // console.log("....................req.body", req.body);
        let status = "INPROGRESS";
        let surveyCreator = {
          id: _id,
          category
        };
        let result = await SURVEY({
          startDate,
          endDate,
          surveyCreator,
          participants,
          template,
          status,
          program
        }).create();
        if (!_.isEmpty(participants)) {
          let participantids = [];
          for (let key in participants) {
            participantids.push(result.participants[key]["participantId"]);
          }
          let userData = await userServices.getBulkUsers(participantids);
          if (userData) {
            userData.map(async value => {
              const {
                personalInfo: { email } = {},
                basicInfo: {
                  _id: participantId,
                  name: ParticipantName = ""
                } = {}
              } = value;
              const mailData = await preparePatientSurveyMailData({
                startDate,
                endDate,
                name,
                templateId: template,
                surveyId: result.id,
                ParticipantName
              });
              const notificationData = {
                data: {
                  _id: result.id,
                  eventCategory: NOTIFICATION_VERB.SURVEY,
                  userId: _id,
                  startDate,
                  endDate,
                  name,
                  templateId: template,
                  surveyId: result.id,
                  ParticipantName
                },
                eventIs: EVENT_IS.CREATED
              };
              NotificationSdk.execute(participantId, notificationData);
            });
          }
        }

        response = new Response(true, 200);
        response.setData({});
        response.setMessage(
          `Survey sent to ${participants.length} patient(s) successfully`
        );
        return res.send(response.getResponse());
      }

      response = new Response(true, 403);
      response.setError(errMessage.COOKIES_NOT_SET);
      response.setMessage("Cookie not set or unauthorized access!");
      return res.status(403).json(response.getResponse());
    } catch (error) {
      let payload;
      switch (error.message) {
        case constants.COOKIES_NOT_SET:
          payload = {
            code: 403,
            error: errMessage.COOKIES_NOT_SET
          };
          break;
        case constants.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE:
          payload = {
            code: 401,
            error: errMessage.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE
          };
          break;
        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
          break;
      }

      if (error.errmsg) {
        let response = new Response(false, 200);
        response.setError({ message: error.errmsg });
        return res.status(200).json(response.getResponse());
      }

      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async listSurveyByStatus(req, res) {
    try {
      let error = validationResult(req);
      let response;
      if (!error.isEmpty()) {
        response = new Response(false, 422);
        response.setError(error.mapped());
        return res.status(422).json(response.getResponse());
      }
      if (req.userDetails.exists) {
        let { programId, _id } = req.userDetails.userData;
        if (_.isEmpty(programId)) {
          response = new Response(false, 200);
          response.setMessage({ message: "Not registered to any program!!" });
          return res.status(200).json(response.getResponse());
        }
        const statusObj = {
          inprogress: "INPROGRESS",
          completed: "COMPLETED"
        };
        let { status } = req.params;
        status = statusObj[status.toLowerCase()];
        if (!status) {
          response = new Response(false, 200);
          response.setError({ message: "Invalid Status!!" });
          return res.status(200).json(response.getResponse());
        }

        let result = await SURVEY({
          programId,
          status,
          _id
        }).getDetails();

        if (_.isEmpty(result)) {
          response = new Response(true, 200);
          response.setData({});
          response.setMessage("no survey found");
          return res.send(response.getResponse());
        }

        let surveyResults = {};
        for (let key in result) {
          const value = result[key];
          surveyResults[value._id] = value;
          surveyResults[value._id].surveyId = value._id;
          // if (!_.isEmpty(value.participants)) {
          //   surveyResults[value._id].participants = value.participants.map(
          //     val => {
          //       return val.participantId;
          //     }
          //   );
          // }
          const id = value._id;
          let surveycompletedParticipant = await SURVEY({
            surveyId: id,
            status: "COMPLETED"
          }).getParticipantsByStatus();
          const { data = {} } = surveycompletedParticipant;
          const { participantsId: { completed = [] } = {} } =
            data === null ? {} : data;
          surveyResults[value._id].participantCompletedSurvey =
            surveycompletedParticipant.data === null ? [] : completed;

          delete surveyResults[value._id]["_id"];
        }

        response = new Response(true, 200);
        response.setData({ surveys: surveyResults });
        response.setMessage("survey(s) found");
        return res.send(response.getResponse());
      }
      response = new Response(true, 403);
      response.setError(errMessage.COOKIES_NOT_SET);
      return res.status(403).json(response.getResponse());
    } catch (error) {
      let payload;
      switch (error.message) {
        case constants.COOKIES_NOT_SET:
          payload = {
            code: 403,
            error: errMessage.COOKIES_NOT_SET
          };
          break;
        case constants.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE:
          payload = {
            code: 401,
            error: errMessage.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE
          };
          break;
        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
          break;
      }

      if (error.errmsg) {
        let response = new Response(false, 200);
        response.setError({ message: error.errmsg });
        return res.status(200).json(response.getResponse());
      }

      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async getSurveyParticipantsByStatus(req, res) {
    try {
      let error = validationResult(req);
      let response;
      if (!error.isEmpty()) {
        response = new Response(false, 422);
        response.setError(error.mapped());
        return res.status(422).json(response.getResponse());
      }
      if (req.userDetails.exists) {
        let { programId } = req.userDetails.userData;
        let { surveyId, status } = req.params;

        if (_.isEmpty(programId)) {
          response = new Response(false, 200);
          response.setError({ message: "not registered to any program" });
          return res.status(200).json(response.getResponse());
        }

        let allowedStatusObj = {
          inprogress: "INPROGRESS",
          completed: "COMPLETED"
        };

        status = allowedStatusObj[status.toLowerCase()];
        if (!status) {
          response = new Response(false, 200);
          response.setError({ message: "invalid status" });
          return res.status(200).json(response.getResponse());
        }

        let result = await SURVEY({
          surveyId,
          status
        }).getParticipantsByStatus();
        if (result.error) {
          response = new Response(true, 200);
          response.setError({ message: result.message });
          return res.json(response.getResponse());
        }

        if (_.isEmpty(result.data)) {
          response = new Response(true, 200);
          response.setData({});
          response.setMessage("no participants found!!");
          return res.json(response.getResponse());
        }

        // let participantsData = {};
        // result.map(value => {
        //
        //   participantsData[value.participantId] = value;
        // });
        const {
          data: {
            participantData = {},
            hospitalData = {},
            participantsId = {}
          } = {}
        } = result;
        response = new Response(true, 200);
        response.setData({
          users: participantData,
          hospitals: hospitalData,
          participantsId: participantsId
        });
        response.setMessage("participant(s) found!!");
        return res.json(response.getResponse());
      }

      response = new Response(false, 403);
      response.setError(errMessage.COOKIES_NOT_SET);
      return res.status(403).json(response.getResponse());
    } catch (error) {
      let payload;
      switch (error.message) {
        case constants.COOKIES_NOT_SET:
          payload = {
            code: 403,
            error: errMessage.COOKIES_NOT_SET
          };
          break;
        case constants.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE:
          payload = {
            code: 401,
            error: errMessage.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE
          };
          break;
        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
          break;
      }

      if (error.errmsg) {
        let response = new Response(false, 200);
        response.setError({ message: error.errmsg });
        return res.status(200).json(response.getResponse());
      }
      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async addSurveyParticipants(req, res) {
    try {
      let error = validationResult(req);
      let response;
      if (!error.isEmpty()) {
        response = new Response(false, 422);
        response.setError(error.mapped());
        return res.status(422).json(response.getResponse());
      }

      if (req.userDetails.exists) {
        const { participants } = req.body;
        const { surveyId } = req.params;
        const { programId } = req.userDetails.userData;

        if (_.isEmpty(programId)) {
          response = new Response(false, 200);
          response.setMessage({ message: "Not registered to any program!!" });
          return res.status(200).json(response.getResponse());
        }

        let surveyUpdateResponse = await SURVEY({
          surveyId
        }).addSurveyParticipants(participants);

        if (surveyUpdateResponse.error) {
          response = new Response(false, 200);
          response.setError({ message: surveyUpdateResponse.message });
          return res.status(200).send(response.getResponse());
        }

        if (_.isEmpty(surveyUpdateResponse.result)) {
          response = new Response(false, 200);
          response.setError("failed to add participants");
          return res.status(200).send(response.getResponse());
        }

        response = new Response(true, 200);
        response.setData({});
        response.setMessage("participants added successfully");
        return res.send(response.getResponse());
      }
      response = new Response(false, 403);
      response.setError(errMessage.COOKIES_NOT_SET);
      return res.status(403).json(response.getResponse());
    } catch (error) {
      let payload;
      switch (error.message) {
        case constants.COOKIES_NOT_SET:
          payload = {
            code: 403,
            error: errMessage.COOKIES_NOT_SET
          };
          break;
        case constants.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE:
          payload = {
            code: 401,
            error: errMessage.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE
          };
          break;
        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
          break;
      }

      if (error.errmsg) {
        let response = new Response(false, 200);
        response.setError({ message: error.errmsg });
        return res.status(200).json(response.getResponse());
      }
      this;
      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async updateSurveyDate(req, res) {
    try {
      let error = validationResult(req);
      let response;
      if (!error.isEmpty()) {
        response = new Response(false, 422);
        response.setError(error.mapped());
        return res.status(422).json(response.getResponse());
      }
      if (req.userDetails.exists) {
        const { endDate } = req.body;
        const { surveyId } = req.params;
        const { programId } = req.userDetails.userData;

        if (_.isEmpty(programId)) {
          response = new Response(false, 200);
          response.setError("not registered to any programs!!");
          return res.status(200).json(response.getResponse());
        }

        let surveyUpdateResponse = await SURVEY({
          surveyId
        }).updateDate(endDate);

        if (surveyUpdateResponse.error) {
          response = new Response(false, 200);
          response.setError({ message: surveyUpdateResponse.message });
          return res.status(200).send(response.getResponse());
        }

        if (_.isEmpty(surveyUpdateResponse.result)) {
          response = new Response(false, 200);
          response.setError("unable to update survey date");
          return res.status(200).json(response.getResponse());
        }

        response = new Response(true, 200);
        response.setData({});
        response.setMessage("Survey date updated successfully");
        return res.status(200).json(response.getResponse());
      }

      response = new Response(false, 403);
      response.setError(errMessage.COOKIES_NOT_SET);
      return res.status(403).json(response.getResponse());
    } catch (error) {
      let payload;
      switch (error.message) {
        case constants.COOKIES_NOT_SET:
          payload = {
            code: 403,
            error: errMessage.COOKIES_NOT_SET
          };
          break;
        case constants.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE:
          payload = {
            code: 401,
            error: errMessage.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE
          };
          break;
        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
          break;
      }

      if (error.errmsg) {
        let response = new Response(false, 200);
        response.setError({ message: error.errmsg });
        return res.status(200).json(response.getResponse());
      }

      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async endSurvey(req, res) {
    try {
      let error = validationResult(req);
      let response;
      if (!error.isEmpty()) {
        response = new Response(false, 422);
        response.setError(error.mapped());
        return res.status(200).json(response.getResponse());
      }
      if (req.userDetails.userData) {
        const { surveyId } = req.params;
        const { programId } = req.userDetails.userData;

        if (_.isEmpty(programId)) {
          response = new Response(false, 200);
          response.setError({ message: "not registered to any program" });
          return res.status(200).json(response.getResponse());
        }

        let surveyResponse = await SURVEY({ surveyId }).end();

        if (_.isEmpty(surveyResponse)) {
          response = new Response(false, 200);
          response.setError(`ending survey ${surveyId} failed `);
          return res.json(response.getResponse());
        }

        response = new Response(true, 200);
        response.setData({});
        response.setMessage(`${surveyId} survey ended!!`);
        return res.json(response.getResponse());
      }

      response = new Response(false, 403);
      response.setError(errMessage.COOKIES_NOT_SET);
      return res.status(403).json(response.getResponse());
    } catch (error) {
      let payload;
      switch (error.message) {
        case constants.COOKIES_NOT_SET:
          payload = {
            code: 403,
            error: errMessage.COOKIES_NOT_SET
          };
          break;
        case constants.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE:
          payload = {
            code: 401,
            error: errMessage.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE
          };
          break;
        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
          break;
      }

      if (error.errmsg) {
        let response = new Response(false, 200);
        response.setError({ message: error.errmsg });
        return res.status(200).json(response.getResponse());
      }

      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async getSurveyParicipantsResponse(req, res) {
    try {
      let error = validationResult(req);
      let response;
      if (!error.isEmpty()) {
        response = new Response(false, 422);
        response.setError(error.mapped());
        return res.status(422).json(response.getResponse());
      }
      if (req.userDetails.exists) {
        const { programId } = req.userDetails.userData;
        const { download = false } = req.query;
        const { participantId, surveyId } = req.params;

        if (_.isEmpty(programId)) {
          response = new Response(false, 200);
          response.setError({ message: "not registered to any program" });
          return res.status(200).json(response.getResponse());
        }
        //
        let result = await SURVEY({
          surveyId,
          participantId
        }).getSurveyParticipantsResponse();
        if (result.error) {
          response = new Response(false, 200);
          response.setError({
            message: result.message
          });
          return res.status(200).json(response.getResponse());
        }
        if (_.isEmpty(result.responseData)) {
          response = new Response(true, 200);
          response.setData({});
          response.setMessage("No response found!!");
          return res.status(200).json(response.getResponse());
        }

        if (download) {
          const surveyResponse = result.responseData;
          const user = await userServices.getUserById(participantId);

          const file_path = path.join(
            __dirname,
            `../../../${participantId}-survey-report.pdf`
          );

          const doc = new PDFDocument();
          const stream = doc.pipe(fs.createWriteStream(file_path));
          const { basicInfo: { name } = {} } = user;

          doc.moveDown(2);

          doc
            .font("Times-Roman")
            .fillColor("black")
            .fontSize(18)
            .text(`Name: ${name}`);

          doc.fillColor("black").fontSize(10);
          doc.moveDown(2);
          doc.text("Response: ");
          doc.moveDown(1);

          const allAnswers = Object.keys(surveyResponse) || [];

          allAnswers.forEach((answer, index) => {
            const { _id, statement, type, response: question_response } =
              surveyResponse[answer] || {};

            if (question_response) {
              switch (type) {
                case OPTION_TYPE.TEXT:
                  doc.moveDown(1);
                  doc.font("Times-Bold");
                  doc.text(`Q${index + 1} ${statement}`);

                  doc.moveDown(1);
                  doc.font("Times-Roman");
                  doc.text(`${question_response}`);
                  break;
                case OPTION_TYPE.RADIO: {
                  const { id, value } = question_response || {};
                  doc.moveDown(1);
                  doc.font("Times-Bold");
                  doc.text(`Q${index + 1} ${statement}`);

                  doc.moveDown(1);
                  doc.font("Times-Roman");
                  doc.text(`${id}: ${value}`);
                  break;
                }

                case OPTION_TYPE.CHECKBOX: {
                  doc.moveDown(1);
                  doc.font("Times-Bold");
                  doc.text(`Q${index + 1} ${statement}`);
                  for (const current_response in question_response) {
                    const { id, value } =
                      question_response[current_response] || {};

                    doc.moveDown(1);
                    doc.font("Times-Roman");
                    doc.text(`${id}: ${value}`);
                  }
                  break;
                }
              }
            }
          });

          doc.end();

          stream.on("finish", function() {
            const file = fs.createReadStream(file_path);
            const stat = fs.statSync(file_path);
            res.setHeader("Content-Length", stat.size);
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader(
              "Content-Disposition",
              `attachment; filename=${participantId}-survey-report.pdf`
            );
            file.pipe(res);
          });
        } else {
          response = new Response(true, 200);
          response.setData({
            responses: result.responseData,
            completedOn: result.completedOn
          });
          response.setMessage("survey pariticpant response found!!");
          return res.json(response.getResponse());
        }
      }
    } catch (error) {
      console.log("=======error", error);
      let payload;
      switch (error.message) {
        case constants.COOKIES_NOT_SET:
          payload = {
            code: 403,
            error: errMessage.COOKIES_NOT_SET
          };
          break;
        case constants.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE:
          payload = {
            code: 401,
            error: errMessage.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE
          };
          break;
        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
          break;
      }

      if (error.errmsg) {
        let response = new Response(false, 200);
        response.setError({ message: error.errmsg });
        return res.status(200).json(response.getResponse());
      }

      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async getSurveyAllParicipantsResponse(req, res) {
    try {
      let error = validationResult(req);
      let response;
      if (!error.isEmpty()) {
        response = new Response(false, 422);
        response.setError(error.mapped());
        return res.status(422).json(response.getResponse());
      }
      if (req.userDetails.exists) {
        const { programId } = req.userDetails.userData;
        const { surveyId } = req.params;

        if (_.isEmpty(programId)) {
          response = new Response(false, 200);
          response.setError({ message: "not registered to any program" });
          return res.status(200).json(response.getResponse());
        }

        let result = await SURVEY({
          surveyId
        }).getSurveyParticipantsResponse();

        if (result.error) {
          response = new Response(false, 200);
          response.setError({
            message: result.message
          });
          return res.status(200).json(response.getResponse());
        }
        if (_.isEmpty(result.responseData)) {
          response = new Response(true, 200);
          response.setData({});
          response.setMessage("No response found!!");
          return res.status(200).json(response.getResponse());
        }

        response = new Response(true, 200);
        response.setData({ responses: result.responseData });
        response.setMessage("survey pariticpant response found!!");
        return res.json(response.getResponse());
      }

      response = new Response(false, 403);
      response.setError(errMessage.COOKIES_NOT_SET);
      return res.status(403).json(response.getResponse());
    } catch (error) {
      let payload;
      switch (error.message) {
        case constants.COOKIES_NOT_SET:
          payload = {
            code: 403,
            error: errMessage.COOKIES_NOT_SET
          };
          break;
        case constants.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE:
          payload = {
            code: 401,
            error: errMessage.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE
          };
          break;
        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
          break;
      }
      if (error.errmsg) {
        let response = new Response(false, 200);
        response.setError({ message: error.errmsg });
        return res.status(200).json(response.getResponse());
      }
      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  sendMailToParticipants = async (participants, survey, loggedInUserId) => {
    const {
      startDate,
      endDate,
      template: { templateId, title: name },
      _id: surveyId,
      program
    } = survey;
    let participantids = [];
    for (let key in participants) {
      participantids.push(participants[key]["participantId"]);
    }
    let userData = await userServices.getBulkUsers(participantids);
    if (userData) {
      userData.map(async value => {
        const {
          personalInfo: { email } = {},
          basicInfo: { name: participantName = "CareCoach" } = {}
        } = value;
        const mailData = await preparePatientSurveyMailData({
          startDate,
          endDate,
          name,
          templateId: templateId,
          surveyId: surveyId,
          userName: participantName
        });
        if (!_.isEmpty(email)) {
          let emailPayload = {
            toAddress: email,
            title: `Your Care Coach sent you a survey: ${mailData.surveyTitle}`,
            templateData: mailData,
            templateName: "surveyInvite"
          };
          const emailResponse = Proxy_Sdk.execute(EVENTS.SEND_EMAIL, {
            ...emailPayload,
            programId: program.toString(),
            loggedInUserId: loggedInUserId.toString()
          });
        }
      });
    }
  };

  updateSurvey = async (req, res) => {
    try {
      let error = validationResult(req);
      let response;
      if (!error.isEmpty()) {
      }
      let { programId, _id: loggedInUserId } = req.userDetails.userData;
      let { surveyId } = req.params;
      let { endDate, participants } = req.body;
      let result;
      if (_.isEmpty(programId)) {
        response = new Response(false, 200);
        response.setError("not registered to any program");
        return res.json(response.getResponse());
      }
      if (!_.isEmpty(endDate) && !_.isEmpty(participants)) {
        result = await SURVEY({ surveyId }).updateParticipantsAndDate(
          participants,
          endDate
        );
        if (result.error) {
          response = new Response(false, 200);
          response.setError({
            message: result.message
          });
          return res.status(200).json(response.getResponse());
        }

        if (!_.isEmpty(participants)) {
          let participantids = [];
          const survey = await SURVEY({ surveyId }).getOne();
          for (let key in participants) {
            participantids.push(participants[key]["participantId"]);
          }
          let userData = await userServices.getBulkUsers(participantids);
          if (userData) {
            userData.map(async value => {
              const {
                basicInfo: {
                  _id: participantId,
                  name: participantName = ""
                } = {}
              } = value;
              const {
                startDate,
                endDate,
                template: { templateId, title: name },
                _id: surveyId
              } = survey;
              const notificationData = {
                data: {
                  _id: surveyId,
                  eventCategory: NOTIFICATION_VERB.SURVEY,
                  userId: loggedInUserId,
                  startDate,
                  endDate,
                  name,
                  templateId: templateId,
                  surveyId: surveyId,
                  userName: participantName
                },
                eventIs: EVENT_IS.CREATED
              };
              NotificationSdk.execute(participantId, notificationData);
            });
          }

          for (let key in participants) {
            const { participantId } = participants[key] || {};
          }
        }
        response = new Response(true, 200);
        response.setData({});
        response.setMessage(
          `Survey sent to ${participants.length} patient(s) successfully`
        );
        return res.json(response.getResponse());
      }

      if (!_.isEmpty(endDate) && _.isEmpty(participants)) {
        result = await SURVEY({ surveyId }).updateDate(endDate);

        if (result.error) {
          response = new Response(false, 200);
          response.setError({
            message: result.message
          });
          return res.status(200).json(response.getResponse());
        }
        response = new Response(true, 200);
        response.setData({});
        response.setMessage("Survey end date updated successfully");
        return res.json(response.getResponse());
      }

      if (_.isEmpty(endDate) && !_.isEmpty(participants)) {
        result = await SURVEY({ surveyId }).addSurveyParticipants(participants);
        if (result.error) {
          response = new Response(false, 200);
          response.setError({
            message: result.message
          });
          return res.status(200).json(response.getResponse());
        }

        response = new Response(true, 200);
        response.setData({});
        response.setMessage("updated survey participants successfully!!");
        return res.json(response.getResponse());
      }

      response = new Response(false, 200);
      response.setError({
        message: "either participants or endate is not specified"
      });
      return res.json(response.getResponse());
    } catch (error) {
      let payload;
      switch (error.message) {
        case constants.COOKIES_NOT_SET:
          payload = {
            code: 403,
            error: errMessage.COOKIES_NOT_SET
          };
          break;
        case constants.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE:
          payload = {
            code: 401,
            error: errMessage.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE
          };
          break;
        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
          break;
      }
      if (error.errmsg) {
        let response = new Response(false, 200);
        response.setError({ message: error.errmsg });
        return res.status(200).json(response.getResponse());
      }
      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  };

  async getSurveyTemplatesSurveyProgram(req, res) {
    try {
      let response;
      const { templateId } = req.params;
      let surveyDetail = await SURVEY({
        templateId: templateId
      }).getSurveyProgram();

      response = new Response(true, 200);
      response.setData({
        surveyDetail: [...surveyDetail]
      });
      return res.send(response.getResponse());
    } catch (err) {
      console.log(err);
      let payload;
      switch (error.message) {
        case constants.COOKIES_NOT_SET:
          payload = {
            code: 403,
            error: errMessage.COOKIES_NOT_SET
          };
          break;
        case constants.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE:
          payload = {
            code: 401,
            error: errMessage.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE
          };
          break;
        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
          break;
      }

      if (error.errmsg) {
        let response = new Response(false, 200);
        response.setError({ message: error.errmsg });
        return res.status(200).json(response.getResponse());
      }

      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async getSurveyById(req, res) {
    try {
      let response;
      const { surveyId } = req.params;

      let { category, _id: userId } = req.userDetails.userData;
      if (category === PATIENT) {
        const isPatientValid = await SURVEY({
          surveyId,
          userId
        }).getParticipantDataforSurvey();
        if (isPatientValid.length === 0) {
          throw new Error(constants.UNAUTHORIZED_ACCESS);
        }
      }

      const survey = await SURVEY({
        _id: surveyId
      }).get();

      const surveyResult = {};
      surveyResult[surveyId] = { ...survey[0] };
      response = new Response(true, 200);
      response.setData({
        surveys: surveyResult
      });
      return res.send(response.getResponse());
      // console.log('formatData', formatedData, doctorData, hospitalData);
    } catch (error) {
      console.log(error);
      let payload;
      switch (error.message) {
        case constants.COOKIES_NOT_SET:
          payload = {
            code: 403,
            error: errMessage.COOKIES_NOT_SET
          };
          break;
        case constants.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE:
          payload = {
            code: 401,
            error: errMessage.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE
          };
          break;
        case constants.UNAUTHORIZED_ACCESS:
          payload = {
            code: 402,
            error: errMessage.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE
          };
          break;
        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
          break;
      }

      if (error.errmsg) {
        let response = new Response(false, 200);
        response.setError({ message: error.errmsg });
        return res.status(200).json(response.getResponse());
      }

      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async addParticipantResponse(req, res) {
    try {
      let response;
      const { _id } = req.userDetails.userData;
      const { surveyId } = req.params;
      const { data, completedOn } = req.body;
      const survey = await SURVEY({
        surveyId: surveyId,
        participantId: _id,
        response: data,
        completedOn: completedOn
      }).addParticipantResponse();
      const surveyResult = {};
      surveyResult[surveyId] = { ...survey };
      response = new Response(true, 200);
      response.setData({
        surveys: surveyResult
      });
      return res.send(response.getResponse());
      // console.log('formatData', formatedData, doctorData, hospitalData);
    } catch (error) {
      throw error;
      let payload;
      switch (error.message) {
        case constants.COOKIES_NOT_SET:
          payload = {
            code: 403,
            error: errMessage.COOKIES_NOT_SET
          };
          break;
        case constants.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE:
          payload = {
            code: 401,
            error: errMessage.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE
          };
          break;
        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
          break;
      }

      // if (error.errmsg) {
      //   let response = new Response(false, 200);
      //   console.log('error.errmsg', error.errmsg)
      //   response.setError({ message: error.errmsg });
      //   return res.status(200).json(response.getResponse());
      // }

      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async downloadSurveyReport(req, res) {
    try {
      const { surveyId } = req.params;
      const survey = await SURVEY({
        surveyId: surveyId
      }).getSurveyReportData();
      const participants = survey.length > 0 ? survey[0].participants : null;
      let result = [];
      if (participants) {
        for (const participant of participants) {
          const responses = participant.response;
          const user = await userServices.getUserById(
            participant.participantId
          );
          result[user.basicInfo.name] = responses;
        }
      }
      const response = new Response(true, 200);
      response.setData(result);
      response.setMessage("Add survey responses");
      return res.send(response.getResponse());
    } catch (error) {
      throw error;
      let payload;
      switch (error.message) {
        case constants.COOKIES_NOT_SET:
          payload = {
            code: 403,
            error: errMessage.COOKIES_NOT_SET
          };
          break;
        case constants.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE:
          payload = {
            code: 401,
            error: errMessage.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE
          };
          break;
        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
          break;
      }
      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }
  async getCareCoachSurvey(req, res) {
    try {
      let response;
      const { programId } = req.userDetails.userData;
      if (_.isEmpty(programId)) {
        response = new Response(false, 200);
        response.setError({ message: "Not registered to any program!!" });
        return res.status(200).send(response.getResponse());
      }
      let surveyTemplate = await SURVEY_TEMPLATE({
        programId
      }).getDetails();
      if (_.isEmpty(surveyTemplate)) {
        response = new Response(true, 200);
        response.setData({});
        response.setMessage("No survey template found!!");
        return res.send(response.getResponse());
      }
      let surveyTemplateData = {};
      surveyTemplate.map(value => {
        surveyTemplateData[value._id] = value;
        surveyTemplateData[value._id]["templateId"] = value._id;
        delete surveyTemplateData[value._id]["_id"];
      });
      let surveys = await SURVEY({
        programId
      }).getSurveyIds();

      response = new Response(true, 200);
      response.setData({ templates: surveyTemplateData, surveys: surveys });
      response.setMessage("Add survey responses");
      return res.send(response.getResponse());
    } catch (error) {
      throw error;
      let payload;
      switch (error.message) {
        case constants.COOKIES_NOT_SET:
          payload = {
            code: 403,
            error: errMessage.COOKIES_NOT_SET
          };
          break;
        case constants.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE:
          payload = {
            code: 401,
            error: errMessage.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE
          };
          break;
        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
          break;
      }
      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async getRecentlySentSurveys(req, res) {
    try {
      const { programIds, statuses } = req.query;
      const ids = JSON.parse(programIds);
      const status = statuses ? JSON.parse(statuses) : null;
      const { userId = "", userData = {} } = req.userDetails;
      const { category } = userData;
      let surveys = [];

      let surveyData = {};
      if (ids.length > 0) {
        if (category === USER_CATEGORY.PATIENT) {
          surveys = await SURVEY({
            programIds: ids,
            status: status,
            userId: userId
          }).getSurveyByProgramIdAndUserId();
        } else if (category === USER_CATEGORY.CARE_COACH) {
          surveys = await SURVEY({
            programIds: ids,
            status: status
          }).getSurveyByProgramId();
        }
        if (surveys.length > 0) {
          for (const survey of surveys) {
            let surveycompletedParticipant = await SURVEY({
              surveyId: survey._id,
              status: "COMPLETED"
            }).getParticipantsByStatus();
            const { data = {} } = surveycompletedParticipant;
            const { participantsId: { completed = [] } = {} } =
              data === null ? {} : data;
            const participantCompletedSurvey =
              surveycompletedParticipant.data === null ? [] : completed;

            const temp = {
              ...survey,
              participantCompletedSurvey: participantCompletedSurvey
            };

            surveyData[survey._id] = temp;
          }
        }
      }
      const response = new Response(true, 200);
      response.setData(surveyData);
      response.setMessage("Add survey responses");
      return res.send(response.getResponse());
    } catch (error) {
      throw error;
      let payload;
      switch (error.message) {
        case constants.COOKIES_NOT_SET:
          payload = {
            code: 403,
            error: errMessage.COOKIES_NOT_SET
          };
          break;
        case constants.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE:
          payload = {
            code: 401,
            error: errMessage.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE
          };
          break;
        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
          break;
      }
      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async downloadResponse(req, res) {
    try {
      const { id, surveyId } = req.params;

      if (id || id !== undefined) {
        let surveyDetail = await SURVEY_TEMPLATE({
          _id: id
        }).get();
        let questionsId = [];
        if (surveyDetail.length > 0) {
          const { questions } = surveyDetail[0];
          questionsId = questions;
        }
        const allQuestions = await QUESTION({
          _id: { $in: questionsId }
        }).get();

        const survey = await SURVEY({
          surveyId: surveyId
        }).getSurveyReportData();
        const participants = survey.length > 0 ? survey[0].participants : null;
        let result = [];
        if (participants) {
          for (const participant of participants) {
            const responses = participant.response;
            const user = await userServices.getUserById(
              participant.participantId
            );
            result[user.basicInfo.name] = responses;
          }
        }

        let dataSource = [];
        let csvHeader = "";
        for (const user in result) {
          const response = result[user];
          let columns = [];

          columns.push("Patient Name");
          let row = [];

          row.push(user);
          for (let i = 0; i < response.length; i++) {
            const multiselect = [];
            columns.push(allQuestions[i].statement);
            const answer = response[i].response;
            if (Array.isArray(answer)) {
              // For multiselect response
              // console.log("Answer multiselect",answer)
              answer.forEach(response => {
                multiselect.push(response.value);
              });
              row.push(multiselect.join(","));
            } else if (typeof answer === "object") {
              // console.log("Answer Radio",answer)
              row.push(answer.value);
            } else {
              // console.log("Answer Text",answer)
              row.push(answer);
            }
          }
          dataSource.push({ ...row });

          const columnKeys = columns.map(column => {
            return column;
          });
          csvHeader = new Json2csvParser({
            fields: columnKeys
          }).parse();
        }
        const csvBody = new Json2csvParser({ header: false }).parse(dataSource);
        const csv = csvHeader + "\n" + csvBody;

        const file_path = `${surveyId}-report.csv`;

        let writeStream = fs.createWriteStream(file_path);
        writeStream.write(csv);
        writeStream.end();

        writeStream
          .on("finish", () => {
            const file = fs.createReadStream(file_path);
            const stat = fs.statSync(file_path);
            res.setHeader("Content-Length", stat.size);
            res.setHeader("Content-Type", "text/csv");
            res.setHeader(
              "Content-Disposition",
              `attachment; filename=${id}-vitals.csv`
            );
            file.pipe(res);
          })
          .on("error", err => {
            console.log("error", err);
            throw new Error("error writing file");
          });
      }
    } catch (e) {
      console.log("error::  ", e);
      const payload = {
        code: 500,
        error: errMessage.INTERNAL_SERVER_ERROR
      };
      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }
}

module.exports = new SurveyController();
