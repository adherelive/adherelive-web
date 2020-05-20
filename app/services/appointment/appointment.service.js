
import Appointments from "../../models/appointments";

class AppointmentService {
    async addAppointment(data) {
        try {
            const response = await Appointments.create(data);
            return response;
        } catch (err) {
            throw err;
        }
    }
}

export default new AppointmentService();