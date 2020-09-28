import {Op} from "sequelize";
import database from "../../../libs/mysql";

const {councils: Council} = database.models;

class CouncilService {

    getAll = async () => {
        try {
            const council = await Council.findAll();
            return council;
        } catch(error) {
            throw error;
        }
    };

    search = async (data) => {
        try {
            const council = await Council.findAll({
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
            const council = await Council.findOne({
                where: data
            });
            return council;
        } catch(error) {
            throw error;
        }
    };

    getCouncilByData = async data => {
        try {
            const council = await Council.findAll({
                where: data
            });
            return council;
        } catch(error) {
            throw error;
        }
    }
}

export default new CouncilService();
