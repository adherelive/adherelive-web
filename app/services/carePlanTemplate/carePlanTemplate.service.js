import { Op } from "sequelize";
import Database from "../../../libs/mysql";

import { TABLE_NAME } from "../../models/careplanTemplate";
import { TABLE_NAME as appointmentTemplateTableName } from "../../models/templateAppointments";
import { TABLE_NAME as medicationTemplateTableName } from "../../models/templateMedications";
import { TABLE_NAME as vitalTemplateTableName } from "../../models/templateVitals";
import { TABLE_NAME as dietTemplateTableName } from "../../models/templateDiets";
import { TABLE_NAME as workoutTemplateTableName } from "../../models/templateWorkouts";

import { TABLE_NAME as conditionTableName } from "../../models/conditions";
import { TABLE_NAME as severityTableName } from "../../models/severity";
import { TABLE_NAME as treatmentTableName } from "../../models/treatments";
import { TABLE_NAME as medicineTableName } from "../../models/medicines";

class CarePlanTemplateService {
  getCarePlanTemplateById = async (id) => {
    try {
      const carePlanTemplate = await Database.getModel(TABLE_NAME).findOne({
        where: {
          id,
        },
        include: [
          Database.getModel(conditionTableName),
          Database.getModel(severityTableName),
          Database.getModel(treatmentTableName),
          Database.getModel(appointmentTemplateTableName),
          {
            model: Database.getModel(medicationTemplateTableName),
            include: {
              model: Database.getModel(medicineTableName),
              required: true,
            },
          },
          Database.getModel(vitalTemplateTableName),
          Database.getModel(dietTemplateTableName),
          Database.getModel(workoutTemplateTableName),
        ],
      });
      return carePlanTemplate;
    } catch (error) {
      throw error;
    }
  };

  create = async (data) => {
    try {
      const carePlanTemplate = await Database.getModel(TABLE_NAME).create(
        data,
        {
          include: [
            Database.getModel(appointmentTemplateTableName),
            Database.getModel(medicationTemplateTableName),
            Database.getModel(vitalTemplateTableName),
            Database.getModel(dietTemplateTableName),
            Database.getModel(workoutTemplateTableName),
          ],
        }
      );
      return carePlanTemplate;
    } catch (error) {
      throw error;
    }
  };

  update = async (data, id) => {
    const transaction = await Database.initTransaction();
    try {
      const carePlanTemplate = await Database.getModel(TABLE_NAME).update(
        data,
        {
          where: {
            id,
          },
          include: [
            Database.getModel(appointmentTemplateTableName),
            Database.getModel(medicationTemplateTableName),
            Database.getModel(vitalTemplateTableName),
            Database.getModel(dietTemplateTableName),
            Database.getModel(workoutTemplateTableName),
          ],
        }
      );
      await transaction.commit();
      return carePlanTemplate;
    } catch (error) {
      await transaction.rollback();
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
          condition_id,
        },
        include: [
          Database.getModel(conditionTableName),
          Database.getModel(severityTableName),
          Database.getModel(treatmentTableName),
          Database.getModel(appointmentTemplateTableName),
          {
            model: Database.getModel(medicationTemplateTableName),
            include: {
              model: Database.getModel(medicineTableName),
              required: true,
            },
          },
          Database.getModel(vitalTemplateTableName),
          Database.getModel(dietTemplateTableName),
          Database.getModel(workoutTemplateTableName),
        ],
      });
      return carePlanTemplate;
    } catch (error) {
      throw error;
    }
  };

  getCarePlanTemplateData = async (data) => {
    try {
      const { user_id, treatment_id, ...rest } = data;
      const carePlanTemplate = await Database.getModel(TABLE_NAME).findAll({
        where: {
          [Op.or]: [
            {
              treatment_id: { [Op.eq]: treatment_id },
              user_id: { [Op.eq]: null },
            },
            {
              user_id: { [Op.eq]: user_id },
            },
          ],
          ...rest,
        },
        include: [
          Database.getModel(conditionTableName),
          Database.getModel(severityTableName),
          Database.getModel(treatmentTableName),
          Database.getModel(appointmentTemplateTableName),
          {
            model: Database.getModel(medicationTemplateTableName),
            include: {
              model: Database.getModel(medicineTableName),
              required: true,
            },
          },
          Database.getModel(vitalTemplateTableName),
          Database.getModel(dietTemplateTableName),
          Database.getModel(workoutTemplateTableName),
        ],
        order: [["updated_at", "DESC"]],
      });
      return carePlanTemplate;
    } catch (error) {
      throw error;
    }
  };

  getSingleTemplateByData = async (data) => {
    try {
      const carePlanTemplate = await Database.getModel(TABLE_NAME).findOne({
        where: data,
      });
      return carePlanTemplate;
    } catch (error) {
      throw error;
    }
  };

  addCarePlanTemplate = async (data) => {
    try {
      const carePlanTemplate = await Database.getModel(TABLE_NAME).create(data);
      return carePlanTemplate;
    } catch (error) {
      throw error;
    }
  };

  deleteTemplate = async (data) => {
    try {
      return await Database.getModel(TABLE_NAME).destroy({
        where: data,
      });
    } catch (error) {
      throw error;
    }
  };

  /*
  user_id
  provider_id
  doctor_id
  user_id -> show
  provider_id & is_public_in_provier== true -> show
  user_id &
  */

  getAllTemplatesForDoctor = async (data) => {
    try {
      const { user_id, doctor_id, provider_id, ...rest } = data;
      console.log("=1=1=1==1=1=1=1==1=1=1=1==1=1=1=1=1");
      console.log({ user_id, doctor_id, provider_id, rest });
      console.log("=1=1=1==1=1=1=1==1=1=1=1==1=1=1=1=1");
      const carePlanTemplate = await Database.getModel(TABLE_NAME).findAll({
        where: {
          [Op.or]: [
            {
              user_id: { [Op.eq]: null },
            },
            {
              user_id: { [Op.eq]: user_id },
            },
            {
              provider_id: { [Op.eq]: provider_id },
              is_public_in_provider: { [Op.eq]: true },
            },
          ],
          ...rest,
        },
        include: [
          Database.getModel(conditionTableName),
          Database.getModel(severityTableName),
          Database.getModel(treatmentTableName),
          Database.getModel(appointmentTemplateTableName),
          {
            model: Database.getModel(medicationTemplateTableName),
            include: {
              model: Database.getModel(medicineTableName),
              required: true,
            },
          },
          Database.getModel(vitalTemplateTableName),
          Database.getModel(dietTemplateTableName),
          Database.getModel(workoutTemplateTableName),
        ],
        order: [["updated_at", "DESC"]],
      });
      return carePlanTemplate;
    } catch (error) {
      throw error;
    }
  };
}

export default new CarePlanTemplateService();
