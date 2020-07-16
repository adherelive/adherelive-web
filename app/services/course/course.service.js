import Course from "../../models/course";

class CourseService {

    getAll = async () => {
        try {
            const course = await Course.findAll();
            return course;
        } catch(error) {
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
