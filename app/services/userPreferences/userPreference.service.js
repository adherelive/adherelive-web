import Database from "../../../libs/mysql";
import {TABLE_NAME} from "../../models/userPreferences";

class UserPreferenceService {
    constructor() {
    }

    addUserPreference = async data => {
        try {
            const userPreference = await Database.getModel(TABLE_NAME).create(data);
            return userPreference;
        } catch(error) {
            throw error;
        }
    };

    getPreferenceByData = async data => {
        try {
            const userPreference = await Database.getModel(TABLE_NAME).findOne({
                where: data
            });
            return userPreference;
        } catch(error) {
            throw error;
        }
    };

    updateUserPreferenceData = async (data, id) => {
        const transaction = await Database.initTransaction();
        try {
            const userPreference = await Database.getModel(TABLE_NAME).update(data, {
                where: {
                    id
                },
                transaction
            });
            await transaction.commit();
            return userPreference;
        } catch(error) {
            await transaction.rollback();
            throw error;
        }
    };
}

export default new UserPreferenceService();