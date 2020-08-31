export default class Symptom {
    constructor(data) {
        this._data = data;
    }

    getPatientId = () => {
        return this._data.get("patient_id");
    };

    getConfig = () => {
        return this._data.get("config");
    };

    getText = () => {
        return this,_data.get("text");
    };

    getSymptomId = () => {
        return this._data.get("id");
    }
}