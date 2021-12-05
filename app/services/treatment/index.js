export default class Treatment {
  constructor(data) {
    this._data = data;
  }
  
  getExistingData = () => {
    return this._data;
  }
  
  getTreatmentId() {
    return this._data.get("id");
  }
}