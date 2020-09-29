import database from "../../../libs/mysql";

const {patients: Patient} = database.models;

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
        const transaction = await database.transaction();
      try {
          // todo: change to update when sign-in flow done for mobile
          const patient = await modelInstance.update({...data}, {transaction});
          await transaction.commit();
          return patient;
      } catch(error) {
          await transaction.rollback();
          throw error;
      }
    };

    update = async (data, id) => {
        const transaction = await database.transaction();
        try {
            // todo: change to update when sign-in flow done for mobile
            const patient = await Patient.update(data, {
                where: {
                    id
                },
                transaction
            });
            await transaction.commit();
            return patient;
        } catch(error) {
            await transaction.rollback();
            throw error;
        }
    };

    addPatient = async data => {
        const transaction = await database.transaction();
        try {
            const patient = await Patient.create(data, {transaction});
            await transaction.commit();
            return patient;
        } catch(error) {
            await transaction.rollback();
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

    getPatientById = async (data) => {
        try {
            const patient = await Patient.findOne({
                where: data
            });
            return patient;
        } catch(error) {
            throw error;
        }
    };

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