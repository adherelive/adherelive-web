export default class Vitals {
    constructor(data) {
        this._data = data;
    }

    getVitalId = () => {
      return this._data.get("id");
    };

    getVitalTemplateId = () => {
        return this._data.get("vital_template_id");
    };

    getCarePlanId = () => {
        return this._data.get("care_plan_id");
    };

    getResponseValues = () => {
      const {vitals = []} = this._data.get("response") || {};
      return vitals;
    };
}