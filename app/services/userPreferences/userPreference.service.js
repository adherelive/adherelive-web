import database from "../../../libs/mysql";

const {user_preferences: UserPreference} = database.models;

class UserPreferenceService {
    constructor() {
    }

    addUserPreference = async data => {
        try {
            const userPreference = await UserPreference.create(data);
            return userPreference;
        } catch(error) {
            throw error;
        }
    };

    getPreferenceByData = async data => {
        try {
            const userPreference = await UserPreference.findOne({
                where: data
            });
            return userPreference;
        } catch(error) {
            throw error;
        }
    };

    updateUserPreferenceData = async (data, id) => {
        const transaction = await database.transaction();
        try {
            const userPreference = await UserPreference.update(data, {
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