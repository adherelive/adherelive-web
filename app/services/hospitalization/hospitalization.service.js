const hospitalizationModel = require("../../models/hospitalization");

class HospitalizationService {
  async addHospitalization(userId, data) {
    try {
      const hospitalization = await hospitalizationModel.findOneAndUpdate(
        { userId },
        { $push: { hospitalization: data } },
        { upsert: true, new: true }
      );
      return hospitalization;
    } catch (error) {
      throw error;
    }
  }

  async getHospitalizationByUserId(userId) {
    try {
      let response = await hospitalizationModel.findOne({
        userId: userId
      });
      return response;
    } catch (err) {
      throw err;
    }
  }

  async getHospitalizationById(id) {
    try {
      let response = await hospitalizationModel
        .findOne({
          _id: id
        })
        .lean();
      return response;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new HospitalizationService();
