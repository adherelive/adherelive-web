import Patient from "../../models/patients";

class PatientsService {
    constructor() {}

    getAll = async () => {
        try {
            const patients = await Patient.findAll();
            return patients;
        } catch(error) {
            throw error;
        }
    };

    updatePatient = async (modelInstance, data) => {
      try {
          // todo: change to update when sign-in flow done for mobile
          const patient = await modelInstance.update({...data});
          return patient;
      } catch(error) {
          throw error;
      }
    };

    getPatientByData = async (data) => {
        try {
            const patient = await Patient.findAll({
                where: data
            });
            return patient;
        } catch(error) {
            throw error;
        }
    }

    getPatientByUserId = async user_id => {
        try {
            const patient = await Patient.findOne({
                where: {
                    user_id
                }
            });
            return patient;
        } catch(error) {
            throw error;
        }
    };
}

export default new PatientsService();