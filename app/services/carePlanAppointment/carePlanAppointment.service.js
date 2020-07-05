import CarePlanAppointments from "../../models/carePlanAppointments";
import CarePlan from "../../models/carePlan";

class CarePlanAppointmentService {

    getCarePlanAppointmentsByData = async (data) => {
        try {
            console.log("careplan data --> ", data);
            const carePlanAppointments = await CarePlanAppointments.findAll({
                where: data
            });
            return carePlanAppointments;
        } catch(error) {
            throw error;
        }
    };

    getSingleCarePlanAppointmentByData = async (data) => {
        try {
            console.log("careplan data --> ", data);
            const carePlanAppointment = await CarePlanAppointments.findOne({
                where: data
            });
            return carePlanAppointment;
        } catch(error) {
            throw error;
        }
    };

    getAppointmentsByCarePlanId = async (care_plan_id) => {
        try {
            console.log("careplan IDDDDDDD in APPOINTMENT--> ", care_plan_id);
            const carePlanAppointments = await CarePlanAppointments.findAll({
                where: {care_plan_id}
            });
            return carePlanAppointments;
        } catch(error) {
            throw error;
        }
    };

    deleteCarePlanAppointmentByAppointmentId = async appointment_id => {
        try {
          const carePlanAppointments = await CarePlanAppointments.destroy({
            where: {
                appointment_id
            }
          });
          return carePlanAppointments;
        } catch(err) {
          throw err;
        }
      };

    addCarePlanAppointment = async data => {
        try {
            const carePlanAppointment = await CarePlanAppointments.create(data, {
                include: CarePlan
            });
            return carePlanAppointment;
        } catch(error) {
            throw error;
        }
      };
}

export default new CarePlanAppointmentService();