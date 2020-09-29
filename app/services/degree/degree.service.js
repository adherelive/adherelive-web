import {Op} from "sequelize";
import database from "../../../libs/mysql";

const {degrees: Degree} = database.models;

class DegreeService {

    getAll = async () => {
        try {
            const degree = await Degree.findAll();
            return degree;
        } catch(error) {
            throw error;
        }
    };

    search = async (data) => {
        try {
            const degree = await Degree.findAll({
                where: {
                    name: {
                        [Op.like]: `%${data}%`,
                    },
                },
            });
            return degree;
        } catch (error) {
            throw error;
        }
    };

    getByData = async data => {
        try {
            const degree = await Degree.findOne({
                where: data
            });
            return degree;
        } catch(error) {
            throw error;
        }
    };

    getDegreeByData = async data => {
        try {
            const degree = await Degree.findAll({
                where: data
            });
            return degree;
        } catch(error) {
            throw error;
        }
    };
}

export default new DegreeService();
