import Database from "../../../libs/mysql";

// TABLES
import { TABLE_NAME } from "../../models/patientPaymentConsentMapping";

const DEFAULT_ORDER = [["created_at", "DESC"]];

class PatientPaymentConsentMappingService {
  constructor() {}

  async create(data) {
    const transaction = await Database.initTransaction();
    try {
      const response = await Database.getModel(TABLE_NAME).create(data, {
        transaction,
      });
      await transaction.commit();
      return response;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  getSingleEntityByData = async (data) => {
    try {
      const response = await Database.getModel(TABLE_NAME).findOne({
        where: data,
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  getAllByData = async (data) => {
    try {
      const response = await Database.getModel(TABLE_NAME).findAll({
        where: data,
        // raw: true,
        // nest: true,
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  findAndCountAll = async ({ where, order = DEFAULT_ORDER, attributes }) => {
    try {
      return await Database.getModel(TABLE_NAME).findAndCountAll({
        where,
        order,
        attributes,
        raw: true,
      });
    } catch (error) {
      throw error;
    }
  };

  findOne = async ({ where, order = DEFAULT_ORDER, attributes }) => {
    try {
      return await Database.getModel(TABLE_NAME).findOne({
        where,
        order,
        attributes,
        raw: true,
      });
    } catch (error) {
      throw error;
    }
  };

  update = async (data, id) => {
    const transaction = await Database.initTransaction();
    try {
      const updatedRecord = await Database.getModel(TABLE_NAME).update(data, {
        where: {
          id,
        },
        transaction,
      });
      await transaction.commit();
      return updatedRecord;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };
}

export default new PatientPaymentConsentMappingService();
