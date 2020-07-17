import Degree from "../../models/degree";
import Sequelize from "sequelize";

const Op = Sequelize.Op;

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
}

export default new DegreeService();
