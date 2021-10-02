export default class DoctorProviderMapping {
    constructor(data) {
        this._data = data;
    }

    getDoctorId = () => {
        return this._data.get("doctor_id");
    };

    getProviderId = () => {
        return this._data.get("provider_id");
    };
}
