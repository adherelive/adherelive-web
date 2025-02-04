import Controller from "../../index";
import { createLogger } from "../../../../libs/logger";
import { USER_CATEGORY } from "../../../../constant";

// HELPERS
import * as PaymentHelper from "./payments.helper";

// Services
import PaymentProductService from "../../../services/paymentProducts/paymentProduct.service";

// Wrappers
import PaymentProductWrapper from "../../../apiWrapper/mobile/paymentProducts";

const logger = createLogger("MOBILE > CONTROLLER > PAYMENTS");

class PaymentController extends Controller {
  constructor() {
    super();
  }

  addDoctorPaymentProduct = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      /*
       * Data needed as:
       *
       * {id, name, type, amount} // existing
       * {name, type, amount} || new
       *
       *
       * */
      const { body, userDetails: { userData: { category }, userRoleId } = {} } =
        req;
      const { for_user_type = USER_CATEGORY.DOCTOR } = body;
      const dataToAdd = PaymentHelper.getFormattedData(body);
      const paymentProductService = new PaymentProductService();

      let paymentProducts = {};

      // for user type in provider
      let doctorUserRoleId = userRoleId;

      for (let i = 0; i < dataToAdd.length; i++) {
        const { id = null, ...rest } = dataToAdd[i] || {};

        if (id) {
          // update
          const paymentProductData =
            await paymentProductService.updateDoctorProduct(
              {
                ...rest,
              },
              id
            );

          const paymentProduct = await PaymentProductWrapper({
            id,
          });
          paymentProducts[paymentProduct.getId()] =
            paymentProduct.getBasicInfo();
        } else {
          // add
          const paymentProductData =
            await paymentProductService.addDoctorProduct({
              ...rest,
              creator_role_id: userRoleId,
              creator_type: category,
              for_user_role_id: doctorUserRoleId,
              for_user_type: category,
              product_user_type: "patient", // todo: change to constant in model
            });

          const paymentProduct = await PaymentProductWrapper({
            data: paymentProductData,
          });
          paymentProducts[paymentProduct.getId()] =
            paymentProduct.getBasicInfo();
        }
      }

      return raiseSuccess(
        res,
        200,
        {
          payment_products: {
            ...paymentProducts,
          },
        },
        "Consultation Product added successfully"
      );
    } catch (error) {
      logger.error("getAllAdminPaymentProduct 500 error", error);
      return raiseServerError(res);
    }
  };

  getAllDoctorPaymentProduct = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { userDetails: { userRoleId } = {} } = req;

      const paymentProductService = new PaymentProductService();
      const doctorPaymentProductData =
        await paymentProductService.getAllCreatorTypeProducts({
          for_user_type: [USER_CATEGORY.DOCTOR, USER_CATEGORY.HSP],
          for_user_role_id: userRoleId,
          product_user_type: "patient",
        });

      let paymentProductData = [...doctorPaymentProductData];

      if (paymentProductData.length > 0) {
        let paymentProducts = {};

        for (let i = 0; i < paymentProductData.length; i++) {
          const paymentProduct = await PaymentProductWrapper({
            data: paymentProductData[i],
          });
          paymentProducts[paymentProduct.getId()] =
            paymentProduct.getBasicInfo();
        }

        return raiseSuccess(
          res,
          200,
          {
            payment_products: {
              ...paymentProducts,
            },
          },
          "Default consultation products fetched successfully"
        );
      } else {
        return raiseSuccess(
          res,
          201,
          {},
          "No consultation products listed yet. Try again later"
        );
      }
    } catch (error) {
      logger.error("getAllAdminPaymentProduct 500 error", error);
      return raiseServerError(res);
    }
  };

  getAllAdminPaymentProduct = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const paymentProductService = new PaymentProductService();
      const paymentProductData =
        await paymentProductService.getAllCreatorTypeProducts({
          creator_type: USER_CATEGORY.ADMIN,
        });

      if (paymentProductData.length > 0) {
        let paymentProducts = {};

        for (let i = 0; i < paymentProductData.length; i++) {
          const paymentProduct = await PaymentProductWrapper({
            data: paymentProductData[i],
          });
          paymentProducts[paymentProduct.getId()] =
            paymentProduct.getBasicInfo();
        }

        return raiseSuccess(
          res,
          200,
          {
            payment_products: {
              ...paymentProducts,
            },
          },
          "Default consultation products fetched successfully"
        );
      } else {
        return raiseSuccess(
          res,
          201,
          {},
          "No consultation products listed yet. Try again later"
        );
      }
    } catch (error) {
      logger.error("getAllAdminPaymentProduct 500 error", error);
      return raiseServerError(res);
    }
  };

  deleteDoctorPaymentProduct = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { params: { id = 0 } = {} } = req;

      const paymentProductService = new PaymentProductService();
      const paymentProductData =
        await paymentProductService.deleteDoctorProductById(id);

      return raiseSuccess(
        res,
        200,
        {},
        "Consultation Product deleted successfully"
      );
    } catch (error) {
      logger.error("deleteDoctorPaymentProduct 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new PaymentController();
