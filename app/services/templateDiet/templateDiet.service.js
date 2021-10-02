import Database from "../../../libs/mysql";
import {TABLE_NAME} from "../../models/templateDiets";

export default class TemplateDietService {
    create = async (data) => {
        const transaction = await Database.initTransaction();
        try {
            const templateDiet = await Database.getModel(TABLE_NAME).create(data, {transaction});

            await transaction.commit();
            return templateDiet;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    };

    update = async (data, id) => {
        const transaction = await Database.initTransaction();
        try {
            const updateTemplateDiet = await Database.getModel(TABLE_NAME).update(data, {where: {id}, transaction});
            await transaction.commit();
            return updateTemplateDiet;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    };

    delete = async (data) => {
        const transaction = await Database.initTransaction();
        try {
            const deletedTemplateDiet = await Database.getModel(TABLE_NAME).destroy({
                where: data,
                transaction
            });
            await transaction.commit();
            return deletedTemplateDiet;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    };

    findOne = async ({data}) => {
        try {
            return await Database.getModel(TABLE_NAME).findOne({
                where: data,
                raw: true,
            });
        } catch (error) {
            throw error;
        }
    };
}
