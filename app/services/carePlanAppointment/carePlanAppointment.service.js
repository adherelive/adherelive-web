import CarePlanAppointments from "../../models/carePlanAppointments";

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

    addCarePlanAppointment = async data => {
        try {
            const carePlanAppointment = await CarePlanAppointments.create(data);
            return carePlanAppointment;
        } catch(error) {
            throw error;
        }
      };
}

export default new CarePlanAppointmentService();