import CarePlan from "../../models/carePlan";

class CarePlanService {

    getCarePlanByData = async (data) => {
        try {
            console.log("careplan data --> ", data);
            const carePlan = await CarePlan.findAll({
                where: data
            });
            return carePlan;
        } catch(error) {
            throw error;
        }
    };
}

export default new CarePlanService();