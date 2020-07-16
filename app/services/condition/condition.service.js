import Condition from "../../models/conditions";

class ConditionService {

    getAll = async () => {
      try {
          const condition = await Condition.findAll();
          return condition;
      } catch(error) {
          throw error;
      }
    };

    getByData = async data => {
        try {
            const condition = await Condition.findOne({
                where: data
            });
            return condition;
        } catch(error) {
            throw error;
        }
    };
}

export default new ConditionService();
