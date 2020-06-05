import MedicationReminder from "../../models/medicationReminders";

class MReminderService {
    async addMReminder(data) {
        try {
            const response = await MedicationReminder.create(data);
            return response;
        } catch (err) {
            throw err;
        }
    }
}

export default new MReminderService();