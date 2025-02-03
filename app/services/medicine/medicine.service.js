import { Op } from "sequelize";
import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/medicines";

import { createLogger } from "../../../libs/log";
const log = createLogger("WEB > MEDICINE > SERVICE");

/**
 *
 *
 * @class MedicineService
 */
class MedicineService {
  constructor() {}

  /**
   *
   *
   * @param data
   * @returns {Promise<*>}
   */
  add = async (data) => {
    try {
      const medicine = await Database.getModel(TABLE_NAME).create(data);
      return medicine;
    } catch (err) {
      throw err;
    }
  };

  /**
   *
   *
   * @param data
   * @returns {Promise<Model[]>}
   */
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

  /**
   *
   *
   * @param data
   * @param offset
   * @param limit
   * @param public_medicine
   * @param doctorIds
   * @returns {Promise<Model[]>}
   */
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

      log.debug(
        "Data, Offset, Limit, Public Medicine, Doctor IDs, Medicine: ",
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

  /**
   *
   *
   * @param data
   * @param public_medicine
   * @param doctorIds
   * @returns {Promise<*>}
   */
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

  /**
   *
   *
   * @param id
   * @returns {Promise<*>}
   */
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

  /**
   *
   *
   * @param data
   * @returns {Promise<Model[]>}
   */
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

  /**
   *
   *
   * @returns {Promise<Model[]>}
   */
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

  /**
   *
   *
   * @param data
   * @param id
   * @returns {Promise<*>}
   */
  updateMedicine = async (data, id) => {
    log.debug("updateMedicine called-service");
    try {
      log.debug({ data, id });
      const transaction = await Database.initTransaction();
      const medicine = await Database.getModel(TABLE_NAME).update(data, {
        where: {
          id,
        },
        transaction,
      });
      log.debug("in service", { medicine });
      await transaction.commit();

      return medicine;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  };

  /**
   *
   *
   * @param id
   * @returns {Promise<*>}
   */
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

  /**
   *
   *
   * @param ids
   * @returns {Promise<Model[]>}
   */
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
