export default class Appointment {
    constructor(data) {
        this._data = data;
    }

    getAppointmentId() {
        return this._data.get("id");
    }

    getStartDate = () => {
      return this._data.get("start_date");
    };

    getStartTime = () => {
        return this._data.get("start_time");
    };

    getEndTime = () => {
        return this._data.get("end_time");
    };
}