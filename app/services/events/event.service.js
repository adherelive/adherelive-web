
import ScheduleEvent from "../../models/scheduleEvents";

class EventService {
    async addEvent(data) {
        try {
            const response = await ScheduleEvent.create(data);
            return response;
        } catch (err) {
            throw err;
        }
    }
}

export default new EventService();