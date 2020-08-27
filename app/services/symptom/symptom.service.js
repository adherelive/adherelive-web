import Symptoms from "../../models/symptoms";

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
                where: data
            });
            return symptom;
        } catch(error) {
            throw error;
        }
    };
}

export default new SymptomService();