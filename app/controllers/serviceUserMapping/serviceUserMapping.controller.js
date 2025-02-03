import Controller from "../index";

import { createLogger } from "../../../libs/log";

// Services
import ServiceUserMappingService from "../../services/serviceUserMapping/serviceUserMapping.service";
import ServiceOffering from "../../services/serviceOffering/serviceOffering.service";
import { USER_CATEGORY, USER_STATUS } from "../../../constant";
import TxService from "../../services/serviceSubscribeTransaction/serviceSubscribeTransaction";

const log = createLogger("WEB > CONTROLLER > Service Offering");

class ServiceUserMappingController extends Controller {
  constructor() {
    super();
  }

  create = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    log.debug("service user mapping controller - create - called");

    const {
      userDetails: { userId, userData: { category } = {}, userCategoryId } = {},
      permissions = [],
    } = req;
    let doctor_id,
      provider_type,
      provider_id = null;
    let data = null;

    provider_type = req.userDetails.userRoleData.basic_info.linked_with;
    if (category === USER_CATEGORY.DOCTOR) {
      doctor_id = req.userDetails.userCategoryData.basic_info.id;
      provider_type = USER_CATEGORY.DOCTOR;
    }

    if (req.userDetails.userRoleData.basic_info.linked_with === "provider") {
      provider_id = req.userDetails.userRoleData.basic_info.linked_id;
      doctor_id = req.userDetails.userCategoryData.basic_info.id;
      provider_type = req.userDetails.userRoleData.basic_info.linked_with;
    }

    try {
      let date = new Date();
      let next_recharge_date = new Date();
      next_recharge_date.setMonth(next_recharge_date.getMonth() + 1);
      let expire_date = new Date();
      expire_date.setMonth(expire_date.getMonth() + req.body.durations);

      let userServices = {
        ...req.body,
        patient_status: USER_STATUS.INACTIVE,
        doctor_id,
        provider_type,
        provider_id,
        service_date: date,
        date,
        next_recharge_date,
        expire_date,
      };
      log.debug(
        "service user mapping controller - create - userServices",
        userServices
      );

      const serviceUserMappingService = new ServiceUserMappingService();
      userServices = await serviceUserMappingService.addServiceUserMapping(
        userServices
      );

      const txDetails = {
        doctor_id,
        provider_type,
        provider_id,
        patient_id: req.body.patient_id,
        service_user_plan_id: userServices.id,
        amount: req.body.service_charge,
        patient_status: USER_STATUS.INACTIVE,
        due_date: new Date(),
        // subscription_plan_id: userServicesSubscription.id
      };

      let txres = await TxService.addServiceSubscriptionTx(txDetails);
      return raiseSuccess(
        res,
        200,
        { userServices },
        "Service added successfully"
      );
    } catch (error) {
      log.debug("Service User Mapping 500 error: ", error);
      return raiseServerError(res);
    }
  };

  getServiceUserMappingByData = async (req, res) => {
    let { params: { patient_id } = {}, body } = req;
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      if (!patient_id)
        return raiseClientError(
          res,
          422,
          {},
          "Please select correct ServiceOffer to update"
        );

      let data = { patient_id };
      const serviceuserMappingServices = new ServiceUserMappingService();
      let userServices =
        await serviceuserMappingServices.getAllServiceUserMappingByData(data);

      let serviceDatas = [];
      for (let userService in userServices) {
        let serviceData = userServices[userService];
        const serviceOffering = new ServiceOffering();
        let servicedata = { id: serviceData.service_plan_id };
        let services = await serviceOffering.getServiceOfferingByData(
          servicedata
        );
        serviceData.serviceDetails = { ...services };
        serviceDatas.push(serviceData);
      }

      return raiseSuccess(
        res,
        200,
        {
          ...serviceDatas,
        },
        "success"
      );
    } catch (error) {
      log.debug("getServiceUserMappingByData 500 error: ", error);
      return raiseServerError(res);
    }
  };

  updateServiceUserMapping = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      let { params: { id } = {}, body } = req;
      log.debug(`Report id = ${id}`);
      if (!id) {
        return raiseClientError(
          res,
          422,
          {},
          "Please select correct ServiceOffer to update"
        );
      }

      const serviceUserMappingService = new ServiceUserMappingService();
      let serviceSubscription =
        await serviceUserMappingService.updateServiceUserMapping(body, id);
      return raiseSuccess(
        res,
        200,
        {
          ...serviceSubscription,
        },
        "Service updated successfully"
      );
    } catch (error) {
      log.debug("updateServiceUserMapping 500 error: ", error);
      return raiseServerError(res);
    }
  };
}

export default new ServiceUserMappingController();
