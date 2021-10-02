import Database from "../../../libs/mysql";
import {TABLE_NAME} from "../../models/exerciseRepetition";

export default class RepetitionService {
    findAndCountAll = async () => {
        try {
            return await Database.getModel(TABLE_NAME).findAndCountAll();
        } catch (error) {
            throw error;
        }
    };

    getByData = async data => {
        try {
            const repetition = await Database.getModel(TABLE_NAME).findOne({
                where: data
            });
            return repetition;
        } catch (error) {
            throw error;
        }
    };

    getAll = async () => {
        try {
            const repetitions = await Database.getModel(TABLE_NAME).findAll();
            return repetitions;
        } catch (error) {
            throw error;
        }
    };

    search = async (data) => {
        try {
            const repetitions = await Database.getModel(TABLE_NAME).findAll({
                where: {
                    type: {
                        [Op.like]: `%${data}%`,
                    },
                },
            });
            return repetitions;
        } catch (error) {
            throw error;
        }
    };
}
