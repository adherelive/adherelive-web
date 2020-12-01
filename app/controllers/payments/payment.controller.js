import Controller from "../index";
import Logger from "../../../libs/log";

// HELPERS
import * as PaymentHelper from "./helper";

// SERVICES...
import PaymentProductService from "../../services/paymentProducts/paymentProduct.service";
import doctorProviderMappingService from "../../services/doctorProviderMapping/doctorProviderMapping.service";

// WRAPPERS...
import PaymentProductWrapper from "../../ApiWrapper/web/paymentProducts";
import DoctorProviderMappingWrapper from "../../ApiWrapper/web/doctorProviderMapping";
import { USER_CATEGORY } from "../../../constant";

const Log = new Logger("WEB > CONTROLLER > PAYMENTS");

class PaymentController extends Controller {
  constructor() {
    super();
  }

  addDoctorPaymentProduct = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { body, userDetails: { userCategoryId } = {} } = req;

      const dataToAdd = PaymentHelper.getFormattedData(body);

      const paymentProductService = new PaymentProductService();
      const paymentProductData = await paymentProductService.addDoctorProduct({
        ...dataToAdd,
        creator_id: userCategoryId,
        creator_type: USER_CATEGORY.DOCTOR,
        product_user_type: "patient" // todo: change to constant in model
      });

      if (paymentProductData) {
        let paymentProducts = {};

        const paymentProduct = await PaymentProductWrapper({
          data: paymentProductData
        });
        paymentProducts[paymentProduct.getId()] = paymentProduct.getBasicInfo();

        return raiseSuccess(
          res,
          200,
          {
            payment_products: {
              ...paymentProducts
            }
          },
          "Consultation Product added successfully"
        );
      } else {
        return raiseClientError(
          res,
          201,
          {},
          "Please check details given for the consultation product"
        );
      }
    } catch (error) {
      Log.debug("getAllAdminPaymentProduct 500 error", error);
      return raiseServerError(res);
    }
  };

  removeDoctorPaymentProduct = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { body, userDetails: { userCategoryId } = {} } = req;

      const { id, name, type, amount } = req.body;

      const paymentProductService = new PaymentProductService();
      const deletedDoctorProduct = await paymentProductService.deleteDoctorProduct(
        {
          id: id,
          name: name,
          type: type,
          amount: amount
        }
      );

      // let doctorData = {};

      return raiseSuccess(res, 200, {}, "doctor product record destroyed");
    } catch (error) {
      Log.debug("83901283091298 delete doctor product error", error);
      return raiseServerError(res);
    }
  };

  getAllDoctorPaymentProduct = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { userDetails: { userCategoryId } = {} } = req;

      const paymentProductService = new PaymentProductService();
      const doctorPaymentProductData = await paymentProductService.getAllCreatorTypeProducts(
        {
          creator_type: USER_CATEGORY.DOCTOR,
          creator_id: userCategoryId,
          product_user_type: "patient"
        }
      );

      const doctorProvider = await doctorProviderMappingService.getProviderForDoctor(
        userCategoryId
      );
      const doctorProviderWrapper = await DoctorProviderMappingWrapper(
        doctorProvider
      );
      const providerId = doctorProviderWrapper.getProviderId();

      const providerPaymentProductData = await paymentProductService.getAllCreatorTypeProducts(
        {
          creator_type: USER_CATEGORY.PROVIDER,
          creator_id: providerId,
          product_user_type: "patient"
        }
      );

      const paymentProductData = [
        ...providerPaymentProductData,
        ...doctorPaymentProductData
      ];

      if (paymentProductData.length > 0) {
        let paymentProducts = {};

        for (let i = 0; i < paymentProductData.length; i++) {
          const paymentProduct = await PaymentProductWrapper({
            data: paymentProductData[i]
          });
          paymentProducts[
            paymentProduct.getId()
          ] = paymentProduct.getBasicInfo();
        }

        return raiseSuccess(
          res,
          200,
          {
            payment_products: {
              ...paymentProducts
            }
          },
          "Default consultation products fetched successfully"
        );
      } else {
        return raiseClientError(
          res,
          201,
          {},
          "No consultation products listed yet. Try again later"
        );
      }
    } catch (error) {
      Log.debug("getAllDoctorPaymentProduct 500 error", error);
      return raiseServerError(res);
    }
  };

  getAllAdminPaymentProduct = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const paymentProductService = new PaymentProductService();
      const paymentProductData = await paymentProductService.getAllCreatorTypeProducts(
        { creator_type: USER_CATEGORY.ADMIN }
      );

      if (paymentProductData.length > 0) {
        let paymentProducts = {};

        for (let i = 0; i < paymentProductData.length; i++) {
          const paymentProduct = await PaymentProductWrapper({
            data: paymentProductData[i]
          });
          paymentProducts[
            paymentProduct.getId()
          ] = paymentProduct.getBasicInfo();
        }

        return raiseSuccess(
          res,
          200,
          {
            payment_products: {
              ...paymentProducts
            }
          },
          "Default consultation products fetched successfully"
        );
      } else {
        return raiseClientError(
          res,
          201,
          {},
          "No consultation products listed yet. Try again later"
        );
      }
    } catch (error) {
      Log.debug("getAllAdminPaymentProduct 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new PaymentController();
