import {Op} from "sequelize";
import database from "../../../libs/mysql";

const {specialities: Specialities} = database.models;

class SpecialityService {
    getSpecialityByData = async (data) => {
      try {
          const speciality = await Specialities.findOne({
              where: data
          });
          return speciality;
      } catch(err) {
          throw err;
      }
    };

    search = async (data) => {
        try {
            const speciality = await Specialities.findAll({
                where: {
                    name: {
                        [Op.like]: `${data}%`,
                    },
                },
            });
            return speciality;
        } catch (error) {
            throw error;
        }
    };

}

export default new SpecialityService();