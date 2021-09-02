import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/userCategoryPermissions";

class UserPermissionService {
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

  bulkCreate = async userPermissions => {
    const transaction = await Database.initTransaction();
    try {
      const createdUserPermissions = await Database.getModel(
        TABLE_NAME
      ).bulkCreate(userPermissions, { transaction });

      await transaction.commit();
      return createdUserPermissions;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  getPermissionsByData = async data => {
    try {
      const userPermission = Database.getModel(TABLE_NAME).findAll({
        where: data
      });
      return userPermission;
    } catch (error) {
      throw error;
    }
  };
}

export default new UserPermissionService();
