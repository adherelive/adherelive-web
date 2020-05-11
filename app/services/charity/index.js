const charityModel = require("../../models/charity");

class CharityService {
  async getCharityByCharityAdminId(id) {
    try {
      const query = { [`charityAdmin.${id}`]: { $exists: true } };
      let charity = await charityModel.findOne(query).lean();
      return charity;
    } catch (error) {
      throw error;
    }
  }

  async getAllCharities() {
    try {
      let charity = await charityModel.find().lean();
      return charity;
    } catch (error) {
      throw error;
    }
  }

  async getCharityById(id) {
    try {
      let charity = await charityModel.findById(id).lean();
      return charity;
    } catch (error) {
      throw error;
    }
  }

  async getCharityForIds(Ids) {
    try {
      let charities = await charityModel.find({ _id: { $in: Ids } }).lean();
      return charities;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new CharityService();
