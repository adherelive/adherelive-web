import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/paymentProducts";
import { USER_CATEGORY } from "../../../constant";
import Log from "../../../libs/log";

const Logger = new Log("WEB > PAYMENT_PRODUCTS > SERVICES");

export default class PaymentProductService {
  getByData = async data => {
    try {
      const paymentProducts = await Database.getModel(TABLE_NAME).findOne({
        where: data,
        raw: true,
      });
      return paymentProducts;
    } catch (error) {
      throw error;
    }
  };

  getAllCreatorTypeProducts = async (data) => {
    try {
      const paymentProducts = await Database.getModel(TABLE_NAME).findAll({
        where: data,
        raw: true
      });
      return paymentProducts;
    } catch (error) {
      throw error;
    }
  };

  addDoctorProduct = async data => {
    try {
      const paymentProduct = await Database.getModel(TABLE_NAME).create(data, {
        raw: true
      });
      return paymentProduct;
    } catch (error) {
      throw error;
    }
  };

  updateDoctorProduct = async (data, id) => {
    const transaction = await Database.initTransaction();
    try {
      const paymentProduct = await Database.getModel(TABLE_NAME).update(data, {
        where: {
          id
        },
        transaction
      });
      await transaction.commit();
      return paymentProduct;
    } catch (error) {
      transaction.rollback();
      throw error;
    }
  };

  deleteDoctorProduct = async ({
    id = null
  }) => {
    try {
      const deletedDoctorProduct = await Database.getModel(TABLE_NAME).destroy({
        where: {
          id
        }
      });
      //   Logger.debug("7657890765",deletedDoctorProduct);
      return deletedDoctorProduct;
    } catch (error) {
      throw error;
    }
  };
  //   Logger.debug("7657890765",deletedDoctorProduct);

  deleteDoctorProductById = async id => {
    try {
      const deletedDoctorProduct = await Database.getModel(TABLE_NAME).destroy({
        where: {
          id
        }
      });
      return deletedDoctorProduct;
    } catch (error) {
      throw error;
    }
  };


  getAll = async () => {
    try {
      return await Database.getModel(TABLE_NAME).findAll();
    } catch (error) {
      throw error;
    }
  };
}
