import Treatment from "../../models/treatments";
import Sequelize from "sequelize";

const Op = Sequelize.Op;

class TreatmentService {

    getAll = async (data) => {
        try {
            const treatment = await Treatment.findAll({
                where: data
            });
            return treatment;
        } catch(error) {
            throw error;
        }
    };

    search = async (data) => {
        try {
            const treatment = await Treatment.findAll({
                where: {
                    name: {
                        [Op.like]: `%${data}%`,
                    },
                },
            });
            return treatment;
        } catch (error) {
            throw error;
        }
    };

    getByData = async data => {
        try {
            const treatment = await Treatment.findOne({
                where: data
            });
            return treatment;
        } catch(error) {
            throw error;
        }
    };
}

export default new TreatmentService();
