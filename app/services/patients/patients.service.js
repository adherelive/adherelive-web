import Database from "../../../libs/mysql";
import {TABLE_NAME} from "../../models/patients";

class PatientsService {
    constructor() {}

    getAll = async () => {
        try {
            const patients = await Database.getModel(TABLE_NAME).findAll();
            return patients;
        } catch(error) {
            throw error;
        }
    };

    updatePatient = async (modelInstance, data) => {
        const transaction = await Database.initTransaction();
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
        const transaction = await Database.initTransaction();
        try {
            // todo: change to update when sign-in flow done for mobile
            const patient = await Database.getModel(TABLE_NAME).update(data, {
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
        const transaction = await Database.initTransaction();
        try {
            const patient = await Database.getModel(TABLE_NAME).create(data, {transaction});
            await transaction.commit();
            return patient;
        } catch(error) {
            await transaction.rollback();
            throw error;
        }
      };

    getPatientByData = async (data) => {
        try {
            const patient = await Database.getModel(TABLE_NAME).findAll({
                where: data
            });
            return patient;
        } catch(error) {
            throw error;
        }
    }

    getPatientById = async (data) => {
        try {
            const patient = await Database.getModel(TABLE_NAME).findOne({
                where: data
            });
            return patient;
        } catch(error) {
            throw error;
        }
    };

    getPatientByUserId = async user_id => {
        try {
            const patient = await Database.getModel(TABLE_NAME).findOne({
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