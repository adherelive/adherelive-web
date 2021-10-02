import Database from "../../../libs/mysql";
import {TABLE_NAME} from "../../models/termsAndConditions";

class TermsAndConditionsService {
    create = async (data) => {
        try {
            const record = await Database.getModel(TABLE_NAME).create(data, {raw: true});
            return record;
        } catch (error) {
            throw error;
        }
    };

    getByData = async data => {
        try {
            const tac = await Database.getModel(TABLE_NAME).findOne({
                where: data
            });
            return tac;
        } catch (error) {
            throw error;
        }
    };
}

export default new TermsAndConditionsService();
