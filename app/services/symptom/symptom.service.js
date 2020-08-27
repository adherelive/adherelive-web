import Symptoms from "../../models/symptoms";
import Patients from "../../models/patients";
import CarePlan from "../../models/carePlan";
import Doctors from "../../models/doctors";

class SymptomService {
    create = async (data) => {
      try {
          const symptom = await Symptoms.create(data);
          return symptom;
      } catch(error) {
          throw error;
      }
    };

    getByData = async (data) => {
        try {
            const symptom = await Symptoms.findOne({
                where: data,
                include: [Patients, {
                    model: CarePlan,
                    include: [Doctors]
                }]
            });
            return symptom;
        } catch(error) {
            throw error;
        }
    };
}

export default new SymptomService();