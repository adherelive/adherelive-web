
export default class CarePlanAppointment {
    constructor(data) {
        this._data = data;
    }

    getCarePlanAppointmentId = () => {
        return this._data.get("id");
    };

    getCarePlanId = () => {
        return this._data.get("care_plan_id");
    };

    getAppointmentId = () => {
        return this._data.get("appointment_id");
    };
}