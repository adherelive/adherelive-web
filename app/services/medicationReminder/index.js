export default class MedicationReminder {
    constructor(data) {
        this._data = data;
    }

    getExistingData = () => {
        return this._data;
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
        console.log("{{{{{{{{{{{{{{{{ details --> ", details);
        const {medicine_id} = details || {};
        if(medicine_id) {
            return medicine_id;
        }
    };
}