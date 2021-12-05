export default class TemplateMedication {
  constructor(data) {
    this._data = data;
  }
  
  getTemplateMedicationId() {
    return this._data.get("id");
  }
  
  getTemplateMedicineId() {
    return this._data.get("medicine_id");
  }
  
  getMedicines = () => {
    const {medicines} = this._data;
    return medicines;
  };
}
