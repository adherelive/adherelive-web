import { Op } from "sequelize";
import { TABLE_NAME } from "../../models/scheduleEvents";
// import { TABLE_NAME as eventHistoryTableName } from "../../models/eventHistory";

import { EVENT_STATUS, EVENT_TYPE } from "../../../constant";
import Database from "../../../libs/mysql";
import moment from "moment";
import { getTime } from "../../helper/timer";

import { createLogger } from "../../../libs/log";
const log = createLogger("WEB > SCHEDULE EVENT > SERVICES");

/**
 *
 *
 * @class ScheduleEventService
 */
class ScheduleEventService {
  create = async (data) => {
    try {
      // log.debug("logsForMonitorByAdhere -  Schedule EventService Create Called: ",getTime())
      const scheduleEvents = await Database.getModel(TABLE_NAME).create(data);
      return scheduleEvents;
    } catch (error) {
      throw error;
    }
  };

  /**
   *
   *
   * @param data
   * @returns {Promise<*>}
   */
  bulkCreate = async (data) => {
    try {
      // log.debug("logsForMonitorByAdhere -  Schedule EventService bulkCreate Called: ",getTime())
      const scheduleEvents = await Database.getModel(TABLE_NAME).bulkCreate(
        data
      );
      return scheduleEvents;
    } catch (error) {
      throw error;
    }
  };

