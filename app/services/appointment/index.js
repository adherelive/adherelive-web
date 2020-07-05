export default class Appointment {
    constructor(data) {
        this._data = data;
    }

    getAppointmentId() {
        return this._data.get("id");
    }
}