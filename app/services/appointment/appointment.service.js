
import Appointments from "../../models/appointments";

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
              where: data
          });
          return appointment;
      }  catch(err) {
          throw err;
      }
    };
}

export default new AppointmentService();