import Controller from "../index";
import Logger from "../../../libs/log";

// HELPERS
import * as PaymentHelper from "./helper";

// SERVICES...
import PaymentProductService from "../../services/paymentProducts/paymentProduct.service";
import userRolesService from "../../services/userRoles/userRoles.service";
import doctorService from "../../services/doctor/doctor.service"

// WRAPPERS...
import PaymentProductWrapper from "../../ApiWrapper/web/paymentProducts";
import { USER_CATEGORY } from "../../../constant";

const Log = new Logger("WEB > CONTROLLER > PAYMENTS");

class PaymentController extends Controller {
  constructor() {
    super();
  }

  addDoctorPaymentProduct = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const {
        body,
        userDetails: { userCategoryId, userRoleId, userData: { category = "" } = {} } = {}
      } = req;

      let doctorRoleId = userRoleId;

      const { doctor_id = null , for_user_type = USER_CATEGORY.DOCTOR } = body || {};

      if (doctor_id) {
        if (category !== USER_CATEGORY.PROVIDER) {
          return raiseClientError(res, 401, {}, "UNAUTHORIZED");
        }

        const doctor = await doctorService.findOne({where: {id: doctor_id}, attributes: ["user_id"]}) || null;
        const {user_id: doctorUserId = null} = doctor || {};
        const userRole = await userRolesService.findOne({where: {
          user_identity: doctorUserId,
          linked_id: userCategoryId,
          linked_with: USER_CATEGORY.PROVIDER
         },
         attributes: ["id"]
       }) || null;

        if (!userRole) {
        return raiseClientError(res, 401, {}, "UNAUTHORIZED");
        }
        const {id: doctor_role_id = null} = userRole || {};
        doctorRoleId = doctor_role_id;
      }

      const dataToAdd = PaymentHelper.getFormattedData(body);
      const paymentProductService = new PaymentProductService();

      const { id = null, ...rest } = dataToAdd || {};

      let paymentProduct = null;

      if (id) {
        // update
        const updatePaymentProductData = await paymentProductService.updateDoctorProduct(
          {
            ...rest
          },
          id
        );

        paymentProduct = await PaymentProductWrapper({
          id
        });
      } else {
        const paymentProductData = await paymentProductService.addDoctorProduct(
          {
            ...dataToAdd,
            creator_role_id: userRoleId,
            creator_type: category,
            for_user_role_id: doctorRoleId,
            for_user_type: doctor_id ? for_user_type : category ,
            product_user_type: "patient" // todo: change to constant in model
          }
        );

        if (paymentProductData) {
          paymentProduct = await PaymentProductWrapper({
            data: paymentProductData
          });
        }
      }

      if (paymentProduct) {
        let paymentProducts = {};
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
      const { body } = req;

      const {id} = body || {};

      const paymentProductService = new PaymentProductService();
      const deletedDoctorProduct = await paymentProductService.deleteDoctorProduct(
        {
          id: id
        }
      );
      return raiseSuccess(res, 200, {}, "doctor product record destroyed");
    } catch (error) {
      Log.debug("83901283091298 delete doctor product error", error);
      return raiseServerError(res);
    }
  };

  getAllDoctorPaymentProduct = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const {
        userDetails: {
          userCategoryId,
          userRoleId,
          userData: { category = "" } = {}
        } = {},
        query: { doctor_id = null } = {}
      } = req;

      let doctorRoleId = userRoleId;

      if (doctor_id) {
        if (category !== USER_CATEGORY.PROVIDER) {
          return raiseClientError(res, 401, {}, "UNAUTHORIZED");
        }

        const doctor = await doctorService.findOne({where: {id: doctor_id}, attributes: ["user_id"]}) || null;
        const {user_id: doctorUserId = null} = doctor || {};
        const userRole = await userRolesService.findOne({where: {
          user_identity: doctorUserId,
          linked_id: userCategoryId,
          linked_with: USER_CATEGORY.PROVIDER
         },
         attributes: ["id"]
       }) || null;

        if (!userRole) {
        return raiseClientError(res, 401, {}, "UNAUTHORIZED");
        }
        const {id: doctor_role_id = null} = userRole || {};
        doctorRoleId = doctor_role_id;
      }

      if (category === USER_CATEGORY.PROVIDER && !doctor_id) {
        return raiseClientError(res, 402, {}, "Invalid doctor");
      }

      const paymentProductService = new PaymentProductService();
      const doctorPaymentProductData = await paymentProductService.getAllCreatorTypeProducts(
        {
          for_user_type: [USER_CATEGORY.DOCTOR,USER_CATEGORY.HSP],
          for_user_role_id: doctorRoleId,
          product_user_type: "patient"
        }
      ) || [];

      let paymentProductData = [...doctorPaymentProductData];

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
