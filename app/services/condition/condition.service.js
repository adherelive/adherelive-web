import Condition from "../../models/conditions";
import Sequelize from "sequelize";

const Op = Sequelize.Op;

class ConditionService {

    getAll = async () => {
      try {
          const condition = await Condition.findAll();
          return condition;
      } catch(error) {
          throw error;
      }
    };

    search = async (data) => {
        try {
            const condition = await Condition.findAll({
                where: {
                    name: {
                        [Op.like]: `${data}%`,
                    },
                },
            });
            return condition;
        } catch (error) {
            throw error;
        }
    };

    getAllByData = async data => {
        try {
            const condition = await Condition.findAll({
                where: data
            });
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
