import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/medicationReminders";
import { TABLE_NAME as medicineTableName } from "../../models/medicines";

class MReminderService {
  async addMReminder(data) {
    try {
      const response = await Database.getModel(TABLE_NAME).create(data);
      return response;
    } catch (err) {
      throw err;
    }
  }

  updateMedication = async (data, id) => {
    try {
      const medication = await Database.getModel(TABLE_NAME).update(data, {
        where: {
          id
        }
      });
      return medication;
    } catch (err) {
      throw err;
    }
  };

  getMedication = async data => {
    try {
      const medication = await Database.getModel(TABLE_NAME).findOne({
        where: data,
        include: [
          {
            model: Database.getModel(medicineTableName),
            required: true
          }
        ]
      });
      return medication;
    } catch (err) {
      throw err;
    }
  };

  getMedicationsForParticipant = async data => {
    try {
      const medications = await Database.getModel(TABLE_NAME).findAll({
        where: data,
        include: [
          {
            model: Database.getModel(medicineTableName),
            required: true
          }
        ]
      });
      return medications;
    } catch (error) {
      throw error;
    }
  };

  deleteMedication = async id => {
    try {
      const medication = await Database.getModel(TABLE_NAME).destroy({
        where: {
          id
        }
      });
      return medication;
    } catch (err) {
      throw err;
    }
  };

  getAllMedicationByData = async data => {
    try {
      return await Database.getModel(TABLE_NAME).findAll({
        where: data,
        include: [
          {
            model: Database.getModel(medicineTableName),
            required: true
          }
        ]
      });
    } catch (error) {
      throw error;
    }
  };
}

export default new MReminderService();
