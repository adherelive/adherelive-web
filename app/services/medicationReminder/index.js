export default class MedicationReminder {
    constructor(data) {
        this._data = data;
    }

    getExistingData = () => {
        return this._data;
    }

    getMReminderId = () => {
        return this._data.get("id");
    }
}