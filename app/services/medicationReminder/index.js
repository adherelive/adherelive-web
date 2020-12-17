export default class MedicationReminder {
    constructor(data) {
        this._data = data;
    }

    getExistingData = () => {
        return this._data.get("");
    }

    getParticipants = () => {
        const {participant_id, organizer_id} = this._data;
        return {participant_id, organizer_id};
    }

    getMReminderId = () => {
        return this._data.get("id");
    }

    getMedicineId = () => {
        const details = this._data.get("details");
        const {medicine_id} = details || {};
        if(medicine_id) {
            return medicine_id;
        }
    };
    getStartDate = () => {
        return this._data.get("start_date");
    };
}