import Database from "../../../libs/mysql";
import {TABLE_NAME} from "../../models/templateVitals";

export default class TemplateVitalService {
    getByData = async (data) => {
        try {
            return await Database.getModel(TABLE_NAME).findOne({
                where: data,
                raw: true
            });
        } catch (error) {
            throw error;
        }
    }

    deleteVital = async (data) => {
        try {
            return await Database.getModel(TABLE_NAME).destroy({
                where: data,
                include: []
            });
        } catch (error) {
            throw error;
        }
    };

    create = async (data) => {
        try {
            const templateVital = await Database.getModel(TABLE_NAME).create(data);
            return templateVital;
        } catch (error) {
            throw error;
        }
    };

    update = async (data, id) => {
        const transaction = await Database.initTransaction();
        try {
            const templateVital = await Database.getModel(TABLE_NAME).update(data, {
                where: {
                    id
                },
                transaction
            });
            await transaction.commit();
            return templateVital;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    };
}
