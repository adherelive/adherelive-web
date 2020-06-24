import CarePlanMedication from "../../models/carePlanMedications";

class CarePlanMedicationService {

    getCarePlanMedicationByData = async (data) => {
        try {
            console.log("careplan data --> ", data);
            const carePlanMedications = await CarePlanMedication.findAll({
                where: data
            });
            return carePlanMedications;
        } catch(error) {
            throw error;
        }
    };

    getSingleCarePlanMedicationByData = async (data) => {
        try {
            console.log("careplan data --> ", data);
            const carePlanMedication = await CarePlanMedication.findOne({
                where: data
            });
            return carePlanMedication;
        } catch(error) {
            throw error;
        }
    };

    getMedicationsByCarePlanId = async (care_plan_id) => {
        try {
            console.log("careplan IDDDDDDDDD in MEDICATIONNNNN ----> ", care_plan_id);
            const carePlanMedications = await CarePlanMedication.findAll({
                where: {care_plan_id}
            });
            return carePlanMedications;
        } catch(error) {
            throw error;
        }
    };

    addCarePlanMedication = async data => {
        try {
            const carePlanMedication = await CarePlanMedication.create(data);
            return carePlanMedication;
        } catch(error) {
            throw error;
        }
      };
}

export default new CarePlanMedicationService();