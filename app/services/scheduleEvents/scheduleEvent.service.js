import ScheduleEvent from "../../models/scheduleEvents";


class ScheduleEventService {
    create = async (data) => {
      try {
          const scheduleEvents = await ScheduleEvent.create(data);
          return scheduleEvents;
      } catch(error) {
          throw error;
      }
    };
}

export default new ScheduleEventService();