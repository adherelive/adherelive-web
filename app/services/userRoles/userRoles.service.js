import Database from "../../../libs/mysql";

// TABLES
import { TABLE_NAME } from "../../models/userRoles";

const DEFAULT_ORDER = [["created_at","DESC"]];

class UserRolesService {
  constructor() {}

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

  getSingleUserRoleByData = async data => {
    try {
      const userRoles = await Database.getModel(TABLE_NAME).findOne({
        where: data
      });
      return userRoles;
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
