import Database from "../../../libs/mysql";
import {Op} from "sequelize";
import {TABLE_NAME} from "../../models/similarFoodMapping";

const DEFAULT_ORDER = [["created_at", "DESC"]];

class SimilarFoodMappingService {
    constructor() {
    }

    getByData = async data => {
        try {
            const record = await Database.getModel(TABLE_NAME).findOne({
                where: data,
                raw: true
            });
            return record;
        } catch (error) {
            throw error;
        }
    };

    getAll = async () => {
        try {
            const records = await Database.getModel(TABLE_NAME).findAll(
                {
                    raw: true
                }
            );
            return records;
        } catch (error) {
            throw error;
        }
    };

    findAndCountAll = async ({where, order = DEFAULT_ORDER, attributes}) => {
        try {
            return await Database.getModel(TABLE_NAME).findAndCountAll({
                where,
                order,
                attributes,
                raw: true,
            });
        } catch (error) {
            throw error;
        }
    };
}

export default SimilarFoodMappingService;
