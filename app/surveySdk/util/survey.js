import { PARTICIPANTS_SURVEY_STATUS } from "../../../constant";
import { ObjectId } from "mongodb";

const _ = require("lodash");
const path = require("path");
const survey = require("../schema/survey");
const surveyTemplate = require("./surveyTemplate");
const userServices = require("../../services/user/user.service");
const programServices = require("../../services/program/program.service");
const hospitalServices = require("../../services/hospital/hospital.service");
const surveyQuestions = require("./surveyQuestions");
const isEqual = require("lodash/isEqual");

const INPROGRESS = "INPROGRESS";

class Survey {
  constructor(surveyData = {}) {
    this.surveyData = surveyData;
  }

  async create() {
    try {
      let result;
      if (_.isArray(this.surveyData)) {
        let bulkQuery = [];
        for (let key in this.surveyData) {
          let value = this.surveyData[key];
          if (_.isEmpty(value.template)) {
            throw new Error("Undefined or invalid template");
          }
          if (_.isEmpty(value.program)) {
            throw new Error("Undefined program for survey");
          }

          if (_.isString(value.template)) {
            let templateData = await surveyTemplate({
              _id: value.template
            }).getOne();
            if (_.isEmpty(templateData)) {
              throw new Error("Undefined or invalid template");
            }
            if (_.isEmpty(templateData.programs)) {
              throw new Error("no program linked with current survey template");
            }

            if (!_.has(templateData.programs, value.program)) {
              throw new Error(
                `specified program ${value.program} not linked with current survey template`
              );
            }
            value.template = templateData;
            bulkQuery.push(value);
          }
        }
        result = await survey.insertMany(bulkQuery);
        return result;
      }
      if (_.isEmpty(this.surveyData.program)) {
        throw new Error("Undefined program for survey");
      }

      if (_.isEmpty(this.surveyData.template)) {
        throw new Error("Undefined or invalid template");
      }
      if (_.isString(this.surveyData.template)) {
        let templateData = await surveyTemplate({
          _id: this.surveyData.template
        }).getOne();
        if (_.isEmpty(templateData.programs)) {
          throw new Error("no program linked with current survey template");
        }

        let templatePrograms = templateData.programs.map(value => {
          return value.toString();
        });

        if (templatePrograms.indexOf(this.surveyData.program) == -1) {
          throw new Error(
            "specified program not linked with current survey template"
          );
        }

        if (_.isEmpty(templateData)) {
          throw new Error("Undefined or invalid template");
        }

        templateData.templateId = templateData._id;
        delete templateData._id;
        this.surveyData.template = templateData;
      } else {
        throw new Error("Undefined or invalid template");
      }
      let surveyObj = new survey(this.surveyData);
      result = await surveyObj.save(this.surveyData);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getDetails() {
    try {
      if (_.isEmpty(this.surveyData.programId)) {
        throw new Error("undefined programId");
      }
      let result;
      if (_.isEmpty(this.surveyData.status)) {
        result = await survey
          .find({
            program: { $in: this.surveyData.programId },
            [surveyCreator.id]: this.surveyData._id
          })
          .lean();
        return result;
      }
      result = await survey
        .find({
          program: { $in: this.surveyData.programId },
          status: this.surveyData.status
        })
        .lean();
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getOne() {
    try {
      let result;
      if (!_.isEmpty(this.populateData)) {
        result = _.isEmpty(this.surveyData)
          ? await survey
              .findOne({})
              .populate(this.populateData)
              .lean()
          : survey
              .findOne({ _id: this.surveyData.surveyId })
              .populate(this.populateData)
              .lean();
        return result;
      }
      result = _.isEmpty(this.surveyData)
        ? await survey.findOne({}).lean()
        : survey.findOne({ _id: this.surveyData.surveyId }).lean();
      return result;
    } catch (error) {
      throw error;
    }
  }

  async get() {
    try {
      let result;
      if (!_.isEmpty(this.populateData)) {
        result = _.isEmpty(this.surveyData)
          ? await survey
              .find({})
              .populate(this.populateData)
              .lean()
          : survey
              .find(this.surveyData)
              .populate(this.populateData)
              .lean();
        return result;
      }
      result = _.isEmpty(this.surveyData)
        ? await survey.find({}).lean()
        : survey.find(this.surveyData).lean();
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getParticipantsByStatus() {
    try {
      if (
        _.isEmpty(this.surveyData.surveyId) ||
        _.isEmpty(this.surveyData.status)
      ) {
        throw new Error("undefined surveyId or status ");
      }

      let result = await survey
        .findOne(
          {
            _id: this.surveyData.surveyId
            // "participants.status": this.surveyData.status
          },
          { _id: false }
        )
        .select("participants program")
        .lean();
      if (result && result.participants) {
        let participantData = {};
        let hospitalData = {};
        let participantsId = {};
        participantsId.completed = [];
        participantsId.inprogress = [];
        for (let key in result.participants) {
          let participant = result.participants[key];
          const { participantId } = participant;
          if (participant.status === this.surveyData.status) {
            if (participant.status === PARTICIPANTS_SURVEY_STATUS.COMPLETED) {
              participantsId.completed.push(participantId);
            } else {
              participantsId.inprogress.push(participantId);
            }
            const userDetails = await userServices.getUserById(participantId);
            if (_.isEmpty(userDetails)) {
              return {
                error: true,
                message: `invalid pariticipant id ${participantId}`
              };
            }
            const { basicInfo, personalInfo } = userDetails;
            let doctors = await programServices.getDoctorOfUser(
              participantId,
              result.program
            );
            const doctorsId =
              doctors.length > 0 ? doctors[0].doctors[0]._id : "";
            const patients =
              doctors.length > 0 ? doctors[0].doctors[0].patients : "";
            let hospitalId;
            if (patients !== "") {
              let hospital = patients.filter(patient => {
                if (isEqual(patient._id, participantId)) {
                  return true;
                }
                return false;
              });
              hospitalId = hospital[0].hospital;
            }
            let doctorDetails;
            if (doctorsId !== "") {
              doctorDetails = await userServices.getUserById(doctorsId);
              participantData[doctorsId] = { ...doctorDetails };
            }
            let hospitalDetail;
            if (hospitalId) {
              hospitalDetail = await hospitalServices.getHospitalDetails({
                _id: hospitalId
              });
              hospitalData[hospitalId] = { ...hospitalDetail };
            }
            participantData[participantId] = Object.assign(
              {},
              { basicInfo: basicInfo, personalInfo: personalInfo }
            );
          } else {
            if (participant.status === PARTICIPANTS_SURVEY_STATUS.COMPLETED) {
              participantsId.completed.push(participantId);
            } else {
              participantsId.inprogress.push(participantId);
            }
          }
        }

        return {
          error: false,
          data: {
            participantData,
            hospitalData,
            participantsId: participantsId
          }
        };
      }

      return { error: false, data: result };
    } catch (err) {
      throw err;
    }
  }

  async getSurveyParticipantsResponse() {
    try {
      if (_.isEmpty(this.surveyData.surveyId)) {
        return { error: true, message: "Survey id is undefined or invalid!!" };
      }
      let surveyData;
      if (!_.isEmpty(this.surveyData.participantId)) {
        surveyData = await survey
          .findOne(
            {
              _id: this.surveyData.surveyId,
              "participants.status": "COMPLETED",
              "participants.participantId": this.surveyData.participantId
            },
            { _id: false }
          )
          .select("participants")
          .lean();
        let participantResponse = {};
        let participantCompletedOn = "";
        if (_.isEmpty(surveyData.participants)) {
          return { error: false, responseData: [] };
        }

        for (let key in surveyData.participants) {
          let value = surveyData.participants[key];
          if (value.participantId == this.surveyData.participantId) {
            participantResponse = value.response;
            participantCompletedOn = value.completedOn;
          }
        }
        let participantResponseData = {};
        for (let key in participantResponse) {
          let value = participantResponse[key];
          let question = await surveyQuestions({
            _id: value.questionId
          }).getOne();
          let { statement, options, type } = question;
          participantResponseData[value._id] = value;
          participantResponseData[value._id]["statement"] = statement;
          participantResponseData[value._id]["options"] = options;
          participantResponseData[value._id]["type"] = type;
          participantResponseData[value._id]["responseId"] = value._id;
          delete participantResponseData[value._id]["_id"];
        }

        return {
          error: false,
          responseData: participantResponseData,
          completedOn: participantCompletedOn
        };
      }

      surveyData = await survey
        .findOne(
          {
            _id: this.surveyData.surveyId,
            "participants.status": "COMPLETED"
          },
          { _id: false }
        )
        .select("participants")
        .lean();

      let participantResponse = {};
      let participantCompletedOn = "";
      for (let key in surveyData.participants) {
        let participant = surveyData.participants[key];

        participantResponse[participantId] = participant;
        participantCompletedOn = participant.completedOn;
        let responseDetails = {};

        for (let key2 in participant.response) {
          let responseData = participant.response[key2];
          let question = await surveyQuestions({
            _id: responseData.questionId
          }).getOne();
          let { statement, options, type } = question;
          responseDetails[responseData._id] = {
            response: responseData.response,
            responseId: responseData._id,
            questionId: responseData.questionId,
            statement,
            options,
            type
          };
        }
        participantResponse[participantId].response = responseDetails;
      }

      return {
        error: false,
        responseData: participantResponse,
        completedOn: participantCompletedOn
      };
    } catch (error) {
      throw error;
    }
  }

  async updateParticipantsAndDate(participants, date) {
    try {
      let validSurveyData = await survey
        .findOne({ _id: this.surveyData.surveyId })
        .lean();

      if (_.isEmpty(validSurveyData)) {
        return {
          error: true,
          message: `invalid survey ${this.surveyData.surveyId}!!`
        };
      }

      let participantsData = validSurveyData.participants;

      participants.map(value => {
        value.status = "INPROGRESS";
        participantsData.push(value);
      });
      let result = await survey.updateOne(
        { _id: this.surveyData.surveyId },
        {
          $set: {
            participants: participantsData,
            endDate: date
          }
        },
        { new: true }
      );

      return { error: false, result };
    } catch (error) {
      throw error;
    }
  }

  async updateOne() {
    try {
      let result = await survey.updateOne(
        this.surveyData.condition,
        this.surveyData.set
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async addSurveyParticipants(participants) {
    try {
      let validSurveyData = await survey
        .findOne({ _id: this.surveyData.surveyId })
        .lean();

      if (_.isEmpty(validSurveyData)) {
        return {
          error: true,
          message: `invalid survey ${this.surveyData.surveyId}!!`
        };
      }

      let participantsData = validSurveyData.participants;
      participants.map(value => {
        value.status = "INPROGRESS";
        participantsData.push(value);
      });
      let result = await survey.updateOne(
        { _id: this.surveyData.surveyId },
        {
          $set: {
            participants: participantsData
          }
        }
      );

      return { error: false, result };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateDate(date) {
    try {
      let validSurveyData = await survey
        .findOne({ _id: this.surveyData.surveyId })
        .lean();
      if (_.isEmpty(validSurveyData)) {
        return {
          error: true,
          message: `invalid survey ${this.surveyData.surveyId}!!`
        };
      }

      let result = await survey.updateOne(
        { _id: this.surveyData.surveyId },
        { $set: { endDate: date } }
      );
      return { error: false, result };
    } catch (error) {
      throw error;
    }
  }

  async delete() {
    try {
      let result = await survey.deleteMany(this.surveyData);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async end() {
    try {
      let result = await survey.updateOne(
        { _id: this.surveyData.surveyId },
        { $set: { status: "COMPLETED" } }
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getSurveyProgram() {
    try {
      const result = await survey.find(
        {
          "template.templateId": this.surveyData.templateId,
          status: "INPROGRESS"
        },
        { program: 1 }
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async addParticipantResponse() {
    try {
      const participantId = this.surveyData.participantId;
      const surveyId = this.surveyData.surveyId;
      const response = this.surveyData.response;
      const completedOn = this.surveyData.completedOn;
      const result = await survey
        .findOneAndUpdate(
          { _id: surveyId, "participants.participantId": participantId },
          {
            $push: { "participants.$.response": response },
            $set: {
              "participants.$.status": "COMPLETED",
              "participants.$.completedOn": completedOn
            }
          },
          { new: true }
        )
        .lean();
      const { participants } = result;
      const particpantsCompletedSurvey = participants.findIndex(participant => {
        const { status } = participant;
        if (status === INPROGRESS) {
          return true;
        }
        return false;
      });
      if (particpantsCompletedSurvey === -1) {
        const newResult = await survey
          .findOneAndUpdate(
            { _id: surveyId },
            {
              $set: { status: "COMPLETED" }
            },
            { new: true }
          )
          .lean();
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  //db.survey.find({_id: ObjectId("5ca33b5b12a950005c39ed0b")},{_id: 0, participants: {$elemMatch: {"status" : "COMPLETED"}}}).pretty()
  //db.survey.aggregate([{$match:{_id:ObjectId("5cc17cb9a1d932005668cc61")}},{$project:{ participants: { $filter:{input: "$participants", as: "participant", cond: {$eq: ["$$participant.status", "COMPLETED"]}}}  }}]).pretty()
  async getSurveyReportData() {
    try {
      const surveyId = this.surveyData.surveyId;
      const result = await survey.aggregate([
        { $match: { _id: ObjectId(surveyId) } },
        {
          $project: {
            participants: {
              $filter: {
                input: "$participants",
                as: "participant",
                cond: { $eq: ["$$participant.status", "COMPLETED"] }
              }
            }
          }
        }
      ]);
      // const result = await survey.find(
      //   { _id: surveyId },
      //   { _id: 0, participants: { $elemMatch: { status: "COMPLETED" } } },{participants: 1}
      // );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getSurveyByProgramId() {
    try {
      const programIds = this.surveyData.programIds;
      const status = this.surveyData.status;
      const query = status
        ? { program: { $in: programIds }, status: { $in: status } }
        : { program: { $in: programIds } };
      const result = await survey
        .find(query)
        .sort({ updatedAt: -1 })
        .limit(4)
        .lean();
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getSurveyByProgramIdAndUserId() {
    try {
      const { programIds } = this.surveyData;
      const { status } = this.surveyData;
      const { userId } = this.surveyData;
      const query = status
        ? {
            program: { $in: programIds },
            status: { $in: status },
            "participants.participantId": userId
          }
        : {
            program: { $in: programIds },
            "participants.participantId": userId
          };
      const result = await survey
        .find(query)
        .sort({ updatedAt: -1 })
        .limit(4)
        .lean();
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getSurveyIds() {
    try {
      if (_.isEmpty(this.surveyData.programId)) {
        throw new Error("undefined programId");
      }
      let completed = await survey
        .find(
          {
            program: { $in: this.surveyData.programId },
            status: "COMPLETED"
          },
          { _id: 1 }
        )
        .sort({ createdAt: -1 })
        .lean();
      let inprogress = await survey
        .find(
          {
            program: { $in: this.surveyData.programId },
            status: "INPROGRESS"
          },
          { _id: 1 }
        )
        .sort({ createdAt: -1 })
        .lean();
      const result = { completed: completed, inprogress: inprogress };
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getParticipantDataforSurvey() {
    try {
      if (
        _.isEmpty(this.surveyData.surveyId) ||
        _.isEmpty(this.surveyData.userId)
      ) {
        throw new Error("undefined data");
      }
      const { surveyId, userId } = this.surveyData;

      let result = await survey
        .find({
          _id: surveyId,
          "participants.participantId": userId
        })
        .lean();
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = surveyData => {
  const survey = new Survey(surveyData);
  return survey;
};
