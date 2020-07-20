import BaseCarePlanTemplate from "../../../services/carePlanTemplate";
import carePlanTemplateService from "../../../services/carePlanTemplate/carePlanTemplate.service";

class CarePlanTemplateWrapper extends BaseCarePlanTemplate {
    constructor(data) {
        super(data);
    }

    getBasicInfo = () => {
        const {_data} = this;
        const {
            id,
            name,
            treatment_id,
            severity_id,
            condition_id,
            details = {}
        } = _data || {};

        return {
            basic_info: {
                id,
                name,
                treatment_id,
                severity_id,
                condition_id,
            },
            details
        };
    };

    // TODO ::
    // getReferenceInfo = async () => {
    //     const {getBasicInfo, getCarePlanAppointmentId, getAppointmentId, getCarePlanId, _data} = this;
    //
    //     const appointment = await appointmentService.getAppointmentById(getAppointmentId());
    //     const appointmentData = await AppointmentWrapper(appointment);
    //
    //     const carePlan = await carePlanService.getCarePlanById(getCarePlanId());
    //     const carePlanData = await CarePlanWrapper(carePlan);
    //
    //     return {
    //         care_plan_appointments: {
    //             [getCarePlanAppointmentId()]: getBasicInfo()
    //         },
    //         appointments: {
    //             [getAppointmentId()]: appointmentData.getBasicInfo()
    //         },
    //         care_plans: {
    //             [getCarePlanId()]: {
    //                 ...carePlanData.getBasicInfo(),
    //                 care_plan_appointment_ids: [getCarePlanAppointmentId()]
    //             }
    //         }
    //     }
    // };
}

export default async (data = null, id = null) => {
    if(data) {
        return new CarePlanTemplateWrapper(data);
    }
    const carePlanTemplate = await carePlanTemplateService.getCarePlanTemplateById(id);
    return new CarePlanTemplateWrapper(carePlanTemplate);
};