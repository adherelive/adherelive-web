import Controller from "../index";
import Logger from "../../../libs/log";
// services
import ServiceSubscriptionUserMappingService from "../../services/serviceSubscriptionUserMapping/serviceSubscriptionUserMapping.service";
import ServiceUserMappingService from "../../services/serviceUserMapping/serviceUserMapping.service";
import ServiceSubscriptionService from "../../services/serviceSubscription/serviceSubscription.service";
import ServiceSubscriptionMapping from "../../services/serviceSubscriptionMapping/serviceSubscritpionMapping.service";
import ServiceOffering from "../../services/serviceOffering/serviceOffering.service";
import TxService from "../../services/serviceSubscribeTranaction/serviceSubscribeTranaction";
import { USER_CATEGORY, USER_STATUS } from "../../../constant";

const Log = new Logger("WEB > CONTROLLER > Service Offering");

class ServiceSubscriptionUserMappingController extends Controller {
  constructor() {
    super();
  }
  create = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    Log.debug("service user mapping controller - create - called");

    const {
      userDetails: { userId, userData: { category } = {}, userCategoryId } = {},
      permissions = [],
    } = req;
    let doctor_id,
      provider_type,
      provider_id = null;
    let data = null;

    if (category === USER_CATEGORY.DOCTOR) {
      doctor_id = req.userDetails.userCategoryData.basic_info.id;
      provider_type = USER_CATEGORY.DOCTOR;
    }

    if (req.userDetails.userRoleData.basic_info.linked_with === "provider") {
      provider_id = req.userDetails.userRoleData.basic_info.linked_id;
      doctor_id = req.userDetails.userCategoryData.basic_info.id;
      provider_type = req.userDetails.userRoleData.basic_info.linked_with;
    }

    Log.debug("service user mapping controller - create - called");
    try {
      let date = new Date();
      let next_recharge_date = new Date();
      next_recharge_date.setMonth(next_recharge_date.getMonth() + 1);
      let expire_date = new Date();
      expire_date.setMonth(expire_date.getMonth() + req.body.durations);
      let userServicesSubscription = {
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
      Log.debug(
        "service user mapping controller - create - userServices",
        userServicesSubscription
      );
      console.log("userServicesSubscription", userServicesSubscription);
      const serviceSubscriptionUserMappingService =
        new ServiceSubscriptionUserMappingService();
      userServicesSubscription =
        await serviceSubscriptionUserMappingService.addServiceSubscriptionUserMapping(
          userServicesSubscription
        );

      console.log("=1=1=1=1=1==1=1=1=1=1=1=1=1=1=1=1=1=1==1");
      console.log(userServicesSubscription.id);
      console.log("=1=1=1=1=1==1=1=1=1=1=1=1=1=1=1=1=1=1==1");

      // tx create
      const txDetails = {
        doctor_id,
        provider_type,
        provider_id,
        patient_id: req.body.patient_id,
        subscription_user_plan_id: userServicesSubscription.id,
        amount: req.body.service_charge,
        patient_status: USER_STATUS.INACTIVE,
        due_date: new Date(),
        // subscription_plan_id: userServicesSubscription.id
      };
      console.log("====================================================");
      console.log({ txDetails });
      let txres = await TxService.addServiceSubscriptionTx(txDetails);
      console.log({ txres });
      console.log("====================================================");
      return raiseSuccess(
        res,
        200,
        { userServicesSubscription },
        "Service added successfully"
      );
    } catch (error) {
      Log.debug("addService 500 error", error);
      return raiseServerError(res);
    }
  };

