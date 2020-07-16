import College from "../../models/college";

class CollegeService {

    getAll = async () => {
        try {
            const college = await College.findAll();
            return college;
        } catch(error) {
            throw error;
        }
    };

    getByData = async data => {
        try {
            const college = await College.findOne({
                where: data
            });
            return college;
        } catch(error) {
            throw error;
        }
    };
}

export default new CollegeService();
