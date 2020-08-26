import ScheduleEvent from "../../models/scheduleEvents";
import {Op} from "sequelize";
import {EVENT_STATUS} from "../../../constant";

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

    getPriorEventByData = async (time) => {
        try {
            const scheduleEvent = await ScheduleEvent.findAll({
                where: {
                    start_time: {
                        [Op.lte]: time
                    },
                    status: EVENT_STATUS.SCHEDULED
                }
            });
            return scheduleEvent;
        } catch(error) {
            throw error;
        }
    };
}

export default new ScheduleEventService();