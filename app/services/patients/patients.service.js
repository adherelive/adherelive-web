import patientModel from "../../models/patients";

class PatientsService {
    constructor() {}

    updatePatient = async (modelInstance, data) => {
      try {
          // todo: change to update when sign-in flow done for mobile
          const patient = await modelInstance.update({...data});
          return patient;
      } catch(error) {
          throw error;
      }
    };

    getPatientByUserId = async user_id => {
        try {
            const patient = await patientModel.findOne({
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