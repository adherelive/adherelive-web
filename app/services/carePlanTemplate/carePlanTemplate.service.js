import { Op } from "sequelize";
import Database from "../../../libs/mysql";

import {TABLE_NAME} from "../../models/careplanTemplate";
import {TABLE_NAME as appointmentTemplateTableName} from "../../models/templateAppointments";
import {TABLE_NAME as medicationTemplateTableName} from "../../models/templateMedications";
import {TABLE_NAME as conditionTableName} from "../../models/conditions";
import {TABLE_NAME as severityTableName} from "../../models/severity";
import {TABLE_NAME as treatmentTableName} from "../../models/treatments";

class CarePlanTemplateService {
  getCarePlanTemplateById = async id => {
    try {
      const carePlanTemplate = await Database.getModel(TABLE_NAME).findOne({
        where: id,
        include: [
          Database.getModel(conditionTableName),
          Database.getModel(severityTableName),
          Database.getModel(treatmentTableName),
          Database.getModel(appointmentTemplateTableName),
          Database.getModel(medicationTemplateTableName),
        ]
      });
      return carePlanTemplate;
    } catch (error) {
      throw error;
    }
  };

  create = async data => {
    try {
      const carePlanTemplate = await Database.getModel(TABLE_NAME).create(data, {
        include: [
          Database.getModel(appointmentTemplateTableName),
          Database.getModel(medicationTemplateTableName),
        ]
      });
      return carePlanTemplate;
    } catch (error) {
      throw error;
    }
  };

  getCarePlanTemplateByData = async (
    treatment_id,
    severity_id,
    condition_id
  ) => {
    try {
      const carePlanTemplate = await Database.getModel(TABLE_NAME).findOne({
        where: {
          treatment_id,
          severity_id,
          condition_id
        },
        include: [
          Database.getModel(conditionTableName),
          Database.getModel(severityTableName),
          Database.getModel(treatmentTableName),
          Database.getModel(appointmentTemplateTableName),
          Database.getModel(medicationTemplateTableName),
        ]
      });
      return carePlanTemplate;
    } catch (error) {
      throw error;
    }
  };

  getCarePlanTemplateData = async data => {
    try {
      const { user_id, treatment_id, severity_id, condition_id } = data;
      const carePlanTemplate = await Database.getModel(TABLE_NAME).findAll({
        where: {
          [Op.or]: [
            {
              treatment_id: { [Op.eq]: treatment_id },
              severity_id: { [Op.eq]: severity_id },
              condition_id: { [Op.eq]: condition_id }
            },
            {
              condition_id: { [Op.eq]: condition_id },
              user_id: { [Op.eq]: user_id }
            }
          ]
        },
        include: [
          Database.getModel(conditionTableName),
          Database.getModel(severityTableName),
          Database.getModel(treatmentTableName),
          Database.getModel(appointmentTemplateTableName),
          Database.getModel(medicationTemplateTableName),
        ]
      });
      return carePlanTemplate;
    } catch (error) {
      throw error;
    }
  };

  getSingleTemplateByData = async data => {
    try {
      const carePlanTemplate = await Database.getModel(TABLE_NAME).findOne({
        where: data
      });
      return carePlanTemplate;
    } catch (error) {
      throw error;
    }
  };

  addCarePlanTemplate = async data => {
    try {
      const carePlanTemplate = await Database.getModel(TABLE_NAME).create(data);
      return carePlanTemplate;
    } catch (error) {
      throw error;
    }
  };
}

export default new CarePlanTemplateService();
