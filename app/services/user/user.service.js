import { database } from "../../../libs/mysql";
import Sequelize from "sequelize";
import userModel from "../../models/users";

class UserService {
    constructor() {
    }

    async getUser(data) {
        try {
            const id = data._id;
            const user = await database.query('SELECT * from users WHERE id=:userId', {
                replacements: {userId: id},
                type: Sequelize.QueryTypes.SELECT
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

}

module.exports = new UserService();
