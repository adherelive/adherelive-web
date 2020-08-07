import Appointments from "../../models/appointments";
import { Op } from "sequelize";
import {database} from "../../../libs/mysql";

class AppointmentService {
  async addAppointment(data) {
    const transaction = await database.transaction();
    try {
      const appointment = await Appointments.create(data, {transaction});
      await transaction.commit();
      return appointment;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  updateAppointment = async (id, data) => {
    try {
      console.log("29371381y73 data ---> ", data);
      const appointment = await Appointments.update(data, {
        where: {
          id
        }
      });
      console.log("29371381y73 data ---> ", appointment);
      return appointment;
    } catch(err) {
      throw err;
    }
  };

  getAppointmentById = async (id) => {
    try {
      const appointment = await Appointments.findOne({
        where: {
          id
        },
      });
      return appointment;
    } catch (err) {
      throw err;
    }
  };

  getAppointmentByData = async (data) => {
    try {
      const appointment = await Appointments.findAll({
        where: data,
      });
      return appointment;
    } catch (err) {
      throw err;
    }
  };

  getAppointmentForPatient = async (patient_id) => {
    try {
      const appointments = await Appointments.findAll({
        where: {
          [Op.or]: [
            {
              participant_two_id: patient_id,
            },
            {
              participant_one_id: patient_id,
            },
          ],
        },
      });
      return appointments;
    } catch (error) {
      throw error;
    }
  };

  checkTimeSlot = async (start_time, end_time, participantOne = {}, participantTwo = {}) => {
    try {
      const {participant_one_id, participant_one_type} = participantOne || {};
      const {participant_two_id, participant_two_type} = participantTwo || {};
      const appointments = await Appointments.findAll({
        where: {
          // [Op.or]: [
          //   {
          //     participant_one_id,
          //     participant_one_type,
          //   },
          //   {
          //     participant_two_id,
          //     participant_two_type,
          //   }
          // ],
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
          [Op.and] : {
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
            ],
          },
        },
      });
      return appointments;
    } catch (error) {
      throw error;
    }
  };

  deleteAppointment = async id => {
    try {
      const appointment = await Appointments.destroy({
        where: {
          id
        }
      });
      return appointment;
    } catch(err) {
      throw err;
    }
  };
}

export default new AppointmentService();
