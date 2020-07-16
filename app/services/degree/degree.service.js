import Degree from "../../models/degree";

class DegreeService {

    getAll = async () => {
        try {
            const degree = await Degree.findAll();
            return degree;
        } catch(error) {
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
}

export default new DegreeService();
