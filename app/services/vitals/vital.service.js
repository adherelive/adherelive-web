import Vitals from "../../models/vitals";
import VitalTemplates from "../../models/vitalTemplates";
import CarePlan from "../../models/carePlan";
import CarePlanAppointment from "../../models/carePlanAppointments";
import CarePlanMedication from "../../models/carePlanMedications";
import { database } from "../../../libs/mysql";

class VitalService {
  addVital = async data => {
    try {
      const vitals = await Vitals.create(data);
      return vitals;
    } catch (error) {
      throw error;
    }
  };

  update = async (data, id) => {
    const transaction = await database.transaction();
    try {
      const vitals = await Vitals.update(data, {
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
      const vitals = await Vitals.findOne({
        where: data,
        include: [
          {
            model: VitalTemplates
          },
          {
            model: CarePlan,
            include: [CarePlanAppointment, CarePlanMedication]
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
      const vitals = await Vitals.findAll({
        where: data,
        include: [
          {
            model: VitalTemplates
          },
          {
            model: CarePlan
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
