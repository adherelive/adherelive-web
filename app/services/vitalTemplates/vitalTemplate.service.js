import {Op} from "sequelize";
import Database from "../../../libs/mysql";
import {TABLE_NAME} from "../../models/vitalTemplates";

class VitalTemplateService {

    searchByData = async (data) => {
        try {
            const vitalTemplates = await Database.getModel(TABLE_NAME).findAll({
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
            const vitalTemplates = await Database.getModel(TABLE_NAME).findOne({
                where: data
            });
            return vitalTemplates;
        } catch(error) {
            throw error;
        }
    };

    getAllByData = async (data) => {
        try {
            return await Database.getModel(TABLE_NAME).findAll({
                where: data
            });
        } catch(error) {
            throw error;
        }
    };
}

export default new VitalTemplateService();