import ScheduleEvent from "../../models/scheduleEvents";
import {Op} from "sequelize";
import {EVENT_STATUS} from "../../../constant";
import {database} from "../../../libs/mysql";

class ScheduleEventService {
    create = async (data) => {
      try {
          const scheduleEvents = await ScheduleEvent.create(data);
          return scheduleEvents;
      } catch(error) {
          throw error;
      }
    };

    update = async (data, id) => {
        const transaction = await database.transaction();
        try {
            const scheduleEvents = await ScheduleEvent.update(data, {
                where: {
                    id
                },
                transaction
            });
            await transaction.commit();
            return scheduleEvents;
        } catch(error) {
            await transaction.rollback();
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

    getAllPreviousByData = async (data = {}) => {
        try {
            const {event_id, date} = data;
            const scheduleEvent = await ScheduleEvent.findAll({
                where: {
                    event_id,
                    date: {
                        [Op.lte]: date
                    },
                },
                order: [
                    ['date','ASC']
                ]
            });
            return scheduleEvent;
        } catch(error) {
            throw error;
        }
    };

    getAllPassedByData = async (data = {}) => {
        try {
            const {event_id, date, sort = 'ASC'} = data;
            const scheduleEvent = await ScheduleEvent.findAll({
                where: {
                    event_id,
                    date: {
                        [Op.lte]: date
                    },
                    status: {
                        [Op.not]: EVENT_STATUS.PENDING
                    }
                },
                order: [
                    ['date',sort]
                ]
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
                    status: EVENT_STATUS.PENDING
                }
            });
            return scheduleEvent;
        } catch(error) {
            throw error;
        }
    };

    getStartEventByData = async (time) => {
        try {
            const scheduleEvent = await ScheduleEvent.findAll({
                where: {
                    start_time: time,
                    status: EVENT_STATUS.PENDING
                }
            });
            return scheduleEvent;
        } catch(error) {
            throw error;
        }
    };
}

export default new ScheduleEventService();