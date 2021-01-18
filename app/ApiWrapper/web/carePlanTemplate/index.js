// services
import BaseCarePlanTemplate from "../../../services/carePlanTemplate";
import carePlanTemplateService from "../../../services/carePlanTemplate/carePlanTemplate.service";
import medicineService from "../../../services/medicine/medicine.service";
import vitalTemplateService from "../../../services/vitalTemplates/vitalTemplate.service";

// wrapper
import TemplateAppointmentWrapper from "../../../ApiWrapper/web/templateAppointment";
import TemplateMedicationWrapper from "../../../ApiWrapper/web/templateMedication";
import TemplateVitalWrapper from "../../../ApiWrapper/web/templateVital";
import MedicineWrapper from "../../../ApiWrapper/mobile/medicine";
import VitalTemplateWrapper from "../../../ApiWrapper/web/vitalTemplates";

class CarePlanTemplateWrapper extends BaseCarePlanTemplate {
    constructor(data) {
        super(data);
    }

    getBasicInfo = () => {
        const { _data } = this;
        const {
            id,
            name,
            treatment_id,
            severity_id,
            condition_id,
            user_id,
            details = {}
        } = _data || {};

        return {
            basic_info: {
                id,
                name,
                treatment_id,
                severity_id,
                condition_id,
                user_id
            },
            details
        };
    };

    getBasic = () => {
        const { _data, getCarePlanTemplateId } = this;
        const {
            id,
            name,
            treatment_id,
            severity_id,
            condition_id,
            user_id,
            details = {}
        } = _data || {};

        return {
            care_plan_templates: {
                [getCarePlanTemplateId()]: {
                    basic_info: {
                        id,
                        name,
                        treatment_id,
                        severity_id,
                        condition_id,
                        user_id
                    },
                    details
                }
            }
        };
    };

    // TODO ::
    getReferenceInfo = async () => {
        const {
            getBasic,
            getTemplateAppointments,
            getTemplateMedications,
            getTemplateVitals,
            _data
        } = this;

        let templateAppointments = [];
        let templateMedications = [];
        let medicines = [];

        let appointmentIds = [];
        let medicationIds = [];
        let medicineIds = [];

        for (const templateAppointment of getTemplateAppointments()) {
            const data = await TemplateAppointmentWrapper(templateAppointment);
            templateAppointments[
                data.getTemplateAppointmentId()
                ] = data.getBasicInfo();
            appointmentIds.push(data.getTemplateAppointmentId());
        }

        for (const templateMedication of getTemplateMedications()) {
            const data = await TemplateMedicationWrapper(templateMedication);
            templateMedications[data.getTemplateMedicationId()] = data.getBasicInfo();
            medicationIds.push(data.getTemplateMedicationId());
            medicineIds.push(data.getTemplateMedicineId());
            // const medicineData = await MedicineWrapper(data.getMedicines());
            // medicines[medicineData.getMedicineId()] = medicineData.getBasicInfo();
        }

        // vital templates (careplan_template)
        let templateVitalIds = [];
        let templateVitals = {};

        // vital templates (vitals)
        let vitalTemplateIds = [];

        const allVitals = getTemplateVitals();
        if(allVitals.length > 0){
            for(let index = 0; index < allVitals.length; index++) {
                const templateVital = await TemplateVitalWrapper({data: allVitals[index]});
                templateVitals[templateVital.getId()] = templateVital.getBasicInfo();
                templateVitalIds.push(templateVital.getId());
                vitalTemplateIds.push(templateVital.getVitalTemplateId());
            }
        }

        // get vital templates
        let vitalTemplates = {};

        const allVitalTemplates = await vitalTemplateService.getAllByData({
            id: vitalTemplateIds
        }) || [];

        if(allVitalTemplates.length > 0) {
            for(let index = 0; index < allVitalTemplates.length; index++) {
                const vitalTemplate = await VitalTemplateWrapper({data: allVitalTemplates[index]});
                vitalTemplates[vitalTemplate.getVitalTemplateId()] = vitalTemplate.getBasicInfo();
            }
        }

        const medicineData = await medicineService.getMedicineByData({
            id: medicineIds
        });

        for (const medicine of medicineData) {
            const data = await MedicineWrapper(medicine);
            medicines[data.getMedicineId()] = data.getBasicInfo();
        }

        return {
            care_plan_templates: {
                [this.getCarePlanTemplateId()]: {
                    ...this.getBasicInfo(),
                    template_appointment_ids: appointmentIds,
                    template_medication_ids: medicationIds,
                    template_vital_ids: templateVitalIds,
                }
            },
            template_appointments: {
                ...templateAppointments,
            },
            template_medications: {
                ...templateMedications,
            },
            template_vitals: {
              ...templateVitals,
            },
            medicines: {
                ...medicines,
            },
            vital_templates: {
                ...vitalTemplates,
            }
        };
    };
}

export default async (data = null, id = null) => {
    if (data) {
        return new CarePlanTemplateWrapper(data);
    }
    const carePlanTemplate = await carePlanTemplateService.getCarePlanTemplateById(
        id
    );
    return new CarePlanTemplateWrapper(carePlanTemplate);
};
