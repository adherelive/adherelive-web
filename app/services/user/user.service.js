import userModel from "../../models/users";
import {database} from "../../../libs/mysql";

class UserService {
    constructor() {
    }

    async getAll() {
        try {
            const user = await userModel.findAll();
            return user;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    getUser = async (id) => {
        try {
            const user = await userModel.findOne({
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
            const user = await userModel.findOne({
                where: {
                    email
                }
            });
            return user;
        } catch (error) {
            throw error;
        }
    }

    getUserById = async id => {
        try {
            const user = await userModel.findOne({
                where: {
                    id
                }
            });
            return user;
        } catch (err) {
            throw err;
        }
    };

    getUserByData = async data => {
        try {
            const user = await userModel.findAll({
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
            const response = await userModel.create(data, {transaction});
            await transaction.commit();
            return response;
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    }

    updateEmail = async (email, id) => {
        const transaction = await database.transaction();
        try {
            const user = await userModel.update({
               email,
            }, {
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
            const user = await userModel.update(data, {
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

}

export default new UserService();
