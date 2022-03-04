export default class CareplanSecondaryDoctorMappings {
  constructor(data) {
    this._data = data;
  }

  getCareplanId() {
    return this._data.get("care_plan_id");
  }

  secondaryDoctorRoleId() {
    return this._data.get("secondary_doctor_role_id");
  }
}
