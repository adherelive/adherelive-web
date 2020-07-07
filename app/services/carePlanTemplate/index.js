export default class CarePlanTemplate {
    constructor(data) {
        this._data = data;
    }

    getCarePlanTemplateId = () => {
        return this._data.get("id");
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
}