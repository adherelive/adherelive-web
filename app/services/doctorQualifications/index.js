export default class DoctorQualification {
    constructor(data) {
        this._data = data;
    }

    getDoctorQualificationId = () => {
        return this._data.get("id");
    };
}