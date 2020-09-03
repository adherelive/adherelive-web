import BaseCarePlan from "../../../services/carePlan";
import carePlanService from "../../../services/carePlan/carePlan.service";

class CarePlanWrapper extends BaseCarePlan {
    constructor(data) {
        super(data);
    }

    getBasicInfo = () => {
        const {_data} = this;
        const {
            id,
            doctor_id,
            care_plan_template_id,
            patient_id,
            details,
            activated_on,
            renew_on,
            expired_on
        } = _data || {};

        return {
            basic_info: {
                id,
                doctor_id,
                patient_id,
                care_plan_template_id,
            },
            details,
            activated_on,
            renew_on,
            expired_on
        };
    };

    getAllInfo = () => {
        const {_data, getBasicInfo} = this;
        const {care_plan_appointments = [], care_plan_medications = []} = _data || {};

        return {
            ...getBasicInfo(),
            appointment_ids: care_plan_appointments.map(appointment => appointment.get("appointment_id")),
            medication_ids: care_plan_medications.map(medication => medication.get("medication_id")),
        }
    }
}

export default async (data = null, id = null) => {
    if(data) {
        return new CarePlanWrapper(data);
    }
    const carePlan = await carePlanService.getSingleCarePlanByData({id});
    return new CarePlanWrapper(carePlan);
};