const _ = require("lodash");
const question = require("../schema/question");

class SurveyQuestions {
  constructor(data = {}) {
    this.data = data;
  }

  async set() {
    try {
      let set_result = await question.insertMany(this.data);
      return set_result;
    } catch (err) {
      throw err;
    }
  }

  async getOne() {
    try {
      let { data } = this;
      let result = _.isEmpty(data)
        ? await question.findOne({})
        : await question.findOne(this.data);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async get() {
    try {
      let { data } = this;
      let result = _.isEmpty(data)
        ? await question.find({})
        : await question.find(this.data);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async update() {}

  async delete() {}
}

module.exports = data => {
  return new SurveyQuestions(data);
};
