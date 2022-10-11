import { Op } from "sequelize";
import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/medicines";

class MedicineService {
  constructor() {}

  add = async (data) => {
    try {
      const medicine = await Database.getModel(TABLE_NAME).create(data);
      return medicine;
    } catch (err) {
      throw err;
    }
  };

  search = async (data) => {
    try {
      const medicine = await Database.getModel(TABLE_NAME).findAll({
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

  searchMedicineForAdmin = async (
    data,
    offset,
    limit,
    public_medicine,
    doctorIds
  ) => {
    try {
      let medicine = null;
      medicine = await Database.getModel(TABLE_NAME).findAll({
        offset,
        limit,
        where: {
          public_medicine,

          [Op.or]: {
            name: {
              [Op.like]: `%${data}%`,
            },
            creator_id: {
              [Op.in]: doctorIds,
            },
          },
        },
        order: [["updated_at", "DESC"]],
      });

      console.log(
        "329847562389462364872384122 ************************************8******8888",
        {
          data,
          offset,
          limit,
          public_medicine,
          doctorIds,
          medicine,
        }
      );
      return medicine;
    } catch (error) {
      throw error;
    }
  };

  getMedicineCountForAdmin = async (data, public_medicine, doctorIds) => {
    try {
      let count = 0;
      if (!public_medicine && doctorIds && doctorIds.length) {
        count = await Database.getModel(TABLE_NAME).count({
          where: {
            [Op.and]: [
              { public_medicine },
              {
                [Op.or]: {
                  name: {
                    [Op.like]: `%${data}%`,
                  },
                  creator_id: {
                    [Op.in]: doctorIds,
                  },
                },
              },
            ],
          },
        });
      } else {
        count = await Database.getModel(TABLE_NAME).count({
          where: {
            name: {
              [Op.like]: `%${data}%`,
            },
            public_medicine,
          },
        });
      }

      return count;
    } catch (error) {
      throw error;
    }
  };

  getMedicineById = async (id) => {
    try {
      const medicine = await Database.getModel(TABLE_NAME).findOne({
        where: {
          id,
        },
      });
      return medicine;
    } catch (error) {
      throw error;
    }
  };

  getMedicineByData = async (data) => {
    try {
      const medicine = await Database.getModel(TABLE_NAME).findAll({
        where: data,
      });
      return medicine;
    } catch (error) {
      throw error;
    }
  };

  getAllMedicines = async () => {
    try {
      const medicine = await Database.getModel(TABLE_NAME).findAll({
        raw: true,
      });
      return medicine;
    } catch (error) {
      throw error;
    }
  };

  updateMedicine = async (data, id) => {
    try {
      const medicine = await Database.getModel(TABLE_NAME).update(data, {
        where: {
          id,
        },
      });
      return medicine;
    } catch (err) {
      throw err;
    }
  };

  deleteMedicine = async (id) => {
    try {
      const medicine = await Database.getModel(TABLE_NAME).destroy({
        where: {
          id,
        },
      });
      return medicine;
    } catch (err) {
      throw err;
    }
  };

  getMedicineByIds = async (ids) => {
    try {
      let medicine = null;
      medicine = await Database.getModel(TABLE_NAME).findAll({
        where: {
          id: {
            [Op.in]: ids,
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