  getServiceSubscriptionUserMappingByPatientId = async (req, res) => {
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
      const serviceSubscriptionUserMappingService =
        new ServiceSubscriptionUserMappingService();
      let userServicesSubscriptions =
        await serviceSubscriptionUserMappingService.getAllServiceSubscriptionUserMappingByData(
          data
        );
      let response = {};
      let serviceSubscriptionsData = [];
      console.log("userServicesSubscriptions", userServicesSubscriptions);
      for (let userServicesSubscription in userServicesSubscriptions) {
        let subId =
          userServicesSubscriptions[userServicesSubscription][
            "service_subscription_plan_id"
          ];
        let data = { id: subId };
        let serviceSubscriptionService = new ServiceSubscriptionService();

        let serviceSubecription =
          await serviceSubscriptionService.getServiceSubscriptionByData(data);

        console.log({ data, subId, serviceSubecription });

        const serviceSubscriptionMapping = new ServiceSubscriptionMapping();
        let servicedata = { subscription_plan_id: subId };
        console.log(servicedata);
        let services =
          await serviceSubscriptionMapping.getAllServiceSubscriptionMappingByData(
            servicedata
          );
        serviceSubecription.services = services;

        response[subId] = { ...serviceSubecription };
      }

      console.log(response);

      console.log("userServices", userServicesSubscriptions);
      return raiseSuccess(
        res,
        200,
        {
          ...response,
        },
        "success"
      );
    } catch (error) {
      Log.debug("updateService 500 error", error);
      return raiseServerError(res);
    }
  };

  getServiceSubscriptionUserMappingAndServiceUserByPatientId = async (
    req,
    res
  ) => {
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
    } catch (error) {
      Log.debug("updateService 500 error", error);
      return raiseServerError(res);
    }

    let data = { patient_id };
    const serviceSubscriptionUserMappingService =
      new ServiceSubscriptionUserMappingService();
    let userServicesSubscriptions =
      await serviceSubscriptionUserMappingService.getAllServiceSubscriptionUserMappingByData(
        data
      );
    let response = {};

    console.log("userServicesSubscriptions", userServicesSubscriptions);
    for (let userServicesSubscription in userServicesSubscriptions) {
      let subId =
        userServicesSubscriptions[userServicesSubscription][
          "service_subscription_plan_id"
        ];

      let data = { id: subId };
      console.log("data", data);
      let serviceSubscriptionService = new ServiceSubscriptionService();

      let serviceSubecription =
        await serviceSubscriptionService.getAllServiceSubscriptionByData(data);

      const serviceSubscriptionMapping = new ServiceSubscriptionMapping();
      let servicedata = { subscription_plan_id: subId };

      let services =
        await serviceSubscriptionMapping.getAllServiceSubscriptionMappingByData(
          servicedata
        );
      // serviceSubecription.services = {...services};

      response[userServicesSubscriptions[userServicesSubscription]["id"]] = {
        ...serviceSubecription[0],
        details: userServicesSubscriptions[userServicesSubscription],
        services: { ...services },
      };
      // response.push({...serviceSubecription});
    }
    console.log({ response });
    let servicesSubResponse = response;
    // ===============================================================================
    const serviceuserMappingServices = new ServiceUserMappingService();
    let userServices =
      await serviceuserMappingServices.getAllServiceUserMappingByData(data);
    console.log("userServices", userServices);

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
    let servicesResponse = serviceDatas;

    return raiseSuccess(
      res,
      200,
      {
        services: { ...servicesResponse },
        subscription: { ...servicesSubResponse },
      },
      "success"
    );
  };

  updateServiceSubscriptionUserMapping = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      let { params: { id } = {}, body } = req;
      Log.info(`Report : id = ${id}`);
      if (!id) {
        return raiseClientError(
          res,
          422,
          {},
          "Please select correct ServiceOffer to update"
        );
      }
      const serviceSubscriptionUserMappingService =
        new ServiceSubscriptionUserMappingService();
      let userServicesSubscriptions =
        await serviceSubscriptionUserMappingService.updateServiceSubscriptionUserMapping(
          body,
          id
        );
      return raiseSuccess(
        res,
        200,
        {
          ...userServicesSubscriptions,
        },
        "Service updated successfully"
      );
    } catch (error) {
      Log.debug("updateService 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new ServiceSubscriptionUserMappingController();
