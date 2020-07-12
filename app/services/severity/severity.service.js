import Severity from "../../models/severity";

class SeverityService {

    getAll = async () => {
        try {
            const severity = await Severity.findAll();
            return severity;
        } catch(error) {
            throw error;
        }
    };

    getByData = async data => {
        try {
            const severity = await Severity.findOne({
                where: data
            });
            return severity;
        } catch(error) {
            throw error;
        }
    };
}

export default new SeverityService();
