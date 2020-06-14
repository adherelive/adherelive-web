
export default class Patient {
    constructor(data) {
        this._data = data;
    }

    getPatientId = () => {
        return this._data.get("id");
    }
}