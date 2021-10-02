import {Op} from "sequelize";
import Database from "../../../libs/mysql";
import {TABLE_NAME} from "../../models/careplanSecondaryDoctorMappings";
import {TABLE_NAME as careplanTableName} from "../../models/carePlan";
import {TABLE_NAME as userRolesTableName} from "../../models/userRoles";

const DEFAULT_ORDER = [["created_at", "DESC"]];

class CareplanSecondaryDoctorMappingsService {
    findAndCountAll = async ({where, order = DEFAULT_ORDER, attributes}) => {
        try {
            return await Database.getModel(TABLE_NAME).findAndCountAll({
                where,
                include: [
                    Database.getModel(careplanTableName),
                    Database.getModel(userRolesTableName),
                ],
                order,
                attributes,
                // raw: true
            });
        } catch (error) {
            throw error;
        }
    };

    getAllByData = async data => {
        try {
            const record = await Database.getModel(TABLE_NAME).findAll({
                where: data
            });
            return record;
        } catch (error) {
            throw error;
        }
    };

    getByData = async data => {
        try {
            const record = await Database.getModel(TABLE_NAME).findOne({
                where: data
            });
            return record;
        } catch (error) {
            throw error;
        }
    };

    create = async (data) => {
        const transaction = await Database.initTransaction();
        try {
            const createMapping = await Database.getModel(TABLE_NAME).create(data, {transaction});

            await transaction.commit();
            return createMapping;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    };

    delete = async (data) => {
        const transaction = await Database.initTransaction();
        try {
            await Database.getModel(TABLE_NAME).destroy({
                where: data
            }, {transaction});

            await transaction.commit();
            return true;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    };
}

export default new CareplanSecondaryDoctorMappingsService();
