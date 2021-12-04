export default class DoctorPatientFeatureMapping {
  constructor(data) {
    this._data = data;
  }
  
  getDoctorId = () => {
    return this._data.get("doctor_id");
  };
  
  getPatientId = () => {
    return this._data.get("patient_id");
  };
  
  getFeatureId = () => {
    return this._data.get("feature_id");
  };
}
