export default class TemplateAppointment {
  constructor(data) {
    this._data = data;
  }
  
  getTemplateAppointmentId() {
    return this._data.get("id");
  }
}
