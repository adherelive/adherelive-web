export default class DoctorQualification {
  constructor(data) {
    this._data = data;
  }
  
  getDoctorQualificationId = () => {
    return this._data.get("id");
  };
  
  getDegreeId = () => {
    return this._data.get("degree_id");
  };
  
  getCollegeId = () => {
    return this._data.get("college_id");
  };
}
