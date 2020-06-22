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

    getCarePlanTemplateByData = async (type, severity, condition) => {
        try {
            const carePlanTemplate = await CarePlanTemplate.findOne({
                where: {
                    type,
                    severity,
                    condition,
                    deleted_at: null
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