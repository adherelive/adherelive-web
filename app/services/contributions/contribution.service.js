import { CONTRIBUTION_TYPE } from "../../../constant";

const contributionsModel = require("../../models/contributions");

class ContributionService {
  constructor() {}

  async getContributionById(id) {
    try {
      let contribution = await contributionsModel.findOne({ _id: id }).lean();
      return contribution;
    } catch (error) {
      throw error;
    }
  }

  async editContribution(contributionId, contribution) {
    try {
      const { OOP = {}, Copay = {}, Insurance = {} } = contribution;
      let dispensation = await contributionsModel
        .findOneAndUpdate(
          {
            _id: contributionId
          },
          {
            $set: {
              OOP: { ...OOP },
              Copay: { ...Copay },
              Insurance: Insurance
            }
          },
          { new: true }
        )
        .lean();

      return dispensation;
    } catch (error) {
      throw error;
    }
  }

  async addContributionInvoice({
    invoiceData,
    contributionType,
    contributionsId
  }) {
    try {
      let dispensation = {};
      if (contributionType !== CONTRIBUTION_TYPE.INSURANCE) {
        const query = `${contributionType}.invoice`;

        dispensation = await contributionsModel
          .findOneAndUpdate(
            {
              _id: contributionsId
            },
            {
              $set: { [query]: invoiceData }
            },
            { new: true }
          )
          .lean();
      } else {
        const { provider, ...data } = invoiceData;
        const query = `${contributionType}.insurances.${provider}.invoice`;

        dispensation = await contributionsModel
          .findOneAndUpdate(
            {
              _id: contributionsId
            },
            {
              $set: { [query]: data }
            },
            { new: true }
          )
          .lean();
      }
      return dispensation;
    } catch (error) {
      throw error;
    }
  }

  async addCharityApplied(contributionsId, charityAppliedIds) {
    try {
      let dispensation = await contributionsModel
        .findOneAndUpdate(
          {
            _id: contributionsId
          },
          {
            $push: { CharityApplied: charityAppliedIds }
          },
          { new: true }
        )
        .lean();

      return dispensation;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ContributionService();
