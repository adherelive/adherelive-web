
export default class Doctor {
    constructor(data) {
        this._data = data;
    }

    getUserId = () => {
        return this._data.get("user_id");
    };

    getDoctorId = () => {
        return this._data.get("id");
    }
}