import Providers from "../../models/providers";

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