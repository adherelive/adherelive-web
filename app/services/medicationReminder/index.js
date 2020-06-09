export default class MedicationReminder {
    constructor(data) {
        this._data = data.get();
        this._medicationReminderId = data.get("id");
        console.log("this._medicationReminderId  constructor  --> ", this._medicationReminderId);
    }

    getExistingData = () => {
        return this._data;
    }

    getMReminderId = () => {
        return this._medicationReminderId;
    }
}