import TemplateAppointments from "../../models/templateAppointments";

class TemplateAppointmentService {

    getTemplateAppointmentByData = async (data) => {
        try {
            console.log("careplan data --> ", data);
            const templateAppointments = await TemplateAppointments.findAll({
                where: data
            });
            return templateAppointments;
        } catch(error) {
            throw error;
        }
    };

    getSingleTemplateAppointmentsByData = async (data) => {
        try {
            console.log("careplan data --> ", data);
            const templateAppointment = await TemplateAppointments.findOne({
                where: data
            });
            return templateAppointment;
        } catch(error) {
            throw error;
        }
    };

    getAppointmentsByCarePlanTemplateId = async (care_plan_template_id) => {
        try {
            const templateAppointments = await TemplateAppointments.findAll({
                where: care_plan_template_id
            });
            return templateAppointments;
        } catch(error) {
            throw error;
        }
    };

    addTemplateAppointment = async data => {
        try {
            const templateAppointment = await TemplateAppointments.create(data);
            return templateAppointment;
        } catch(error) {
            throw error;
        }
      };
}

export default new TemplateAppointmentService();