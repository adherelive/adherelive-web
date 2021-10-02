import {Op} from "sequelize";
import Database from "../../../libs/mysql";
import {TABLE_NAME} from "../../models/course";

class CourseService {
    getAll = async () => {
        try {
            const course = await Database.getModel(TABLE_NAME).findAll();
            return course;
        } catch (error) {
            throw error;
        }
    };

    search = async (data) => {
        try {
            const course = await Database.getModel(TABLE_NAME).findAll({
                where: {
                    name: {
                        [Op.like]: `%${data}%`,
                    },
                },
            });
            return course;
        } catch (error) {
            throw error;
        }
    };

    getByData = async data => {
        try {
            const course = await Database.getModel(TABLE_NAME).findOne({
                where: data
            });
            return course;
        } catch (error) {
            throw error;
        }
    };
}

export default new CourseService();
