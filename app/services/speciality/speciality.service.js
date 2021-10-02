import {Op} from "sequelize";
import Database from "../../../libs/mysql";
import {TABLE_NAME} from "../../models/specialities";

class SpecialityService {
    getAll = async () => {
        try {
            const specialities = await Database.getModel(TABLE_NAME).findAll();
            return specialities;
        } catch (error) {
            throw error;
        }
    };

    getSpecialityByData = async (data) => {
        try {
            const speciality = await Database.getModel(TABLE_NAME).findOne({
                where: data
            });
            return speciality;
        } catch (err) {
            throw err;
        }
    };

    search = async (data) => {
        try {
            const speciality = await Database.getModel(TABLE_NAME).findAll({
                where: {
                    name: {
                        [Op.like]: `${data}%`,
                    },
                },
            });
            return speciality;
        } catch (error) {
            throw error;
        }
    };

    create = async data => {
        try {
            const speciality = await Database.getModel(TABLE_NAME).create(
                data
            );
            return speciality;
        } catch (error) {
            throw error;
        }
    };
}

export default new SpecialityService();
