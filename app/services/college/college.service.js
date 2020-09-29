import {Op} from "sequelize";
import database from "../../../libs/mysql";

const {colleges: College} = database.models;

class CollegeService {

    getAll = async () => {
        try {
            const college = await College.findAll();
            return college;
        } catch(error) {
            throw error;
        }
    };

    search = async (data) => {
        try {
            const college = await College.findAll({
                where: {
                    name: {
                        [Op.like]: `%${data}%`,
                    },
                },
            });
            return college;
        } catch (error) {
            throw error;
        }
    };

    getByData = async data => {
        try {
            const college = await College.findOne({
                where: data
            });
            return college;
        } catch(error) {
            throw error;
        }
    };

    getCollegeByData = async data => {
        try {
            const college = await College.findAll({
                where: data
            });
            return college;
        } catch(error) {
            throw error;
        }
    };
}

export default new CollegeService();
