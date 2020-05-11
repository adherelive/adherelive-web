const charityDocumentsModel = require("../../models/charityDocument");

class CharityDocumentServcie {
  async getCharityDocuments() {
    try {
      const charityDocuments = await charityDocumentsModel.find({}).lean();
      return charityDocuments;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new CharityDocumentServcie();
