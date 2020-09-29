import {Op} from "sequelize";
import database from "../../../libs/mysql";

const {conditions: Condition} = database.models;

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
