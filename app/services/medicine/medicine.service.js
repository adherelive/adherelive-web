import Medicine from "../../models/medicines";
import Sequelize from "sequelize";

const Op = Sequelize.Op;

class MedicineService {
  constructor() {}

  add = async (data) => {
    try {
      const medicine = await Medicine.create(data);
      return medicine;
    } catch(err) {
      throw err;
    }
  }

  search = async (data) => {
    try {
      const medicine = await Medicine.findAll({
        where: {
          name: {
            [Op.like]: `${data}%`,
          },
        },
      });
      return medicine;
    } catch (error) {
      throw error;
    }
  };

  getMedicineById = async (id) => {
    try {
      const medicine = await Medicine.findOne({
        where: {
          id
        }
      });
      return medicine;
    } catch(error) {
      throw error;
    }
  };

  getMedicineByData = async (data) => {
    try {
      const medicine = await Medicine.findAll({
        where: data
      });
      return medicine;
    } catch(error) {
      throw error;
    }
  };
}

export default new MedicineService();
