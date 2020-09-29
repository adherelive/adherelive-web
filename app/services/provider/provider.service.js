import database from "../../../libs/mysql";

const {providers: Providers} = database.models;

class ProviderService {
    getAll = async () => {
        try {
            const provider = await Providers.findAll();
            return provider;
        } catch(err) {
            throw err;
        }
    };

    getProviderByData = async (data) => {
        try {
            const provider = await Providers.findOne({
                where: data
            });
            return provider;
        } catch(err) {
            throw err;
        }
    };
}

export default new ProviderService();