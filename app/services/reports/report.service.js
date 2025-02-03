import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/reports";

export default class ReportService {
  constructor() {}

  addReport = async (data) => {
    const transaction = await Database.initTransaction();
    try {
      const report = await Database.getModel(TABLE_NAME).create(data, {
        raw: true,
        transaction,
      });
      await transaction.commit();
      return report;
    } catch (error) {
      await transaction.rollback();
      log.info("Error in addReport: ", error);
      throw error;
    }
  };

  updateReport = async ({ data, id }) => {
    const transaction = await Database.initTransaction();
    try {
      const report = await Database.getModel(TABLE_NAME).update(data, {
        where: {
          id,
        },
        raw: true,
        returning: true,
        transaction,
      });
      await transaction.commit();
      return report;
    } catch (error) {
      await transaction.rollback();
      log.info("Error in updateReport: ", error);
      throw error;
    }
  };

  getReportByData = async (data) => {
    try {
      return await Database.getModel(TABLE_NAME).findOne({
        where: data,
        raw: true,
      });
    } catch (error) {
      log.info("Error in getReportByData: ", error);
      throw error;
    }
  };

  getAllReportByData = async (data) => {
    try {
      return await Database.getModel(TABLE_NAME).findAll({
        where: data,
        raw: true,
        order: [["test_date", "DESC"]],
      });
    } catch (error) {
      log.info("Error in getAllReportByData: ", error);
      throw error;
    }
  };

  latestReportAndCount = async (data) => {
    try {
      return await Database.getModel(TABLE_NAME).findAndCountAll({
        where: data,
        order: [["updated_at", "DESC"]],
        raw: true,
      });
    } catch (error) {
      log.info("Error in latestReportAndCount: ", error);
      throw error;
    }
  };
}
