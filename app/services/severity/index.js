export default class Severity {
  constructor(data) {
    this._data = data;
  }
  
  getExistingData = () => {
    return this._data;
  }
  
  getSeverityId() {
    return this._data.get("id");
  }
}