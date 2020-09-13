import TreatmentConditionMapping from "../../models/treatmentConditionMapping";

class TreatmentConditionService {

    getAll = async (data) => {
        try {
            const treatmentCondition = await TreatmentConditionMapping.findAll({
                where: data
            });
            return treatmentCondition;
        } catch(error) {
            throw error;
        }
    };

}

export default new TreatmentConditionService();
