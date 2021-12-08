import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/templateAppointments";

class TemplateAppointmentService {
  getTemplateAppointmentByData = async (data) => {
    try {
      const templateAppointments = await Database.getModel(TABLE_NAME).findAll({
        where: data,
      });
      return templateAppointments;
    } catch (error) {
      throw error;
    }
  };

  getSingleTemplateAppointmentsByData = async (data) => {
    try {
      const templateAppointment = await Database.getModel(TABLE_NAME).findOne({
        where: data,
      });
      return templateAppointment;
    } catch (error) {
      throw error;
    }
  };

  getAppointmentsByCarePlanTemplateId = async (care_plan_template_id) => {
    try {
      const templateAppointments = await Database.getModel(TABLE_NAME).findAll({
        where: care_plan_template_id,
      });
      return templateAppointments;
    } catch (error) {
      throw error;
    }
  };

  addTemplateAppointment = async (data) => {
    try {
      const templateAppointment = await Database.getModel(TABLE_NAME).create(
        data
      );
      return templateAppointment;
    } catch (error) {
      throw error;
    }
  };

  deleteAppointment = async (data) => {
    try {
      return await Database.getModel(TABLE_NAME).destroy({
        where: data,
      });
    } catch (error) {
      throw error;
    }
  };

  update = async (data, id) => {
    const transaction = await Database.initTransaction();
    try {
      const templateAppointment = await Database.getModel(TABLE_NAME).update(
        data,
        {
          where: {
            id,
          },
          transaction,
        }
      );
      await transaction.commit();
      return templateAppointment;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };
}

export default new TemplateAppointmentService();
