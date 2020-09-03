import Symptoms from "../../models/symptoms";
import Patients from "../../models/patients";
import CarePlan from "../../models/carePlan";
import Doctors from "../../models/doctors";

import {Op} from "sequelize";

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

  getFilteredData = async data => {
    try {
      const {patient_id, start_time, end_time} = data || {};
      const symptom = await Symptoms.findAll({
        where: {
          patient_id,
          created_at: {
            [Op.between]: [start_time, end_time]
          }
        },
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
