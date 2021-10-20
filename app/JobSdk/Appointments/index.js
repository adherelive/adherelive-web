export default class AppointmentJob {
  constructor(data) {
    this._data = data;
  }

  getAppointmentData = () => {
    return this._data;
  };

  getUsers = () => {
    const { participants = [] } = this._data || {};
    return participants;
  };

  isCritical = () => {
    const { critical = false } = this._data || {};
    return critical;
  };
}
