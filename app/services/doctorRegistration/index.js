export default class DoctorRegistration {
    constructor(data) {
        this._data = data;
    }

    getDoctorRegistrationId = () => {
        return this._data.get("id");
    };
}