import Symptoms from "../../models/symptoms";
import Patients from "../../models/patients";
import CarePlan from "../../models/carePlan";
import Doctors from "../../models/doctors";
import Users from "../../models/users";

class SymptomService {
  create = async data => {
    try {
      const symptom = await Symptoms.create(data);
      return symptom;
    } catch (error) {
      throw error;
    }
  };

  getByData = async data => {
    try {
      const symptom = await Symptoms.findOne({
        where: data,
        include: [
          {
            model: Patients
          },
          {
            model: CarePlan,
            include: [Doctors]
          }
        ]
      });
      return symptom;
    } catch (error) {
      throw error;
    }
  };

  getAllByData = async data => {
    try {
      const symptom = await Symptoms.findAll({
        where: data,
        include: [
          {
            model: Patients
          },
          {
            model: CarePlan,
            include: [Doctors]
          }
        ]
      });
      return symptom;
    } catch (error) {
      throw error;
    }
  };
}

export default new SymptomService();
