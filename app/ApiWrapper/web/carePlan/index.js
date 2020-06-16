import BaseCarePlan from "../../../services/carePlan";

class CarePlanWrapper extends BaseCarePlan {
    constructor(data) {
        super(data);
    }

    getBasicInfo = () => {
        const {_data} = this;
        const {
            id,
            name,
            doctor_id,
            patient_id,
            details,
            activated_on,
            renew_on,
            expired_on
        } = _data || {};

        return {
            basic_info: {
                id,
                name,
                doctor_id,
                patient_id,
            },
            details,
            activated_on,
            renew_on,
            expired_on
        };
    };
}

export default async (data = null, id = null) => {
    if(data) {
        return new CarePlanWrapper(data);
    }
    const carePlan = await carePlanService.getCarePlanByData({id});
    return new CarePlanWrapper(carePlan);
};