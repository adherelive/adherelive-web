import Database from "../../../libs/mysql";

// TABLES
import { TABLE_NAME } from "../../models/userRoles";

const DEFAULT_ORDER = [["created_at","DESC"]];

class UserRolesService {
  constructor() {}

  async getAll() {
    try {
      const userRoles = await Database.getModel(TABLE_NAME).findAll();
      return userRoles;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async create(data) {
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

  getAllUserRolesByData = async data => {
    try {
      const userRoles = await Database.getModel(TABLE_NAME).findAll({
        where: data
      });
      return userRoles;
    } catch (error) {
      throw error;
    }
  };

  getUserRoleById = async id => {
    try {
      const userRole = await Database.getModel(TABLE_NAME).findOne({
        where: {
          id
        },
      });
      return userRole;

    } catch (error) {
      throw error;
    }
  };


  getFirstUserRole = async (userIdentity) => {
    try {
      const userRole = await Database.getModel(TABLE_NAME).findOne({
        where: {
          user_identity: userIdentity,
        },
        order: [["created_at", "ASC"]]
      });
      return userRole;
    } catch (error) {
      throw error;
    }
  };

  
  getUserRolesByUserId = async user_id => {
    try {
      const userRoles = await Database.getModel(TABLE_NAME).findAll({
        where: {
            user_identity:user_id
          },
      });
      return userRoles;
    } catch (error) {
      throw error;
    }
  };


  getAllByData = async data => {
    try {
      const userRoles = await Database.getModel(TABLE_NAME).findAll({
        where: data
      });
      return userRoles;
    } catch (error) {
      throw error;
    }
  };

  findAndCountAll = async ({where, order = DEFAULT_ORDER, attributes}) => {
    try {
      return await Database.getModel(TABLE_NAME).findAndCountAll({
        where,
        order,
        attributes,
        raw: true
      });
    } catch (error) {
      throw error;
    }
  };

}

export default new UserRolesService();
