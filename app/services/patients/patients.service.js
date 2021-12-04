import Sequelize from "sequelize";
import Database from "../../../libs/mysql";
import {Op} from "sequelize";
import {TABLE_NAME} from "../../models/patients";
import {TABLE_NAME as userTableName} from "../../models/users";
import {TABLE_NAME as careplanTableName} from "../../models/carePlan";
import Log from "../../../libs/log";
import {TABLE_NAME as doctorTableName} from "../../models/doctors";

const Logger = new Log("WEB > PATIENTS > CONTROLLER");

class PatientsService {
  constructor() {
  }
  
  getAll = async () => {
    try {
      const patients = await Database.getModel(TABLE_NAME).findAll();
      return patients;
    } catch (error) {
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
    } catch (error) {
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
          id,
        },
        transaction,
      });
      await transaction.commit();
      return patient;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };
  
  addPatient = async (data) => {
    const transaction = await Database.initTransaction();
    try {
      const patient = await Database.getModel(TABLE_NAME).create(data, {
        transaction,
      });
      await transaction.commit();
      return patient;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };
  
  getPatientByData = async (data) => {
    try {
      const patient = await Database.getModel(TABLE_NAME).findAll({
        where: data,
        include: [Database.getModel(userTableName)],
      });
      return patient;
    } catch (error) {
      throw error;
    }
  };
  
  getPatientById = async (data) => {
    try {
      const patient = await Database.getModel(TABLE_NAME).findOne({
        where: data,
        include: [
          {
            model: Database.getModel(userTableName),
          },
        ],
      });
      return patient;
    } catch (error) {
      throw error;
    }
  };
  
  getPatientByIdForPatientSearch = async (id) => {
    try {
      const patient = await Database.getModel(TABLE_NAME).findOne({
        where: {
          id,
        },
        include: [
          {
            model: Database.getModel(userTableName),
          },
        ],
      });
      Logger.debug("GETPDATA--------------->", id);
      Logger.debug("PATIENTTTTTTTT====>", patient);
      return patient;
    } catch (error) {
      throw error;
    }
  };
  
  getPatientByUserId = async (user_id) => {
    try {
      const patient = await Database.getModel(TABLE_NAME).findOne({
        where: {
          user_id,
        },
      });
      return patient;
    } catch (error) {
      throw error;
    }
  };
  
  getPatientForDoctor = async (value, patientIdsForThisDoc) => {
    try {
      let firstName = value;
      let middleName = value;
      let lastName = value;
      const name = value.split(" ");
      
      if (name.length > 1) {
        if (name.length === 2) {
          firstName = name[0];
          middleName = name[1];
        } else {
          firstName = name[0];
          middleName = name[1];
          lastName = name[2];
        }
      }
      
      Logger.debug("2313131231", isNaN(value));
      
      const patient = await Database.getModel(TABLE_NAME).findAll({
        where: {
          [Op.and]: [
            {
              [Op.or]: [
                {
                  first_name: {
                    [Op.like]: `%${firstName}%`,
                  },
                },
                {
                  middle_name: {
                    [Op.like]: `%${middleName}%`,
                  },
                },
                {
                  last_name: {
                    [Op.like]: `%${lastName}%`,
                  },
                },
              ],
            },
            {
              id: {
                [Op.in]: patientIdsForThisDoc,
              },
            },
          ],
        },
        include: [
          {
            model: Database.getModel(userTableName),
          },
        ],
      });
      
      return patient;
    } catch (err) {
      throw err;
    }
  };
  
  getPatientByMobileForDoctor = async (value, userIdsForForPatientForDoc) => {
    try {
      const user = await Database.getModel(userTableName).findAll({
        where: {
          [Op.and]: [
            {
              mobile_number: {
                [Op.like]: `${value}%`,
              },
            },
            {
              id: {
                [Op.in]: userIdsForForPatientForDoc,
              },
            },
          ],
        },
        include: [
          {
            model: Database.getModel(TABLE_NAME),
          },
        ],
      });
      return user;
    } catch (err) {
      throw err;
    }
  };
  
  getPaginatedPatients = async ({doctor_id, order}) => {
    const query = `
    SELECT cp.doctor_id, cp.patient_id FROM ${careplanTableName} AS cp
    
    `;
    try {
      return await Database.getModel(TABLE_NAME).findAll({
        attributes: ["each", []],
        include: [
          {
            model: Database.getModel(careplanTableName),
            where: {
              "$care_plan.doctor_id$": doctor_id,
            },
          },
        ],
        having: Sequelize.literal(``),
        order: [["first_name", "ASC"]],
        raw: true,
      });
    } catch (error) {
      throw error;
    }
  };
}

export default new PatientsService();
