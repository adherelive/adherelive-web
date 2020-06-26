export default class DoctorClinic {
    constructor(data) {
        this._data = data;
    }

    getDoctorClinicId = () => {
        return this._data.get("id");
    };
}