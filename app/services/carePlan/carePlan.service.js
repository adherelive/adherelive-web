import Database from "../../../libs/mysql";

import { TABLE_NAME } from "../../models/carePlan";
import { TABLE_NAME as patientTableName } from "../../models/patients";
import { TABLE_NAME as doctorTableName } from "../../models/doctors";
import { TABLE_NAME as carePlanAppointmentTableName } from "../../models/carePlanAppointments";
import { TABLE_NAME as carePlanMedicationTableName } from "../../models/carePlanMedications";

class CarePlanService {
  getCarePlanByData = async data => {
    try {
      const carePlan = await Database.getModel(TABLE_NAME).findAll({
        where: data,
        include: [
          Database.getModel(patientTableName),
          Database.getModel(doctorTableName),
          Database.getModel(carePlanAppointmentTableName),
          Database.getModel(carePlanMedicationTableName)
        ]
      });
      return carePlan;
    } catch (error) {
      throw error;
    }
  };

  getCarePlanById = async id => {
    try {
      const carePlan = await Database.getModel(TABLE_NAME).findOne({
        where: { id },
        include: [
          Database.getModel(patientTableName),
          Database.getModel(doctorTableName),
          Database.getModel(carePlanAppointmentTableName),
          Database.getModel(carePlanMedicationTableName)
        ]
      });
      return carePlan;
    } catch (error) {
      throw error;
    }
  };

  getSingleCarePlanByData = async data => {
    try {
      const carePlan = await Database.getModel(TABLE_NAME).findOne({
        where: data,
        include: [
          Database.getModel(patientTableName),
          Database.getModel(doctorTableName),
          Database.getModel(carePlanAppointmentTableName),
          Database.getModel(carePlanMedicationTableName)
        ]
      });
      return carePlan;
    } catch (error) {
      throw error;
    }
  };

  updateCarePlan = async (data, id) => {
    try {
      const carePlan = await Database.getModel(TABLE_NAME).update(data, {
        where: {
          id
        }
      });
      return carePlan;
    } catch (error) {
      throw error;
    }
  };

  addCarePlan = async data => {
    try {
      const carePlan = await Database.getModel(TABLE_NAME).create(data);
      return carePlan;
    } catch (error) {
      throw error;
    }
  };
}

export default new CarePlanService();
