
export default class Doctor {
    constructor(data) {
        this._data = data;
    }

    getDoctorId = () => {
        return this._data.get("id");
    }
}