const MRLModel = require("../../models/mrl");

class MRLService {
  async createMRL(mrlCode, generatedOn, generatedBy, mrlDocs) {
    try {
      let dataToSave = {
        mrlCode,
        generatedOn,
        generatedBy,
        mrlDocs
      };
      const mrl = await MRLModel.create(dataToSave);
      return mrl;
    } catch (error) {
      throw error;
    }
  }

  async getMRL(id) {
    try {
      const mrlResponse = await MRLModel.findById(id).lean();
      return mrlResponse;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new MRLService();
