import VitalTemplates from "../../models/vitalTemplates";
import {Op} from "sequelize";

class VitalTemplateService {

    searchByData = async (data) => {
        try {
            const vitalTemplates = await VitalTemplates.findAll({
                where: {
                    name: {
                        [Op.like]: `${data}%`,
                    },
                }
            });
            return vitalTemplates;
        } catch(error) {
            throw error;
        }
    };

    getByData = async (data) => {
        try {
            const vitalTemplates = await VitalTemplates.findOne({
                where: data
            });
            return vitalTemplates;
        } catch(error) {
            throw error;
        }
    };
}

export default new VitalTemplateService();