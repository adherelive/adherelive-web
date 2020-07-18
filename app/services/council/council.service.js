import Council from "../../models/registrationCouncil";
import Sequelize from "sequelize";

const Op = Sequelize.Op;

class CouncilService {

    getAll = async () => {
        try {
            const council = await Council.findAll();
            return council;
        } catch(error) {
            throw error;
        }
    };

    search = async (data) => {
        try {
            const council = await Council.findAll({
                where: {
                    name: {
                        [Op.like]: `%${data}%`,
                    },
                },
            });
            return council;
        } catch (error) {
            throw error;
        }
    };

    getByData = async data => {
        try {
            const council = await Council.findOne({
                where: data
            });
            return council;
        } catch(error) {
            throw error;
        }
    };
}

export default new CouncilService();
