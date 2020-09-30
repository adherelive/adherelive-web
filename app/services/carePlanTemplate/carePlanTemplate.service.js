import { Op } from "sequelize";
import database from "../../../libs/mysql";

const {
  care_plan_templates: CarePlanTemplate,
  template_appointments: TemplateAppointment,
  template_medications: TemplateMedication,
  conditions: Condition,
  severity: Severity,
  treatments: Treatment
} = database.models;

class CarePlanTemplateService {
  getCarePlanTemplateById = async id => {
    try {
      const carePlanTemplate = await CarePlanTemplate.findOne({
        where: id,
        include: [
          Condition,
          Severity,
          Treatment,
          TemplateAppointment,
          TemplateMedication
        ]
      });
      return carePlanTemplate;
    } catch (error) {
      throw error;
    }
  };

  create = async data => {
    try {
      const carePlanTemplate = await CarePlanTemplate.create(data, {
        include: [TemplateAppointment, TemplateMedication]
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
      const carePlanTemplate = await CarePlanTemplate.findOne({
        where: {
          treatment_id,
          severity_id,
          condition_id
        },
        include: [
          Condition,
          Severity,
          Treatment,
          TemplateAppointment,
          TemplateMedication
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
      const carePlanTemplate = await CarePlanTemplate.findAll({
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
          Condition,
          Severity,
          Treatment,
          TemplateAppointment,
          TemplateMedication
        ]
      });
      return carePlanTemplate;
    } catch (error) {
      throw error;
    }
  };

  getSingleTemplateByData = async data => {
    try {
      const carePlanTemplate = await CarePlanTemplate.findOne({
        where: data
      });
      return carePlanTemplate;
    } catch (error) {
      throw error;
    }
  };

  addCarePlanTemplate = async data => {
    try {
      const carePlanTemplate = await CarePlanTemplate.create(data);
      return carePlanTemplate;
    } catch (error) {
      throw error;
    }
  };
}

export default new CarePlanTemplateService();
