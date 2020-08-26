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

    getEventByData = async (data) => {
        try {
            const scheduleEvent = await ScheduleEvent.findOne({
                where: data
            });
            return scheduleEvent;
        } catch(error) {
            throw error;
        }
    };

    getAllEventByData = async (data) => {
        try {
            const scheduleEvent = await ScheduleEvent.findAll({
                where: data
            });
            return scheduleEvent;
        } catch(error) {
            throw error;
        }
    };
}

export default new ScheduleEventService();