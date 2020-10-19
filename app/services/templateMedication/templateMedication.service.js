import Database from "../../../libs/mysql";
import {TABLE_NAME} from "../../models/templateMedications";


class TemplateMedicationService {

    getTemplateMedicationByData = async (data) => {
        try {
            const templateMedications = await Database.getModel(TABLE_NAME).findAll({
                where: data
            });
            return templateMedications;
        } catch(error) {
            throw error;
        }
    };

    getSingleTemplateMedicationByData = async (data) => {
        try {
            const templateMedication = await Database.getModel(TABLE_NAME).findOne({
                where: data
            });
            return templateMedication;
        } catch(error) {
            throw error;
        }
    };

    getMedicationsByCarePlanTemplateId = async (care_plan_template_id) => {
        try {
            const templateMedications = await Database.getModel(TABLE_NAME).findAll({
                where: care_plan_template_id
            });
            return templateMedications;
        } catch(error) {
            throw error;
        }
    };

    addTemplateMedication = async data => {
        try {
            const templateMedication = await Database.getModel(TABLE_NAME).create(data);
            return templateMedication;
        } catch(error) {
            throw error;
        }
      };
}

export default new TemplateMedicationService();