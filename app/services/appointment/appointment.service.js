import Appointments from "../../models/appointments";
import { Op } from "sequelize";

class AppointmentService {
  async addAppointment(data) {
    try {
      const appointment = await Appointments.create(data);
      return appointment;
    } catch (err) {
      throw err;
    }
  }

  getAppointment = async (data) => {
    try {
      const appointment = await Appointments.findOne({
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

  checkTimeSlot = async (start_date, start_time, end_time) => {
    try {
      const appointments = await Appointments.findAll({
        where: {
          [Op.or]: [
            {
              start_date: {
                // [Op.or]: {
                  [Op.between]: [start_date, start_date]
                // }
              }
            },
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
        },
      });
      return appointments;
    } catch (error) {
      throw error;
    }
  };
}

export default new AppointmentService();
