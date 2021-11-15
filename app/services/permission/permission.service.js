import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/permissions";

class PermissionService {
  constructor() {}

  deleteAll = async () => {
    try {
      await Database.getModel(TABLE_NAME).destroy({
        // truncate: true,
        where: {},
        force: true
      });

      return true;
    } catch (error) {
      throw error;
    }
  };

  bulkCreate = async (permissions) => {
    const transaction = await Database.initTransaction();
    try {
      const createdPermissions = await Database.getModel(
        TABLE_NAME
      ).bulkCreate(permissions, { transaction });

      await transaction.commit();
      return createdPermissions;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  getPermissionsById = async (data) => {
    try {
      const permissions = Database.getModel(TABLE_NAME).findAll({
        where: {
          id: data,
        },
      });
      return permissions;
    } catch (error) {
      throw error;
    }
  };
}

export default new PermissionService();
