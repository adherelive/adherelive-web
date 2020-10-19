export default class Consent {
    constructor(data) {
        this._data = data;
    }

    getConsentId = () => {
        return this._data.id;
    };

    getType = () => {
        return this._data.type;
    };

    getDoctorId = () => {
        return this._data.doctor_id;
    };

    getPatientId = () => {
        return this._data.patient_id;
    };
}