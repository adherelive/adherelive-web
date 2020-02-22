const dispensationModel = require("../../models/dispensation");
const contributionsModel = require("../../models/contributions");
const moment = require("moment");
import { BENEFITPLAN_STATUS } from "../../../constant";
import { ObjectId } from "mongodb";

class DispensationService {
  constructor() {}
  async createdispensation(dispensationData, contribution = {}) {
    try {
      let dispensation = {};
      let contributions = await contributionsModel.create({ ...contribution });
      console.log("contributions===================== :", contributions);
      if (contributions) {
        const { _id } = contributions;
        dispensation = await dispensationModel.create({
          ...dispensationData,
          contributionsId: _id,
          status: BENEFITPLAN_STATUS.PENDING
        });
      }
      return dispensation;
    } catch (error) {
      throw error;
    }
  }

  async getDispensationById(id) {
    try {
      let dispensation = await dispensationModel.findOne({ _id: id }).lean();
      return dispensation;
    } catch (error) {
      throw error;
    }
  }

  async getdispensationByBenefitId(id) {
    try {
      let dispensation = await dispensationModel
        .find({ benefitId: id, isDelete: false })
        .lean();
      return dispensation;
    } catch (error) {
      throw error;
    }
  }
  async getdispensationForBenefitIds(benefitIds) {
    try {
      let dispensation = await dispensationModel
        .find({ benefitId: { $in: benefitIds }, isDelete: false })
        .lean();
      return dispensation;
    } catch (error) {
      throw error;
    }
  }

  async editDispensation(dispensationId, dispensationData) {
    try {
      let dispensation = await dispensationModel
        .findOneAndUpdate(
          {
            _id: dispensationId
          },
          {
            $set: { products: dispensationData }
          },
          { new: true }
        )
        .lean();

      return dispensation;
    } catch (error) {
      throw error;
    }
  }

  async makeRegenerateMRLTrue(dispensationId) {
    try {
      let dispensation = await dispensationModel
        .findOneAndUpdate(
          {
            _id: dispensationId
          },
          {
            $set: { regenerateMRL: true }
          },
          { new: true }
        )
        .lean();

      return dispensation;
    } catch (error) {
      throw error;
    }
  }

  async getDispensationForPharmacyAdmin(pharmacyId) {
    try {
      let dispensations = await dispensationModel
        .find({
          pharmacyId,
          MRL: { $exists: true, $ne: [] },
          status: "Pending"
        })
        .lean();
      return dispensations;
    } catch (error) {
      throw error;
    }
  }

  async addGenericDocs(dispensationId, genericDocs) {
    try {
      let dispensation = await dispensationModel
        .findOneAndUpdate(
          {
            _id: dispensationId
          },
          {
            $set: { charityGenericDocs: genericDocs }
          },
          { new: true }
        )
        .lean();

      return dispensation;
    } catch (error) {
      throw error;
    }
  }

  async addDispensationProductsTotal(dispensationId, prevProducts) {
    try {
      let dispensation = await dispensationModel
        .findOneAndUpdate(
          {
            _id: dispensationId
          },
          {
            $set: { charityGenericDocs: genericDocs }
          },
          { new: true }
        )
        .lean();

      return dispensation;
    } catch (error) {
      throw error;
    }
  }

  async updateProducts(dispensationId, products) {
    try {
      let dispensation = await dispensationModel
        .findOneAndUpdate(
          {
            _id: dispensationId
          },
          {
            $set: { products: products }
          },
          { new: true }
        )
        .lean();

      return dispensation;
    } catch (error) {
      throw error;
    }
  }
  async markDispensationAsCompleted(dispensationId) {
    try {
      const date = moment.now();
      let dispensation = await dispensationModel
        .findOneAndUpdate(
          {
            _id: dispensationId
          },
          {
            $set: { status: BENEFITPLAN_STATUS.COMPLETED, completionDate: date }
          },
          { new: true }
        )
        .lean();
      console.log(
        "dispensation----------------- :",
        dispensationId,
        dispensation
      );
      return dispensation;
    } catch (error) {
      throw error;
    }
  }

  async addMRLToDispensation(dispensationId, pharmacyId, mrlId) {
    try {
      let dispensation = await dispensationModel
        .findOneAndUpdate(
          {
            _id: dispensationId
          },
          {
            $set: { pharmacyId, regenerateMRL: false },
            $push: { MRL: mrlId }
          },
          { new: true }
        )
        .lean();
      console.log(
        "dispensation----------------- :",
        dispensationId,
        dispensation
      );
      return dispensation;
    } catch (error) {
      throw error;
    }
  }

  async getDispensationHistoryForPharmacyAdmin(pharmacyId) {
    try {
      const result = await dispensationModel.aggregate([
        {
          $match: {
            $and: [
              { pharmacyId: ObjectId(pharmacyId) },
              { status: "Completed" },
              { completionDate: { $lt: new Date() } }
            ]
          }
        },
        { $sort: { completionDate: -1 } },
        { $limit: 20 },
        {
          $group: {
            _id: {
              $dateToString: { date: "$completionDate", format: "%Y-%m-%d" }
            },
            dispensationIds: { $push: "$_id" },
            data: { $push: "$$ROOT" }
          }
        },
        { $sort: { _id: -1 } }
      ]);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new DispensationService();
