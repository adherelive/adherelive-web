
export default class Patient {
    constructor(data) {
        this._data = data;
    }

    getUserId = () => {
        return this._data.get("user_id");
    }

    getPatientId = () => {
        return this._data.get("id");
    }
}