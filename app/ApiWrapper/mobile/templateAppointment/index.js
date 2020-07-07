import BaseTemplateAppointment from "../../../services/templateAppointment";
import templateAppointmentService from "../../../services/templateAppointment/templateAppointment.service";

class TemplateAppointmentWrapper extends BaseTemplateAppointment {
    constructor(data) {
        super(data);
    }

    getBasicInfo = () => {
        const { _data } = this;
        const {
            id,
            care_plan_template_id,
            reason,
            time_gap,
            details,
        } = _data || {};
        return {
            basic_info: {
                id,
                care_plan_template_id,
            },
            reason,
            time_gap,
            details,
        };
    };
}

export default async (data = null, id = null) => {
    if (data !== null) {
        return new TemplateAppointmentWrapper(data);
    }
    const templateAppointment = await templateAppointmentService.getSingleTemplateAppointmentsByData({ id });
    return new TemplateAppointmentWrapper(templateAppointment.get());
};
