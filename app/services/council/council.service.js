import Council from "../../models/registrationCouncil";

class CouncilService {

    getAll = async () => {
        try {
            const council = await Council.findAll();
            return council;
        } catch(error) {
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
}

export default new CouncilService();
