import { Op } from "sequelize";
import { TABLE_NAME } from "../../models/scheduleEvents";
// import {TABLE_NAME as eventHistoryTableName} from "../../models/eventHistory";
import { EVENT_STATUS, EVENT_TYPE } from "../../../constant";
import Database from "../../../libs/mysql";
import moment from "moment";

class ScheduleEventService {
  create = async (data) => {
    try {
      const scheduleEvents = await Database.getModel(TABLE_NAME).create(data);
      return scheduleEvents;
    } catch (error) {
      throw error;
    }
  };

  bulkCreate = async (data) => {
    try {
      const scheduleEvents = await Database.getModel(TABLE_NAME).bulkCreate(
        data
      );
      return scheduleEvents;
    } catch (error) {
      throw error;
    }
  };

  update = async (data, id) => {
    const transaction = await Database.initTransaction();
    try {
      const scheduleEvents = await Database.getModel(TABLE_NAME).update(data, {
        where: {
          id,
        },
        transaction,
        // returning: true,
        raw: true,
        individualHooks: true,
      });
      await transaction.commit();
      return scheduleEvents;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  getEventByData = async ({ paranoid = true, ...data }) => {
    try {
      const scheduleEvent = await Database.getModel(TABLE_NAME).findOne({
        where: data,
        paranoid,
      });
      return scheduleEvent;
    } catch (error) {
      throw error;
    }
  };

  getAllEventByData = async (data) => {
    try {
      const scheduleEvent = await Database.getModel(TABLE_NAME).findAll({
        where: data,
      });
      return scheduleEvent;
    } catch (error) {
      throw error;
    }
  };

  getAllPreviousByData = async (data = {}) => {
    try {
      const { event_id, date, event_type = "" } = data;
      const scheduleEvent = await Database.getModel(TABLE_NAME).findAll({
        where: {
          event_id,
          date: {
            [Op.lte]: date,
          },
          event_type,
        },
        order: [["date", "ASC"]],
      });
      return scheduleEvent;
    } catch (error) {
      throw error;
    }
  };

  getAllPreviousByDataNew = async (data = {}) => {
    try {
      console.log("getAllPreviousByDataNew called - 1");
      const { event_id = [], date, event_type = "" } = data;
      console.log({ event_id });
      console.log(typeof event_id);

      const scheduleEvent = await Database.getModel(TABLE_NAME).findAll({
        where: {
          event_id: {
            [Op.in]: event_id,
          },
          date: {
            [Op.lte]: date,
          },
          event_type,
        },
        order: [["date", "ASC"]],
      });
      return scheduleEvent;
    } catch (error) {
      throw error;
    }
  };

  getLastVisitData = async (data = {}) => {
    try {
      const { event_id, event_type, date, sort = "ASC" } = data;
      const scheduleEvent = await Database.getModel(TABLE_NAME).findAll({
        limit: 3,
        where: {
          event_id,
          event_type,
          start_time: {
            [Op.between]: [
              moment(date).startOf("day"),
              moment().utc().toISOString(),
            ],
          },
          status: {
            [Op.not]: [EVENT_STATUS.PENDING, EVENT_STATUS.SCHEDULED],
          },
        },
        order: [["start_time", sort]],
      });
      return scheduleEvent;
    } catch (error) {
      throw error;
    }
  };

  getAllPassedByData = async (data = {}) => {
    try {
      const {
        event_id,
        event_type = "",
        date,
        sort = "ASC",
        paranoid = true,
      } = data;
      const scheduleEvent = await Database.getModel(TABLE_NAME).findAll({
        where: {
          event_id,
          event_type,
          start_time: {
            [Op.between]: [
              moment(date).startOf("day"),
              moment().utc().toISOString(),
            ],
          },
          status: {
            [Op.not]: [
              EVENT_STATUS.PENDING,
              EVENT_STATUS.PRIOR,
              EVENT_STATUS.SCHEDULED,
            ],
          },
        },
        paranoid,
        order: [["start_time", sort]],
      });
      return scheduleEvent;
    } catch (error) {
      throw error;
    }
  };

  getAllPassedAndCompletedEventsData = async (data = {}) => {
    try {
      const { event_id, event_type = "", date, sort = "ASC" } = data;
      const scheduleEvent = await Database.getModel(TABLE_NAME).findAll({
        where: {
          event_id,
          event_type,
          [Op.or]: [
            {
              start_time: {
                [Op.between]: [
                  moment(date).startOf("day"),
                  moment().utc().toISOString(),
                ],
              },
            },
            {
              status: EVENT_STATUS.COMPLETED,
            },
          ],
          status: {
            [Op.or]: [
              EVENT_STATUS.COMPLETED,
              EVENT_STATUS.EXPIRED,
              EVENT_STATUS.CANCELLED,
              EVENT_STATUS.STARTED,
            ],
          },
        },
        order: [["start_time", sort]],
      });
      return scheduleEvent;
    } catch (error) {
      throw error;
    }
  };

  getPriorEventByData = async (time, event_type = null) => {
    try {
      const scheduleEvent = await Database.getModel(TABLE_NAME).findAll({
        where: {
          start_time: {
            [Op.between]: [moment().utc().toDate(), time],
          },
          event_type,
          status: EVENT_STATUS.PENDING,
        },
      });
      return scheduleEvent;
    } catch (error) {
      throw error;
    }
  };

  getStartEventByData = async (time) => {
    try {
      const scheduleEvent = await Database.getModel(TABLE_NAME).findAll({
        where: {
          start_time: {
            [Op.between]: [moment(time).startOf("day"), time],
          },
          status: [EVENT_STATUS.PENDING, EVENT_STATUS.PRIOR],
        },
      });
      return scheduleEvent;
    } catch (error) {
      throw error;
    }
  };

  getPassedEventData = async (time) => {
    try {
      const scheduleEvent = await Database.getModel(TABLE_NAME).findAll({
        where: {
          start_time: {
            [Op.between]: [moment(time).subtract(1, "year"), time],
          },
          status: [
            EVENT_STATUS.SCHEDULED,
            EVENT_STATUS.PENDING,
            EVENT_STATUS.PRIOR,
          ],
        },
      });
      return scheduleEvent;
    } catch (error) {
      throw error;
    }
  };

  deleteBatch = async (data) => {
    try {
      const scheduleEvent = await Database.getModel(TABLE_NAME).destroy({
        where: data,
      });
      return scheduleEvent;
    } catch (error) {
      throw error;
    }
  };

  getAllPastData = async (data) => {
    try {
      const { event_id, startDate, date } = data;
      const scheduleEvent = await Database.getModel(TABLE_NAME).findAll({
        where: {
          event_id,
          start_time: {
            [Op.between]: [moment(startDate).startOf("day"), date],
          },
        },
      });
      return scheduleEvent;
    } catch (error) {
      throw error;
    }
  };

  getUpcomingByData = async (data) => {
    try {
      const {
        vital_ids = [],
        appointment_ids = [],
        medication_ids = [],
        diet_ids = [],
        workout_ids = [],
        startLimit,
        endLimit,
      } = data;
      const scheduleEvent = await Database.getModel(TABLE_NAME).findAll({
        offset: startLimit,
        limit: endLimit,
        where: {
          start_time: {
            [Op.gt]: moment().utc().toISOString(),
          },
          [Op.or]: [
            {
              event_id: appointment_ids,
              event_type: EVENT_TYPE.APPOINTMENT,
            },
            {
              event_id: medication_ids,
              event_type: EVENT_TYPE.MEDICATION_REMINDER,
            },
            {
              event_id: vital_ids,
              event_type: EVENT_TYPE.VITALS,
            },
            {
              event_id: diet_ids,
              event_type: EVENT_TYPE.DIET,
            },
            {
              event_id: workout_ids,
              event_type: EVENT_TYPE.WORKOUT,
            },
          ],
        },
        order: [["start_time", "ASC"]],
      });
      return scheduleEvent;
    } catch (error) {
      throw error;
    }
  };

  getMissedByData = async (data) => {
    try {
      const {
        vital_ids,
        appointment_ids,
        medication_ids,
        diet_ids,
        workout_ids,
      } = data;
      return await Database.getModel(TABLE_NAME).findAll({
        where: {
          date: {
            [Op.between]: [
              moment().utc().subtract(7, "days").toDate(),
              moment().utc().toDate(),
            ],
          },
          [Op.or]: [
            {
              event_id: appointment_ids,
              event_type: EVENT_TYPE.APPOINTMENT,
            },
            {
              event_id: medication_ids,
              event_type: EVENT_TYPE.MEDICATION_REMINDER,
            },
            {
              event_id: vital_ids,
              event_type: EVENT_TYPE.VITALS,
            },
            {
              event_id: diet_ids,
              event_type: EVENT_TYPE.DIET,
            },
            {
              event_id: workout_ids,
              event_type: EVENT_TYPE.WORKOUT,
            },
          ],
          status: EVENT_STATUS.EXPIRED,
        },
        order: [["start_time", "DESC"]],
      });
    } catch (error) {
      throw error;
    }
  };

  getPageEventByData = async (data) => {
    try {
      const { eventIds, startLimit, endLimit, event_type } = data;
      const scheduleEvent = await Database.getModel(TABLE_NAME).findAll({
        offset: startLimit,
        limit: endLimit,
        where: {
          event_id: eventIds,
          event_type,
        },
        order: [["start_time", "ASC"]],
      });
      return scheduleEvent;
    } catch (error) {
      throw error;
    }
  };

  getPendingEventsData = async ({
    appointments,
    medications,
    vitals,
    diets,
    workouts,
  }) => {
    try {
      const scheduleEvent = await Database.getModel(TABLE_NAME).findAll({
        where: {
          start_time: {
            [Op.gt]: [moment().utc().toISOString()],
          },
          status: [
            EVENT_STATUS.PENDING,
            EVENT_STATUS.PRIOR,
            EVENT_STATUS.SCHEDULED,
          ],
          [Op.or]: [
            {
              ...appointments,
            },
            {
              ...medications,
            },
            {
              ...vitals,
            },
            {
              ...diets,
            },
            { ...workouts },
          ],
        },
        order: [["start_time", "ASC"]],
      });
      return scheduleEvent;
    } catch (error) {
      throw error;
    }
  };

  getAllEventStatusByData = async ({
    appointment,
    medication,
    vital,
    diet,
    workout,
  }) => {
    try {
      return await Database.getModel(TABLE_NAME).findAll({
        where: {
          [Op.or]: [
            {
              ...appointment,
            },
            {
              ...medication,
            },
            {
              ...vital,
            },
            diet,
            workout,
          ],
        },
        attributes: ["status"],
        raw: true,
      });
    } catch (error) {
      throw error;
    }
  };
  getCount = async (data) => {
    try {
      return await Database.getModel(TABLE_NAME).count({
        where: data,
      });
    } catch (error) {
      throw error;
    }
  };
}

export default ScheduleEventService;
