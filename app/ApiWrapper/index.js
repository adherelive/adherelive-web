import userService from "../services/user/user.service";
import patientService from "../services/patients/patients.service";

export default class apiWrapper {
  constructor(userId, data) {
    this._data = data;
    this._userId = userId;
  }

  getExistingData() {
    return this._data.get();
  }

  getUserId() {
    return this._userId;
  }

  getUser = async () => {
    const user = await userService.getUser(this._userId);
    return user.get();
  };

  async getPatient() {
    const patient = await patientService.getPatientByUserId(this._userId);
    return patient.get();
  }
}
