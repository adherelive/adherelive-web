import CarePlanTemplate from "../../models/careplanTemplate";
import TemplateAppointment from "../../models/templateAppointments";
import TemplateMedication from "../../models/templateMedications";
import Condition from "../../models/conditions";
import Severity from "../../models/severity";
import Treatment from "../../models/treatments";

class CarePlanTemplateService {

    getCarePlanTemplateById = async (id) => {
        try {
            const carePlanTemplate = await CarePlanTemplate.findOne({
                where: id,
                include: [Condition, Severity, Treatment, TemplateAppointment, TemplateMedication]
            });
            return carePlanTemplate;
        } catch (error) {
            throw error;
        }
      };

  create = async data => {
    try {
      const carePlanTemplate = await CarePlanTemplate.create(
        data,
        {
            include: [TemplateAppointment, TemplateMedication]
        }
      );
      return carePlanTemplate;
    } catch (error) {
      throw error;
    }
  };

    getCarePlanTemplateByData = async (treatment_id, severity_id, condition_id) => {
        try {
            const carePlanTemplate = await CarePlanTemplate.findOne({
                where: {
                    treatment_id,
                    severity_id,
                    condition_id,
                },
                include: [Condition, Severity, Treatment, TemplateAppointment, TemplateMedication]
            });
            return carePlanTemplate;
        } catch (error) {
            throw error;
        }
    };

    getCarePlanTemplateData = async (data) => {
        try {
            const carePlanTemplate = await CarePlanTemplate.findAll({
                where: data,
                include: [Condition, Severity, Treatment, TemplateAppointment, TemplateMedication]
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
