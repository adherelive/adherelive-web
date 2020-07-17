import Severity from "../../models/severity";
import Sequelize from "sequelize";

const Op = Sequelize.Op;

class SeverityService {

    getAll = async () => {
        try {
            const severity = await Severity.findAll();
            return severity;
        } catch(error) {
            throw error;
        }
    };

    search = async (data) => {
        try {
            const severity = await Severity.findAll({
                where: {
                    name: {
                        [Op.like]: `%${data}%`,
                    },
                },
            });
            return severity;
        } catch (error) {
            throw error;
        }
    };

    getByData = async data => {
        try {
            const severity = await Severity.findOne({
                where: data
            });
            return severity;
        } catch(error) {
            throw error;
        }
    };
}

export default new SeverityService();
