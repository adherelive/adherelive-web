export default class TemplateVital {
  constructor(data) {
    this._data = data;
  }
  
  getId = () => this._data.id;
  
  getCarePlanTemplateId = () => this._data.care_plan_template_id;
  
  getVitalTemplateId = () => this._data.vital_template_id;
  
  getDetails = () => this._data.details;
}