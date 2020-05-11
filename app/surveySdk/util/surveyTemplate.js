const _ = require("lodash");
const surveyTemplate = require("../schema/surveyTemplate");
const surveyQuestion = require("./surveyQuestions");

class SurveyTemplate {
  constructor(templateData = {}) {
    this.templateData = templateData;
  }

  async create() {
    try {
      if (_.isEmpty(this.templateData)) {
        throw new Error("tempalate data can't be empty");
      }

      let result;
      if (_.isArray(this.templateData)) {
        let bulkQuery = [];
        for (let key in this.templateData) {
          let value = this.templateData[key];
          if (_.isEmpty(value.questions) && !_.isArray(value.questions)) {
            throw new Error("invalid or empty question data");
          }
          let questionObj = !_.every(value.questions, _.isObject)
            ? await surveyQuestion({ _id: { $in: value.questions } }).get()
            : await surveyQuestion(value.questions).set();
          if (!_.isEmpty(questionObj)) {
            throw new Error("questions creation failed");
          }
          value.questions = questionObj.map(value => {
            return value._id;
          });
          bulkQuery.push(value);
        }
        result = await surveyTemplate.insertMany(this.templateData);
        return result;
      }
      if (
        _.isEmpty(this.templateData.questions) &&
        !_.isArray(this.templateData.questions)
      ) {
        throw new Error("invalid or empty question data");
      }

      let questions = !_.every(this.templateData.questions, _.isObject)
        ? await surveyQuestion({
            _id: { $in: this.templateData.questions }
          }).get()
        : await surveyQuestion(this.templateData.questions).set();

      if (_.isEmpty(questions)) {
        throw new Error("questions creation failed");
      }
      this.templateData.questions = questions.map(value => {
        return value._id;
      });

      result = await surveyTemplate.insertMany(this.templateData);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async get() {
    try {
      if (_.isEmpty(this.populateVal)) {
        let result = _.isEmpty(this.templateData)
          ? await surveyTemplate.find({}).lean()
          : await surveyTemplate.find(this.templateData).lean();
        return result;
      }
      let result = _.isEmpty(this.templateData)
        ? await surveyTemplate
            .find({})
            .populate(this.populateVal)
            .lean()
        : await surveyTemplate
            .find(this.templateData)
            .populate(this.populateVal)
            .lean();
      return result;
    } catch (err) {
      throw err;
    }
  }

  populate(populateVal) {
    try {
      this.populateVal = populateVal;
      return this;
    } catch (err) {
      throw err;
    }
  }

  async getDetails() {
    try {
      if (_.isEmpty(this.templateData.programId)) {
        throw new Error("undefined programId");
      }
      let result = await surveyTemplate
        .find({ programs: { $in: this.templateData.programId } })
        .sort({ createdAt: -1 })
        .lean();
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getOne(populateVal = {}) {
    try {
      let result;

      if (_.isEmpty(this.populateVal)) {
        result = _.isEmpty(this.templateData)
          ? await surveyTemplate.findOne({}).lean()
          : await surveyTemplate.findOne(this.templateData).lean();
        return result;
      }
      result = _.isEmpty(this.templateData)
        ? await surveyTemplate
            .findOne({})
            .populate(this.populateVal)
            .lean()
        : await surveyTemplate
            .findOne(this.templateData)
            .populate(this.populateVal)
            .lean();
      return result;
    } catch (err) {
      throw err;
    }
  }

  async updateOne() {
    try {
      let result = await surveyTemplate.updateOne(this.templateData);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async update() {
    try {
      let result = await surveyTemplate.updateMany(this.templateData);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async deleteOne() {
    try {
      let result = await surveyTemplate.deleteOne(this.templateData);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async delete() {
    try {
      let result = await surveyTemplate.deleteMany(this.templateData);
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = templateData => {
  return new SurveyTemplate(templateData);
};
