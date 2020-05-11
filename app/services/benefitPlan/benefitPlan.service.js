const benefitPlanModel = require("../../models/benefitPlan");
import { BENEFITPLAN_STATUS } from "../../../constant";

class BenefitPlanService {
  constructor() {}

  async createBenefitPlan(benefitPlanData) {
    try {
      let benefitPlan = await benefitPlanModel.create(benefitPlanData);
      return benefitPlan;
    } catch (error) {
      throw error;
    }
  }

  async getBenefitPlanById(id) {
    try {
      let benefitPlan = await benefitPlanModel.findOne({ _id: id }).lean();
      return benefitPlan;
    } catch (error) {
      throw error;
    }
  }

  async getBenefitPlanOfUser(userId) {
    try {
      let benefitPlan = await benefitPlanModel.find({ userId: userId }).lean();
      return benefitPlan;
    } catch (error) {
      throw error;
    }
  }

  async updateBenefitDoc({ benefitId, docId, data, allDocsVerified }) {
    try {
      const query = `benefitDocs.${[docId]}`;
      let benefitPlan = await benefitPlanModel
        .findOneAndUpdate(
          { _id: benefitId },
          {
            $set: { [query]: data, isBenefitDocsVerified: allDocsVerified }
          },
          { new: true }
        )
        .lean();
      return benefitPlan;
    } catch (error) {
      throw error;
    }
  }

  async verifyBenefitDoc({ benefitId, docId, allDocsVerified }) {
    try {
      const query = `benefitDocs.${[docId]}.isVerified`;
      let benefitPlan = await benefitPlanModel
        .findOneAndUpdate(
          { _id: benefitId },
          {
            $set: { [query]: true, isBenefitDocsVerified: allDocsVerified }
          },
          { new: true }
        )
        .lean();
      return benefitPlan;
    } catch (error) {
      throw error;
    }
  }

  async editBenenfitSummary(benefitId, data) {
    try {
      const { name, endDate, startDate } = data;
      let benefitPlan = await benefitPlanModel
        .findOneAndUpdate(
          { _id: benefitId },
          {
            $set: { name: name, startDate: startDate, endDate: endDate }
          },
          { new: true }
        )
        .lean();
      return benefitPlan;
    } catch (error) {
      throw error;
    }
  }

  async getPendingBenefitPlanOfUser(userId) {
    try {
      let benefitPlan = await benefitPlanModel
        .find({ userId: userId, status: "Pending" })
        .lean();
      return benefitPlan;
    } catch (error) {
      throw error;
    }
  }

  async markPlanAsComplete(benefitId) {
    try {
      let benefitPlan = await benefitPlanModel
        .findOneAndUpdate(
          { _id: benefitId },
          {
            $set: { status: BENEFITPLAN_STATUS.COMPLETED }
          },
          { new: true }
        )
        .lean();
      return benefitPlan;
      return benefitPlan;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new BenefitPlanService();
