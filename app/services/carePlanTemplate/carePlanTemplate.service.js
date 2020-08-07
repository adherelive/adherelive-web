import CarePlanTemplate from "../../models/careplanTemplate";

class CarePlanTemplateService {

    getCarePlanTemplateById = async (id) => {
        try {
            const carePlanTemplate = await CarePlanTemplate.findOne({
                where: id
            });
            return carePlanTemplate;
        } catch (error) {
            throw error;
        }
    };

    getCarePlanTemplateByData = async (treatment_id, severity_id, condition_id) => {
        try {
            const carePlanTemplate = await CarePlanTemplate.findOne({
                where: {
                    treatment_id,
                    severity_id,
                    condition_id,
                }
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