import BaseCarePlan from "../../../services/carePlan";
import carePlanService from "../../../services/carePlan/carePlan.service";
import carePlanAppointmentService from "../../../services/carePlanAppointment/carePlanAppointment.service";
import carePlanMedicationService from "../../../services/carePlanMedication/carePlanMedication.service";

import CarePlanAppointmentWrapper from "../../../ApiWrapper/mobile/carePlanAppointment";

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
            expired_on,
            care_plan_template_id,
        } = _data || {};

        return {
            basic_info: {
                id,
                name,
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

    getReferenceInfo = async () => {
        const {_data, getBasicInfo, getCarePlanId} = this;
        const carePlanAppointments = await carePlanAppointmentService.getAllByData({care_plan_id: getCarePlanId()});
        const carePlanMedications = await carePlanMedicationService.getAllByData({care_plan_id: getCarePlanId()});

        let care_plan_appointment_ids = [];
        for(const appointment of carePlanAppointments) {
            const appointmentData = await CarePlanAppointmentWrapper(appointment);
            // todo: wip
        }
        let care_plan_medications_ids = [];

        return {
            basic_info: getBasicInfo(),
            care_plan_appointment_ids,
            care_plan_medications_ids
        }
    };
}

export default async (data = null, id = null) => {
    if(data) {
        return new CarePlanWrapper(data);
    }
    const carePlan = await carePlanService.getCarePlanByData({id});
    return new CarePlanWrapper(carePlan);
};