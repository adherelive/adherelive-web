import Database from "../../../libs/mysql";

import {TABLE_NAME} from "../../models/vitals";
import {TABLE_NAME as vitalTemplatesTableName} from "../../models/vitalTemplates";
import {TABLE_NAME as carePlanTableName} from "../../models/carePlan";
import {TABLE_NAME as carePlanAppointmentTableName} from "../../models/carePlanAppointments";
import {TABLE_NAME as carePlanMedicationTableName} from "../../models/carePlanMedications";

class VitalService {
  addVital = async data => {
    try {
      const vitals = await Database.getModel(TABLE_NAME).create(data);
      return vitals;
    } catch (error) {
      throw error;
    }
  };

  update = async (data, id) => {
    const transaction = await Database.initTransaction();
    try {
      const vitals = await Database.getModel(TABLE_NAME).update(data, {
        where: {
          id
        }
      });
      await transaction.commit();
      return vitals;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  getByData = async data => {
    try {
      const vitals = await Database.getModel(TABLE_NAME).findOne({
        where: data,
        include: [
          {
            model: Database.getModel(vitalTemplatesTableName)
          },
          {
            model: Database.getModel(carePlanTableName),
            include: [Database.getModel(carePlanAppointmentTableName), Database.getModel(carePlanMedicationTableName)]
          }
        ]
      });
      return vitals;
    } catch (error) {
      throw error;
    }
  };

  getAllByData = async data => {
    try {
      const vitals = await Database.getModel(TABLE_NAME).findAll({
        where: data,
        include: [
          {
            model: Database.getModel(vitalTemplatesTableName)
          },
          {
            model: Database.getModel(carePlanTableName)
          }
        ]
      });
      return vitals;
    } catch (error) {
      throw error;
    }
  };
}

export default new VitalService();
