import Database from "../../../libs/mysql";
import {TABLE_NAME} from "../../models/providers";

class ProviderService {
    getAll = async () => {
        try {
            const provider = await Database.getModel(TABLE_NAME).findAll();
            return provider;
        } catch(err) {
            throw err;
        }
    };

    getProviderByData = async (data) => {
        try {
            const provider = await Database.getModel(TABLE_NAME).findOne({
                where: data
            });
            return provider;
        } catch(err) {
            throw err;
        }
    };
}

export default new ProviderService();