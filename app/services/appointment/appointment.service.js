import { col, fn, literal, Op } from "sequelize";
import Database from "../../../libs/mysql";
import moment from "moment";
import { USER_CATEGORY } from "../../../constant";
import { TABLE_NAME } from "../../models/appointments";

import { createLogger } from "../../../libs/log";
const logger = createLogger("WEB > APPOINTMENT > SERVICE");

/**
 *
 *
 * @class AppointmentService
 */
class AppointmentService {
  async addAppointment(data) {
    const transaction = await Database.initTransaction();
    try {
      const appointment = await Database.getModel(TABLE_NAME).create(data, {
        transaction,
      });
      await transaction.commit();
      return appointment;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  /**
   *
   *
   * @param id
   * @param data
   * @returns {Promise<*>}
   */
  updateAppointment = async (id, data) => {
    try {
      const appointment = await Database.getModel(TABLE_NAME).update(data, {
        where: {
          id,
        },
      });
      return appointment;
    } catch (err) {
      throw err;
    }
  };

  /**
   *
   *
   * @param id
   * @returns {Promise<*>}
   */
  getAppointmentById = async (id) => {
    try {
      const appointment = await Database.getModel(TABLE_NAME).findOne({
        where: {
          id,
        },
      });
      return appointment;
    } catch (err) {
      throw err;
    }
  };

  /**
   *
   *
   * @param today
   * @param participant_one_id
   * @param participant_two_id
   * @returns {Promise<Model[]>}
   */
  getDoctorAppointmentsForDate = async ({
    today,
    participant_one_id,
    participant_two_id,
  }) => {
    try {
      const appointments = await Database.getModel(TABLE_NAME).findAll({
        where: {
          start_date: {
            [Op.between]: [
              moment(today).startOf("day").toISOString(),
              moment(today).endOf("day").toISOString(),
            ],
          },
          [Op.or]: [
            {
              participant_one_id,
              participant_one_type: USER_CATEGORY.DOCTOR,
            },
            {
              participant_two_id,
              participant_two_type: USER_CATEGORY.DOCTOR,
            },
          ],
        },
      });
      return appointments;
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
  getAppointmentByData = async (data) => {
    try {
      const appointment = await Database.getModel(TABLE_NAME).findAll({
        where: data,
      });
      return appointment;
    } catch (err) {
      throw err;
    }
  };

  /**
   *
   *
   * @param patient_id
   * @returns {Promise<Model[]>}
   */
  getAppointmentForPatient = async (patient_id) => {
    try {
      const appointments = await Database.getModel(TABLE_NAME).findAll({
        where: {
          [Op.or]: [
            {
              participant_two_id: patient_id,
              participant_two_type: USER_CATEGORY.PATIENT,
            },
            {
              participant_one_id: patient_id,
              participant_one_type: USER_CATEGORY.PATIENT,
            },
          ],
        },
        order: [["start_time", "DESC"]],
      });
      return appointments;
    } catch (error) {
      throw error;
    }
  };

  /**
   *
   *
   * @param doctor_id
   * @returns {Promise<Model[]>}
   */
  getAllAppointmentForDoctor = async (doctor_id) => {
    try {
      const appointments = await Database.getModel(TABLE_NAME).findAll({
        where: {
          [Op.or]: [
            {
              participant_two_id: doctor_id,
              participant_two_type: USER_CATEGORY.DOCTOR,
            },
            {
              participant_one_id: doctor_id,
              participant_one_type: USER_CATEGORY.DOCTOR,
            },
          ],
        },
      });
      return appointments;
    } catch (error) {
      throw error;
    }
  };

  /**
   * TODO: Check why this code is commented?
  getDayAppointmentForDoctor = async (doctor_id, provider_id, date) => {
    try {
      const startOfDay = moment(date).startOf("day").toISOString();
      const endOfDay = moment(date).endOf("day").toISOString();
      const appointments = await Database.getModel(TABLE_NAME).findAll({
        where: {
          [Op.and]: [
            {
              start_date: {
                [Op.between]: [startOfDay, endOfDay],
              },
            },
            {
              [Op.or]: [
                {
                  participant_two_id: doctor_id,
                  participant_two_type: USER_CATEGORY.DOCTOR,
                  provider_id: provider_id,
                },
                {
                  participant_one_id: doctor_id,
                  participant_one_type: USER_CATEGORY.DOCTOR,
                  provider_id: provider_id,
                },
              ],
            },
          ],
        },
      });
      return appointments;
    } catch (error) {
      throw error;
    }
  };
   */

  /**
   *
   *
   * @param date
   * @returns {Promise<Model[]>}
   */
  // getDayAppointmentByDate = async (doctor_id, provider_id, date) =>
  getAppointmentsByDate = async (date) => {
    try {
      let startOfDay = moment().startOf("day").toISOString();
      let endOfDay = moment().endOf("day").toISOString();

      if (date) {
        logger.debug("in if condition");
        startOfDay = moment(date, "DD-MM-YYYY").startOf("day").toISOString();
        endOfDay = moment(date, "DD-MM-YYYY").endOf("day").toISOString();
      }

      logger.debug({ date, startOfDay, endOfDay });

      const appointments = await Database.getModel(TABLE_NAME).findAll({
        where: {
          [Op.and]: [
            {
              start_date: {
                [Op.between]: [startOfDay, endOfDay],
              },
            },
            /**
             * TODO: Check why this has been commented?
            {
              [Op.or]: [
                {
                  participant_two_id: doctor_id,
                  participant_two_type: USER_CATEGORY.DOCTOR,
                  provider_id: provider_id,
                },
                {
                  participant_one_id: doctor_id,
                  participant_one_type: USER_CATEGORY.DOCTOR,
                  provider_id: provider_id,
                },
              ],
            },
             */
          ],
        },
      });
      return appointments;
    } catch (error) {
      throw error;
    }
  };

  /**
   *
   *
   * @param doctor_id
   * @param provider_id
   * @param date
   * @returns {Promise<Model[]>}
   */
  getDayAppointmentForDoctor = async (doctor_id, provider_id, date) => {
    try {
      const startOfDay = moment(date).startOf("day").toISOString();
      const endOfDay = moment(date).endOf("day").toISOString();
      const appointments = await Database.getModel(TABLE_NAME).findAll({
        where: {
          [Op.and]: [
            {
              start_date: {
                [Op.between]: [startOfDay, endOfDay],
              },
            },
            {
              [Op.or]: [
                {
                  participant_two_id: doctor_id,
                  participant_two_type: USER_CATEGORY.DOCTOR,
                  provider_id: provider_id,
                },
                {
                  participant_one_id: doctor_id,
                  participant_one_type: USER_CATEGORY.DOCTOR,
                  provider_id: provider_id,
                },
              ],
            },
          ],
        },
      });
      return appointments;
    } catch (error) {
      throw error;
    }
  };

  /**
   *
   *
   * @param doctor_id
   * @param provider_id
   * @param value
   * @returns {Promise<Model[]>}
   */
  getMonthAppointmentForDoctor = async (doctor_id, provider_id, value) => {
    try {
      const month = moment(value).month();
      const year = moment(value).year();
      const startOfMonth = moment()
        .month(month)
        .year(year)
        .startOf("month")
        .toISOString();
      const endOfMonth = moment()
        .month(month)
        .year(year)
        .endOf("month")
        .toISOString();
      if (provider_id) {
        const appointments = await Database.getModel(TABLE_NAME).findAll({
          where: {
            [Op.and]: [
              {
                start_date: {
                  [Op.between]: [startOfMonth, endOfMonth],
                },
              },
              {
                [Op.or]: [
                  {
                    participant_two_id: doctor_id,
                    participant_two_type: USER_CATEGORY.DOCTOR,
                    provider_id: provider_id,
                  },
                  {
                    participant_one_id: doctor_id,
                    participant_one_type: USER_CATEGORY.DOCTOR,
                    provider_id: provider_id,
                  },
                ],
              },
            ],
          },
        });
        return appointments;
      } else {
        const appointments = await Database.getModel(TABLE_NAME).findAll({
          where: {
            [Op.and]: [
              {
                start_date: {
                  [Op.between]: [startOfMonth, endOfMonth],
                },
              },
              {
                [Op.or]: [
                  {
                    participant_two_id: doctor_id,
                    participant_two_type: USER_CATEGORY.DOCTOR,
                  },
                  {
                    participant_one_id: doctor_id,
                    participant_one_type: USER_CATEGORY.DOCTOR,
                  },
                ],
              },
            ],
          },
        });
        return appointments;
      }
    } catch (error) {
      throw error;
    }
  };

  /**
   *
   *
   * @param doctor_id
   * @param date
   * @returns {Promise<Model[]>}
   */
  getMonthAppointmentCountForDoctor = async (doctor_id, date) => {
    try {
      const startOfMonth = moment(date).startOf("month").toISOString();
      const endOfMonth = moment(date).endOf("month").toISOString();

      const appointments = await Database.getModel(TABLE_NAME).findAll({
        attributes: ["start_date", [literal(`COUNT(*)`), "count"]],
        group: ["start_date"],
        where: {
          [Op.and]: [
            {
              start_date: {
                [Op.between]: [startOfMonth, endOfMonth],
              },
            },
            {
              [Op.or]: [
                {
                  participant_two_id: doctor_id,
                  participant_two_type: USER_CATEGORY.DOCTOR,
                },
                {
                  participant_one_id: doctor_id,
                  participant_one_type: USER_CATEGORY.DOCTOR,
                },
              ],
            },
          ],
        },
      });
      return appointments;
    } catch (error) {
      throw error;
    }
  };

  /**
   *
   *
   * @param start_time
   * @param end_time
   * @param participantOne
   * @param participantTwo
   * @returns {Promise<Model[]>}
   */
  checkTimeSlot = async (
    start_time,
    end_time,
    participantOne = {},
    participantTwo = {}
  ) => {
    try {
      const { participant_one_id, participant_one_type } = participantOne || {};
      const { participant_two_id, participant_two_type } = participantTwo || {};
      const appointments = await Database.getModel(TABLE_NAME).findAll({
        where: {
          [Op.or]: [
            {
              participant_one_id,
              participant_one_type,
            },
            {
              participant_two_id,
              participant_two_type,
            },
          ],
          [Op.and]: {
            [Op.or]: [
              {
                start_time: {
                  // [Op.or]: {
                  [Op.between]: [start_time, end_time],
                  // }
                },
              },
              {
                end_time: {
                  // [Op.or]: {
                  [Op.between]: [start_time, end_time],
                  // }
                },
              },
            ],
          },
        },
      });
      return appointments;
    } catch (error) {
      throw error;
    }
  };

  /**
   *
   *
   * @param id
   * @returns {Promise<*>}
   */
  deleteAppointment = async (id) => {
    try {
      const appointment = await Database.getModel(TABLE_NAME).destroy({
        where: {
          id,
        },
      });
      return appointment;
    } catch (err) {
      throw err;
    }
  };
}

export default new AppointmentService();
