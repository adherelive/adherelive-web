export default class CarePlan {
  constructor(data) {
    this._data = data;
  }

  getPatientId = () => {
    return this._data.get("patient_id");
  };

  getDoctorId = () => {
    return this._data.get("doctor_id");
  };

  getCarePlanId = () => {
    return this._data.get("id");
  };

  getCarePlanTemplateId = () => {
    return this._data.get("care_plan_template_id");
  };

  getCarePlanDetails = () => {
    return this._data.get("details");
  };

  getCreatedAt = () => {
    return this._data.get("created_at");
  };

  getActivatedOn = () => {
    return this._data.get("activated_on");
  };

  getExpiredOn = () => {
    return this._data.get("expired_on");
  };

  getUserRoleId = () => {
    return this._data.get("user_role_id");
  };

  getCareplnSecondaryProfiles = () => {
    const { careplan_secondary_doctor_mappings = [] } = this._data || {};

    return careplan_secondary_doctor_mappings.map(
      (data) => data.secondary_doctor_role_id
    );
  };

  getChannelId = () => {
    return this._data.get("channel_id");
  };
}
