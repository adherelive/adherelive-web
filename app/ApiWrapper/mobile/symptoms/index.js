import BaseSymptom from "../../../services/symptom";

// SERVICES
import SymptomService from "../../../services/symptom/symptom.service";

class SymptomWrapper extends BaseSymptom {
    constructor(data) {
        super(data);
    }

    getBasicInfo = () => {
        const {_data} = this;
        const {
            id,
            patient_id,
            care_plan_id,
            config,
            text
        } = _data || {};

        return {
            basic_info: {
                id,
                patient_id,
                care_plan_id
            },
            config,
            text
        };
    };
}

export default async ({data = null, id = null}) => {
    if(data) {
        return new SymptomWrapper(data);
    }
    const symptom = await SymptomService.getByData({id});
    return new SymptomWrapper(symptom);
};