import Database from "../../../libs/mysql";
import {TABLE_NAME} from "../../models/carePlanAppointments";

class CarePlanAppointmentService {

    getAllByData = async (data) => {
        try {
            const carePlanAppointments = await Database.getModel(TABLE_NAME).findAll({
                where: data
            });
            return carePlanAppointments;
        } catch(error) {
            throw error;
        }
    };

    getCarePlanAppointmentsByData = async (data) => {
        try {
            const carePlanAppointments = await Database.getModel(TABLE_NAME).findAll({
                where: data
            });
            return carePlanAppointments;
        } catch(error) {
            throw error;
        }
    };

    getSingleCarePlanAppointmentByData = async (data) => {
        try {
            const carePlanAppointment = await Database.getModel(TABLE_NAME).findOne({
                where: data
            });
            return carePlanAppointment;
        } catch(error) {
            throw error;
        }
    };

    getAppointmentsByCarePlanId = async (care_plan_id) => {
        try {
            const carePlanAppointments = await Database.getModel(TABLE_NAME).findAll({
                where: {care_plan_id}
            });
            return carePlanAppointments;
        } catch(error) {
            throw error;
        }
    };

    deleteCarePlanAppointmentByAppointmentId = async appointment_id => {
        try {
          const carePlanAppointments = await Database.getModel(TABLE_NAME).destroy({
            where: {
                appointment_id
            }
          });
          return carePlanAppointments;
        } catch(err) {
          throw err;
        }
      };

    addCarePlanAppointment = async data => {
        try {
            const carePlanAppointment = await Database.getModel(TABLE_NAME).create(data);
            return carePlanAppointment;
        } catch(error) {
            throw error;
        }
      };
}

export default new CarePlanAppointmentService();