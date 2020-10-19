import {Op} from "sequelize";
import Database from "../../../libs/mysql";
import {TABLE_NAME} from "../../models/treatments";

class TreatmentService {

    getAll = async (data) => {
        try {
            const treatment = await Database.getModel(TABLE_NAME).findAll();
            return treatment;
        } catch(error) {
            throw error;
        }
    };

    search = async (data) => {
        try {
            const treatment = await Database.getModel(TABLE_NAME).findAll({
                where: {
                    name: {
                        [Op.like]: `${data}%`,
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
            const treatment = await Database.getModel(TABLE_NAME).findOne({
                where: data
            });
            return treatment;
        } catch(error) {
            throw error;
        }
    };
}

export default new TreatmentService();
