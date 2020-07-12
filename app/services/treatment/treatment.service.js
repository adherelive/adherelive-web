import Treatment from "../../models/treatments";

class TreatmentService {

    getAll = async () => {
        try {
            const treatment = await Treatment.findAll();
            return treatment;
        } catch(error) {
            throw error;
        }
    };

    getByData = async data => {
        try {
            const treatment = await Treatment.findOne({
                where: data
            });
            return treatment;
        } catch(error) {
            throw error;
        }
    };
}

export default new TreatmentService();
