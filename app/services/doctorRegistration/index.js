export default class DoctorRegistration {
    constructor(data) {
        this._data = data;
    }

    getDoctorRegistrationId = () => {
        return this._data.get("id");
    };

    getCouncilId = () => {
        return this._data.get("registration_council_id");
    };
}