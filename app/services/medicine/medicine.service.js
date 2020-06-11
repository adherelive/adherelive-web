import Medicine from "../../models/medicines";
import Sequelize from "sequelize";

const Op = Sequelize.Op;

class MedicineService {
  constructor() {}

  search = async (data) => {
    try {
      const medicine = await Medicine.findAll({
        where: {
          name: {
            [Op.like]: `%${data}%`,
          },
        },
      });
      return medicine;
    } catch (error) {
      throw error;
    }
  };
}

export default new MedicineService();
