export default class CarePlanTemplate {
    constructor(data) {
        this._data = data;
    }

    getCarePlanTemplateId = () => {
        return `${this._data.get("id")}`;
    };

    getCarePlanTreatmentId = () => {
        return this._data.get("treatment_id");
    };

    getCarePlanSeverityId = () => {
        return this._data.get("severity_id");
    };

    getCarePlanConditionId = () => {
        return this._data.get("condition_id");
    };

    getTemplateAppointments = () => {
        const {template_appointments} = this._data;
        return template_appointments;
    };

    getTemplateMedications = () => {
        const {template_medications} = this._data;
        return template_medications;
    };

    getTemplateVitals = () => {
        const {template_vitals = []} = this._data;
        return template_vitals;
    }
}