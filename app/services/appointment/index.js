export default class Appointment {
    constructor(id, data) {
        this._data = data;
        this._appointmentId = id;
    }

    getExistingData = () => {
        return this._data;
    }

    getAppointmentId = () => {
        return this._appointmentId;
    }
}