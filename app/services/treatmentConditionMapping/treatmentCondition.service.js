import database from "../../../libs/mysql";

const {treatment_condition_mappings: TreatmentConditionMapping} = database.models;

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
