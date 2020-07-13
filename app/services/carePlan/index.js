
export default class CarePlan {
    constructor(data) {
        this._data = data;
    }

    getPatientId = () => {
        return this._data.get("patient_id");
    };

    getDoctorId = () => {
        return this._data.get("doctor_id");
    };

    getCarePlanId = () => {
        return this._data.get("id");
    };

    getCarePlanTemplateId = () => {
        return this._data.get("care_plan_template_id");
    };

    getCarePlanDetails = () => {
        return this._data.get('details');
    };
}