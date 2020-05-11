const benefitPlanDocumentModel = require("../../models/benefitPlanDocuments");

class BenefitPlanDocumentService {
  constructor() {}

  async getBenefitPlan(documentIds) {
    try {
      let benefitPlan = await benefitPlanDocumentModel
        .find({
          _id: {
            $in: documentIds
          }
        })
        .lean();
      return benefitPlan;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new BenefitPlanDocumentService();