  /**
   *
   *
   * @param data
   * @param id
   * @returns {Promise<*>}
   */
  update = async (data, id) => {
    // log.debug("logsForMonitorByAdhere -  Schedule EventService update Called: ",getTime())
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

  /**
   *
   *
   * @param paranoid
   * @param data
   * @returns {Promise<*>}
   */
  getEventByData = async ({ paranoid = true, ...data }) => {
    // log.debug("logsForMonitorByAdhere -  Schedule EventService getEventByData Called: ",getTime())
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

  /**
   *
   *
   * @param data
   * @returns {Promise<Model[]>}
   */
  getAllEventByData = async (data) => {
    // log.debug("logsForMonitorByAdhere -  Schedule EventService getAllEventByData Called: ",getTime())
    try {
      const scheduleEvent = await Database.getModel(TABLE_NAME).findAll({
        where: data,
      });
      return scheduleEvent;
    } catch (error) {
      throw error;
    }
  };

  /**
   *
   *
   * @param data
   * @returns {Promise<Model[]>}
   */
  getAllPreviousByData = async (data = {}) => {
    log.debug("logsForMonitorByAdhere - Schedule EventService getAllPreviousByData Called: ",getTime())
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

  /**
   *
   *
   * @param data
   * @returns {Promise<Model[]>}
   */
  getAllPreviousByDataM = async (data = {}) => {
    // log.debug("logsForMonitorByAdhere -  Schedule EventService getAllPreviousByDataM Called: ",getTime())
    try {
      // log.debug("getAllPreviousByDataNew called - 1");
      const { event_id = [], date, event_type = "" } = data;
      log.debug("Get All Previous by Data (M) -> event_id: ", { event_id });
      log.debug("Get All Previous by Data (M) -> typeof(event_id): ", typeof event_id);

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

  /**
   *
   *
   * @param data
   * @returns {Promise<Model[]>}
   */
  getLastVisitData = async (data = {}) => {
    // log.debug("logsForMonitorByAdhere -  Schedule EventService getLastVisitData Called: ",getTime())
    try {
      const { event_id, event_type, date, sort = "ASC" } = data;
      const scheduleEvent = await Database.getModel(TABLE_NAME).findAll({
        limit: 4,
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

  /**
   *
   *
   * @param data
   * @returns {Promise<Model[]>}
   */
  getAllPassedByData = async (data = {}) => {
    // log.debug("logsForMonitorByAdhere -  Schedule EventService getAllPassedByData Called: ",getTime())
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

  /**
   *
   *
   * @param data
   * @returns {Promise<Model[]>}
   */
  getAllPassedAndCompletedEventsData = async (data = {}) => {
    // log.debug("logsForMonitorByAdhere -  Schedule EventService getAllPassedAndCompletedEventsData Called: ",getTime())
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

  /**
   *
   *
   * @param time
   * @param event_type
   * @returns {Promise<Model[]>}
   */
  getPriorEventByData = async (time, event_type = null) => {
    // log.debug("logsForMonitorByAdhere -  Schedule EventService getPriorEventByData Called: ",getTime())
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

  /**
   *
   *
   * @param time
   * @returns {Promise<Model[]>}
   */
  getStartEventByData = async (time) => {
    // log.debug("logsForMonitorByAdhere -  Schedule EventService getStartEventByData Called: ",getTime())
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

  /**
   *
   *
   * @param time
   * @returns {Promise<Model[]>}
   */
  getPassedEventData = async (time) => {
    // log.debug("logsForMonitorByAdhere -  Schedule EventService getPassedEventData Called: ",getTime())
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

  /**
   *
   *
   * @param data
   * @returns {Promise<*>}
   */
  deleteBatch = async (data) => {
    // log.debug("logsForMonitorByAdhere -  Schedule EventService deleteBatch Called: ",getTime())
    try {
      const scheduleEvent = await Database.getModel(TABLE_NAME).destroy({
        where: data,
      });
      return scheduleEvent;
    } catch (error) {
      throw error;
    }
  };

  /**
   *
   *
   * @param data
   * @returns {Promise<Model[]>}
   */
  getAllPastData = async (data) => {
    // log.debug("logsForMonitorByAdhere -  Schedule EventService getAllPastData Called: ",getTime())
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

  /**
   *
   *
   * @param data
   * @returns {Promise<Model[]>}
   */
  getUpcomingByData = async (data) => {
    // log.debug("logsForMonitorByAdhere -  Schedule EventService getUpcomingByData Called: ",getTime())
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

  /**
   *
   *
   * @param data
   * @returns {Promise<Model[]>}
   */
  getMissedByDataEventType = async (data) => {
    // log.debug("logsForMonitorByAdhere -  Schedule EventService getMissedByDataEventType Called: ",getTime())
    try {
      // log.debug("getMissedByData Start - ", getTime());
      const {
        vital_ids,
        event_type,
        appointment_ids,
        medication_ids,
        diet_ids,
        workout_ids,
      } = data;
      let ids = [];
      if (event_type === EVENT_TYPE.APPOINTMENT) ids = [...appointment_ids];
      if (event_type === EVENT_TYPE.MEDICATION_REMINDER)
        ids = [...medication_ids];
      if (event_type === EVENT_TYPE.DIET) ids = [...diet_ids];
      if (event_type === EVENT_TYPE.VITALS) ids = [...vital_ids];
      if (event_type === EVENT_TYPE.WORKOUT) ids = [...workout_ids];

      return await Database.getModel(TABLE_NAME).findAll({
        where: {
          status: EVENT_STATUS.EXPIRED,
          event_id: ids,
          event_type: [event_type],

          date: {
            [Op.between]: [
              moment().utc().subtract(7, "days").toDate(),
              moment().utc().toDate(),
            ],
          },
        },
        order: [["start_time", "DESC"]],
      });
    } catch (error) {
      throw error;
    }
  };

  /**
   * Optimization and Enhancements:
   * Indexing: Ensure you have indexes on both event_id and event_type columns in your database table.
   *      This is the most crucial step for optimizing these queries.
   *      A composite index on (event_id, event_type) would be even better.
   * Parameter Validation: Add checks at the beginning of the function to ensure that the input data object
   *      contains the necessary arrays (vital_ids, appointment_ids, etc.) and that they are not null or undefined.
   *      This will prevent unexpected errors.
   * Empty Array Handling: If any of the input arrays are empty, you can skip adding the corresponding
   *      conditions to the WHERE clause. This can further optimize the query by avoiding unnecessary comparisons.
   * Date Filtering: The date filtering using moment and Op.between is already efficient.
   *      However, ensure that the date column in your database table is indexed.
   * Logging/Debugging: Add logging statements to track the execution time of the query and the number of results
   *      returned. This can help you identify any performance bottlenecks.
   *
   * getMissedByData Optimization:
   * Combine event_id and event_type in a single array (if possible): If your database schema and application logic
   *       allow it, consider storing the event information in a way that you can query it more directly
   *       (for example, a single field that combines the ID and type). This could simplify the query and
   *       potentially improve performance.
   * Consider a View (if applicable): If this query is used frequently, you could create a database view that
   *      pre-filters the data based on the status and date conditions.
   *      This can speed up retrieval by offloading some of the filtering to the database.
   *
   * @param data
   * @returns {Promise<Model[]>}
   */
  getMissedByData = async (data) => {
    try {
      const {
        vital_ids = [], // Provide default empty arrays
        appointment_ids = [],
        medication_ids = [],
        diet_ids = [],
        workout_ids = [],
      } = data || {}; // Handle cases where data is null or undefined

      const eventIds = [
        ...vital_ids,
        ...appointment_ids,
        ...medication_ids,
        ...diet_ids,
        ...workout_ids,
      ];

      const eventTypes = [
        EVENT_TYPE.APPOINTMENT,
        EVENT_TYPE.WORKOUT,
        EVENT_TYPE.MEDICATION_REMINDER,
        EVENT_TYPE.DIET,
        EVENT_TYPE.VITALS,
      ];

      const whereClause = {
        status: EVENT_STATUS.EXPIRED,
        date: {
          [Op.between]: [
            moment().utc().subtract(7, "days").toDate(),
            moment().utc().toDate(),
          ],
        },
      };

      if (eventIds.length > 0) {
        whereClause.event_id = eventIds;
      }

      if (eventTypes.length > 0) {
        whereClause.event_type = eventTypes;
      }


      const startTime = Date.now();
      const result = await Database.getModel(TABLE_NAME).findAll({
        where: whereClause,
        order: [["start_time", "DESC"]],
      });
      const endTime = Date.now();

      log.debug(`Query executed in ${endTime - startTime}ms and returned ${result.length} rows.`);

      return result;
    } catch (error) {
      log.error("Error in getMissedByData: ", error);
      throw error;
    }
  };

  /**
   * Redundant function, as it uses [Op.or] to combine multiple WHERE clauses based on event_id and event_type.
   * This approach can be less efficient if you have many event types, as it might lead to a full table scan
   * or inefficient index usage.
   * getMissedByData: Uses separate arrays for event_id and event_type within the WHERE clause. 
   * This allows the database to potentially use indexes on both event_id and event_type more effectively.
  getMissedByData = async (data) => {
    // log.debug("logsForMonitorByAdhere -  Schedule EventService getMissedByData Called: ",getTime())
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
   */

  /**
   * Not used?
   *
   * @param data
   * @returns {Promise<Model[]>}
   */
  getPageEventByData = async (data) => {
    // log.debug("logsForMonitorByAdhere -  Schedule EventService getPageEventByData Called: ",getTime())
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

  /**
   *
   *
   * @param appointments
   * @param medications
   * @param vitals
   * @param diets
   * @param workouts
   * @returns {Promise<Model[]>}
   */
  getPendingEventsData = async ({
    appointments,
    medications,
    vitals,
    diets,
    workouts,
  }) => {
    // log.debug("logsForMonitorByAdhere -  Schedule EventService getPendingEventsData Called: ",getTime())
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

  /**
   *
   *
   * @param appointment
   * @param medication
   * @param vital
   * @param diet
   * @param workout
   * @returns {Promise<Model[]>}
   */
  getAllEventStatusByData = async ({
    appointment,
    medication,
    vital,
    diet,
    workout,
  }) => {
    // log.debug("logsForMonitorByAdhere -  Schedule EventService getAllEventStatusByData Called: ",getTime())
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

  /**
   *
   *
   * @param data
   * @returns {Promise<*>}
   */
  getCount = async (data) => {
    // log.debug("logsForMonitorByAdhere -  Schedule EventService getCount Called: ",getTime())
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
