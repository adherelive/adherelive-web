import User from "../../models/users";
import {database} from "../../../libs/mysql";
import {USER_CATEGORY} from "../../../constant";
import {Op} from "sequelize";

import Permissions from "../../models/permissions";
import UserCategoryPermissions from "../../models/userCategoryPermissions";
import UserDevices from "../../models/userDevices";
import Doctors from "../../models/doctors";
import Patients from "../../models/patients";

class UserService {
    constructor() {
    }

    async getAll() {
        try {
            const user = await User.findAll();
            return user;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    getUser = async (id) => {
        try {
            const user = await User.findOne({
                where: {
                    id
                }
            });
            return user;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async getUserByEmail(data) {
        try {
            const {email} = data;
            const user = await User.findOne({
                where: {
                    email
                }
            });
            return user;
        } catch (error) {
            throw error;
        }
    }

    getUserByNumber = async (data) => {
        try {
            const user = await User.findOne({
                where: {
                    ...data,
                    category: USER_CATEGORY.PATIENT
                }
            });
            return user;
        } catch (error) {
            throw error;
        }
    }

    getUserById = async id => {
        try {
            const user = await User.findOne({
                where: {
                    id
                },
                include: [Doctors, Patients]
            });
            return user;
        } catch (err) {
            throw err;
        }
    };

    getUserByData = async data => {
        try {
            const user = await User.findAll({
                where: data
            });
            return user;
        } catch (err) {
            throw err;
        }
    };

    async addUser(data) {
        const transaction = await database.transaction();
        try {
            const response = await User.create(data, {transaction});
            await transaction.commit();
            return response;
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    }

    updateEmail = async (data, id) => {
        const transaction = await database.transaction();
        try {
            const user = await User.update(data, {
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
        const transaction = await database.transaction();
        try {
            const user = await User.update(data, {
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

    getPatientByMobile = async (mobile_number) => {
        try {
            const user = await User.findAll({
                where: {
                    category: USER_CATEGORY.PATIENT,
                    mobile_number,
                }
            });
            return user;
        } catch (err) {
            throw err;
        }
    };

    getUserByUsername = async (user_name) => {
        try {
            const user = await User.findOne({
                where: {
                    // category: USER_CATEGORY.PATIENT,
                    [Op.or]: [
                        {
                            email: user_name
                        },
                        {
                            mobile_number: user_name
                        }
                    ]
                }
            });
            return user;
        } catch (err) {
            throw err;
        }
    };


    getUserData = async (data) => {
      try {
          const user = await User.findOne({
              where: data,
              include: Permissions
          });
          return user;
      } catch(error) {
          throw error;
      }
    };

    getUserByDevices = async (data) => {
        try {
            const user = await User.findOne({
                where: data,
                include: [UserDevices]
            });
            return user;
        } catch(error) {
            throw error;
        }
    };
}

export default new UserService();
