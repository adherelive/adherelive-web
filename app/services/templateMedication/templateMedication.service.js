import TemplateMedications from "../../models/templateMedications";

class TemplateMedicationService {

    getTemplateMedicationByData = async (data) => {
        try {
            console.log("careplan data --> ", data);
            const templateMedications = await TemplateMedications.findAll({
                where: data
            });
            return templateMedications;
        } catch(error) {
            throw error;
        }
    };

    getSingleTemplateMedicationByData = async (data) => {
        try {
            console.log("careplan data --> ", data);
            const templateMedication = await TemplateMedications.findOne({
                where: data
            });
            return templateMedication;
        } catch(error) {
            throw error;
        }
    };

    getMedicationsByCarePlanTemplateId = async (care_plan_template_id) => {
        try {
            const templateMedications = await TemplateMedications.findAll({
                where: care_plan_template_id
            });
            return templateMedications;
        } catch(error) {
            throw error;
        }
    };

    addTemplateMedication = async data => {
        try {
            const templateMedication = await TemplateMedications.create(data);
            return templateMedication;
        } catch(error) {
            throw error;
        }
      };
}

export default new TemplateMedicationService();