import Database from "../../../libs/mysql";
import { USER_CATEGORY } from "../../../constant";
import { Op } from "sequelize";

// TABLES
import { TABLE_NAME } from "../../models/users";
// import { TABLE_NAME as permissionTableName } from "../../models/permissions";
import { TABLE_NAME as doctorTableName } from "../../models/doctors";
import { TABLE_NAME as patientTableName } from "../../models/patients";
import { TABLE_NAME as userDeviceTableName } from "../../models/userDevices";
import { TABLE_NAME as carePlanTableName } from "../../models/carePlan";
import { TABLE_NAME as providerTableName } from "../../models/providers";

import Log from "../../../libs/log";

const Logger = new Log("WEB > PATIENTS > CONTROLLER");

class UserService {
  constructor() {}

  async getAll() {
    try {
      const user = await Database.getModel(TABLE_NAME).findAll();
      return user;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  getUser = async id => {
    try {
      const user = await Database.getModel(TABLE_NAME).findOne({
        where: {
          id
        },
        include: [
          Database.getModel(doctorTableName),
          Database.getModel(patientTableName),
          Database.getModel(providerTableName)
        ]
      });
      return user;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  async getUserByEmail(data) {
    try {
      const { email } = data;
      const user = await Database.getModel(TABLE_NAME).findOne({
        where: {
          email,
          [Op.or]: [
            {
              category: USER_CATEGORY.DOCTOR
            },
            {
              category: USER_CATEGORY.ADMIN
            },
            {
              category: USER_CATEGORY.PROVIDER
            },
            {
              category: USER_CATEGORY.HSP
            }
          ]
        }
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  getUserByNumber = async data => {
    try {
      const user = await Database.getModel(TABLE_NAME).findOne({
        where: {
          ...data,
          category: USER_CATEGORY.PATIENT
        }
      });
      return user;
    } catch (error) {
      throw error;
    }
  };

  getUserById = async id => {
    try {
      const user = await Database.getModel(TABLE_NAME).findOne({
        where: {
          id
        },
        include: [
          {
            model: Database.getModel(doctorTableName),
            paranoid: false
          },
          {
            model: Database.getModel(patientTableName),
            paranoid: false
          }
        ],
        paranoid: false
      });
      return user;
    } catch (err) {
      throw err;
    }
  };

  getUserByData = async data => {
    try {
      const user = await Database.getModel(TABLE_NAME).findAll({
        where: data,
        paranoid: false
      });
      return user;
    } catch (err) {
      throw err;
    }
  };

  async addUser(data) {
    const transaction = await Database.initTransaction();
    try {
      const response = await Database.getModel(TABLE_NAME).create(data, {
        transaction
      });
      await transaction.commit();
      return response;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  updateEmail = async (data, id) => {
    const transaction = await Database.initTransaction();
    try {
      const user = await Database.getModel(TABLE_NAME).update(data, {
        where: {
          id
        },
        transaction
      });
      await transaction.commit();
      return user;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  updateUser = async (data, id) => {
    const transaction = await Database.initTransaction();
    try {
      const user = await Database.getModel(TABLE_NAME).update(data, {
        where: {
          id
        },
        transaction
      });
      await transaction.commit();
      return user;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  getPatientByMobile = async mobile_number => {
    try {
      const user = await Database.getModel(TABLE_NAME).findAll({
        where: {
          category: USER_CATEGORY.PATIENT,
          mobile_number
        },
        include: [
          {
            model: Database.getModel(patientTableName)
          }
        ]
      });
      return user;
    } catch (err) {
      throw err;
    }
  };

  // getUserByUsername = async user_name => {
  //   try {
  //     const user = await Database.getModel(TABLE_NAME).findOne({
  //       where: {
  //         // category: USER_CATEGORY.PATIENT,
  //         [Op.or]: [
  //           {
  //             email: user_name
  //           },
  //           {
  //             mobile_number: user_name
  //           }
  //         ]
  //       }
  //     });
  //     return user;
  //   } catch (err) {
  //     throw err;
  //   }
  // };

  getUserData = async data => {
    try {
      const user = await Database.getModel(TABLE_NAME).findOne({
        where: data
      });
      return user;
    } catch (error) {
      throw error;
    }
  };

  getUserByDevices = async data => {
    try {
      const user = await Database.getModel(TABLE_NAME).findOne({
        where: data,
        include: [Database.getModel(userDeviceTableName)]
      });
      return user;
    } catch (error) {
      throw error;
    }
  };

  getCarePlanData = async id => {
    try {
      const carePlan = await Database.getModel(carePlanTableName).findOne({
        where: {
          id
        }
      });
      return carePlan;
    } catch (error) {
      throw error;
    }
  };

  deleteUser = async ({ id }) => {
    try {
      const users = await Database.getModel(TABLE_NAME).destroy({
        where: {
          id
        }
      });
      return users;
    } catch (err) {
      throw err;
    }
  };

  activateUser = async ({ id }) => {
    try {
      const users = await Database.getModel(TABLE_NAME).update(
        { deleted_at: null },
        {
          where: {
            id
          },
          paranoid: false
        }
      );
      return users;
    } catch (err) {
      throw err;
    }
  };

  searchMail = async value => {
    try {
      const matchingUsers = await Database.getModel(TABLE_NAME).findAll({
        where: {
          email: {
            [Op.like]: `${value}%`
          }
        },
        paranoid: false
      });
      return matchingUsers;
    } catch (err) {
      throw err;
    }
  };
}

export default new UserService();
