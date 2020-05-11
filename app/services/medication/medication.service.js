const moment = require("moment");
const medicationModel = require("../../models/medication");
const medicationServiceHelper = require("./medicationServiceHelper");

class MedicationService {
  async getMedication(userId) {
    try {
      let response = await medicationModel.findOne({
        userId: userId
      });
      return response;
    } catch (err) {
      throw err;
    }
  }

  //param data ={}
  async addMedication(data) {
    try {
      const response = await medicationModel.create(data);
      return response;
    } catch (err) {
      throw err;
    }
  }

  async updateMedication(data, userId) {
    try {
      const updateAt = moment().format();
      const response = await medicationModel.findOneAndUpdate(
        { userId: userId },
        { $push: { medicine: data } },
        { new: true }
      );
      return response;
    } catch (err) {
      throw err;
    }
  }

  async removeMedicine(productId, userId) {
    try {
      const lastMedication = await this.getMedications({
        userId: userId
      });

      // ("----------lastmedddddication--------", lastMedication)

      const afterdeleteMedicine = await medicationServiceHelper.deleteMedicine(
        lastMedication[0],
        productId
      );

      const response = await medicationModel.findOneAndUpdate(
        { userId: userId },
        { $push: { medicine: afterdeleteMedicine } },
        { new: true }
      );
      return response;
    } catch (err) {
      throw err;
    }
  }

  //params forUser = {userId:_id of user}
  async getMedications(forUser) {
    try {
      // (forUser,"*****")
      const response = await medicationModel.find(forUser).limit(1);
      return response === null ? [] : response;
    } catch (err) {
      throw err;
    }
  }

  async getMedicationById(medicationId) {
    try {
      // (forUser,"*****")
      const response = await medicationModel.find({ _id: medicationId }).lean();
      return response === null ? [] : response;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new MedicationService();
