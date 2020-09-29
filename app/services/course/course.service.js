import {Op} from "sequelize";
import database from "../../../libs/mysql";

const {courses: Course} = database.models;

class CourseService {

    getAll = async () => {
        try {
            const course = await Course.findAll();
            return course;
        } catch(error) {
            throw error;
        }
    };

    search = async (data) => {
        try {
            const course = await Course.findAll({
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
            const course = await Course.findOne({
                where: data
            });
            return course;
        } catch(error) {
            throw error;
        }
    };
}

export default new CourseService();
