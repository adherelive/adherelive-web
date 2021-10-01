import { Op } from "sequelize";
import Database from "../../../libs/mysql";
import moment from "moment";

import { TABLE_NAME } from "../../models/symptoms";
import { TABLE_NAME as doctorTableName } from "../../models/doctors";
import { TABLE_NAME as patientTableName } from "../../models/patients";
import { TABLE_NAME as carePlanTableName } from "../../models/carePlan";

class SymptomService {
  create = async data => {
    try {
      const symptom = await Database.getModel(TABLE_NAME).create(data);
      return symptom;
    } catch (error) {
      throw error;
    }
  };

  getByData = async data => {
    try {
      const symptom = await Database.getModel(TABLE_NAME).findOne({
        where: data,
        include: [
          {
            model: Database.getModel(patientTableName)
          },
          {
            model: Database.getModel(carePlanTableName),
            include: [Database.getModel(doctorTableName)]
          }
        ]
      });
      return symptom;
    } catch (error) {
      throw error;
    }
  };

  getCount = async (data) => {
    try {
      return await Database.getModel(TABLE_NAME).count({
        where: {
          ...data,
          created_at: {
            [Op.between]: [moment().utc().subtract(7, "days").toISOString(), moment().utc().toISOString()]
          }
        },
      });
    } catch (error) {
      throw error;
    }
  };

  getAllByData = async data => {
    try {
      const symptom = await Database.getModel(TABLE_NAME).findAll({
        where: data,
        include: [
          {
            model: Database.getModel(patientTableName)
          },
          {
            model: Database.getModel(carePlanTableName),
            include: [Database.getModel(doctorTableName)]
          }
        ]
      });
      return symptom;
    } catch (error) {
      throw error;
    }
  };

  getFilteredData = async data => {
    try {
      const { patient_id, start_time, end_time } = data || {};
      const symptom = await Database.getModel(TABLE_NAME).findAll({
        where: {
          patient_id,
          created_at: {
            [Op.between]: [start_time, end_time]
          }
        },
        include: [
          {
            model: Database.getModel(patientTableName)
          },
          {
            model: Database.getModel(carePlanTableName),
            include: [Database.getModel(doctorTableName)]
          }
        ]
      });
      return symptom;
    } catch (error) {
      throw error;
    }
  };

  getLastUpdatedData = async data => {
    try {
      const symptom = await Database.getModel(TABLE_NAME).findAll({
        where: data,
        limit: 1,
        order: [["updated_at", "DESC"]],
        include: [
          {
            model: Database.getModel(patientTableName)
          },
          {
            model: Database.getModel(carePlanTableName),
            include: [Database.getModel(doctorTableName)]
          }
        ]
      });
      return symptom;
    } catch (error) {
      throw error;
    }
  };
}

export default new SymptomService();
