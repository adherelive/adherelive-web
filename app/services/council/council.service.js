import {Op} from "sequelize";
import Database from "../../../libs/mysql";
import {TABLE_NAME} from "../../models/registrationCouncil";

class CouncilService {
    getAll = async () => {
        try {
            const council = await Database.getModel(TABLE_NAME).findAll();
            return council;
        } catch (error) {
            throw error;
        }
    };

    search = async (data) => {
        try {
            const council = await Database.getModel(TABLE_NAME).findAll({
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
            const council = await Database.getModel(TABLE_NAME).findOne({
                where: data
            });
            return council;
        } catch (error) {
            throw error;
        }
    };

    getCouncilByData = async data => {
        try {
            const council = await Database.getModel(TABLE_NAME).findAll({
                where: data
            });
            return council;
        } catch (error) {
            throw error;
        }
    }

    create = async data => {
        try {
            const council = await Database.getModel(TABLE_NAME).create(
                data
            );
            return council;
        } catch (error) {
            throw error;
        }
    };
}

export default new CouncilService();
