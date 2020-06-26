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

    getCarePlanById = async (id) => {
        try {
            console.log("careplan data --> ", id);
            const carePlan = await CarePlan.findOne({
                where: {id}
            });
            return carePlan;
        } catch(error) {
            throw error;
        }
    };

    getSingleCarePlanByData = async (data) => {
        try {
            console.log("careplan data --> ", data);
            const carePlan = await CarePlan.findOne({
                where: data
            });
            return carePlan;
        } catch(error) {
            throw error;
        }
    };

    

    updateCarePlan = async (data, id) => {
        try {
            const carePlan = await CarePlan.update(data, {
                where: {
                    id
                }
            });
            return carePlan;
        } catch (error) {
            throw error;
        }
    };

    addCarePlan = async data => {
        try {
            const carePlan = await CarePlan.create(data);
            return carePlan;
        } catch(error) {
            throw error;
        }
      };
}

export default new CarePlanService();