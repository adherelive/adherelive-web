import { Op } from "sequelize";
import Database from "../../../libs/mysql";
import moment from "moment";
import { USER_CATEGORY } from "../../../constant";
import { TABLE_NAME } from "../../models/appointments";

class AppointmentService {
  async addAppointment(data) {
    const transaction = await Database.initTransaction();
    try {
      const appointment = await Database.getModel(TABLE_NAME).create(data, {
        transaction
      });
      await transaction.commit();
      return appointment;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  updateAppointment = async (id, data) => {
    try {
      const appointment = await Database.getModel(TABLE_NAME).update(data, {
        where: {
          id
        }
      });
      return appointment;
    } catch (err) {
      throw err;
    }
  };

  getAppointmentById = async id => {
    try {
      const appointment = await Database.getModel(TABLE_NAME).findOne({
        where: {
          id
        }
      });
      return appointment;
    } catch (err) {
      throw err;
    }
  };

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
              moment(today)
                .startOf("day")
                .toISOString(),
              moment(today)
                .endOf("day")
                .toISOString()
            ]
          },
          [Op.or]: [
            {
              participant_one_id,
              participant_one_type: USER_CATEGORY.DOCTOR
            },
            {
              participant_two_id,
              participant_two_type: USER_CATEGORY.DOCTOR
            }
          ]
        }
      });
      return appointments;
    } catch (error) {
      throw error;
    }
  };

  getAppointmentByData = async data => {
    try {
      const appointment = await Database.getModel(TABLE_NAME).findAll({
        where: data
      });
      return appointment;
    } catch (err) {
      throw err;
    }
  };

  getAppointmentForPatient = async patient_id => {
    try {
      const appointments = await Database.getModel(TABLE_NAME).findAll({
        where: {
          [Op.or]: [
            {
              participant_two_id: patient_id,
              participant_two_type: USER_CATEGORY.PATIENT
            },
            {
              participant_one_id: patient_id,
              participant_one_type: USER_CATEGORY.PATIENT
            }
          ]
        }
      });
      return appointments;
    } catch (error) {
      throw error;
    }
  };

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
              participant_one_type
            },
            {
              participant_two_id,
              participant_two_type
            }
          ],
          [Op.and]: {
            [Op.or]: [
              {
                start_time: {
                  // [Op.or]: {
                  [Op.between]: [start_time, end_time]
                  // }
                }
              },
              {
                end_time: {
                  // [Op.or]: {
                  [Op.between]: [start_time, end_time]
                  // }
                }
              }
            ]
          }
        }
      });
      return appointments;
    } catch (error) {
      throw error;
    }
  };

  deleteAppointment = async id => {
    try {
      const appointment = await Database.getModel(TABLE_NAME).destroy({
        where: {
          id
        }
      });
      return appointment;
    } catch (err) {
      throw err;
    }
  };
}

export default new AppointmentService();
