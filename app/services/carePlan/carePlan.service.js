import database from "../../../libs/mysql";

const {
  care_plans: CarePlan,
  patients: Patients,
  doctors: Doctors,
  care_plan_appointments: CarePlanAppointment,
  care_plan_medications: CarePlanMedication
} = database.models;

class CarePlanService {
  getCarePlanByData = async data => {
    try {
      console.log("careplan data --> ", data);
      const carePlan = await CarePlan.findAll({
        where: data,
        include: [Patients, Doctors, CarePlanAppointment, CarePlanMedication]
      });
      return carePlan;
    } catch (error) {
      throw error;
    }
  };

  getCarePlanById = async id => {
    try {
      console.log("careplan data --> ", id);
      const carePlan = await CarePlan.findOne({
        where: { id },
        include: [Patients, Doctors, CarePlanAppointment, CarePlanMedication]
      });
      return carePlan;
    } catch (error) {
      throw error;
    }
  };

  getSingleCarePlanByData = async data => {
    try {
      console.log("careplan data --> ", data);
      const carePlan = await CarePlan.findOne({
        where: data,
        include: [Patients, Doctors, CarePlanAppointment, CarePlanMedication]
      });
      return carePlan;
    } catch (error) {
      throw error;
    }
  };

  updateCarePlan = async (data, id) => {
    try {
      const carePlan = await CarePlan.update(data, {
        where: {
          id
        }
      });
      return carePlan;
    } catch (error) {
      throw error;
    }
  };

  addCarePlan = async data => {
    try {
      const carePlan = await CarePlan.create(data);
      return carePlan;
    } catch (error) {
      throw error;
    }
  };
}

export default new CarePlanService();
