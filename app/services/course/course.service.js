import Course from "../../models/course";
import Sequelize from "sequelize";

const Op = Sequelize.Op;

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
