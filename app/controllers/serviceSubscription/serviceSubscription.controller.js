import Controller from "../index";

import { createLogger } from "../../../libs/log";

// Services
import ServiceSubscriptionService from "../../services/serviceSubscription/serviceSubscription.service";
import ServiceSubscriptionMapping from "../../services/serviceSubscriptionMapping/serviceSubscritpionMapping.service";
import { USER_CATEGORY } from "../../../constant";

const log = createLogger("WEB > CONTROLLER > Service Offering");

class ServiceSubscriptionController extends Controller {
  constructor() {
    super();
  }

  create = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    const {
      userDetails: { userId, userData: { category } = {}, userCategoryId } = {},
      permissions = [],
    } = req;
    let doctor_id,
      provider_id = null;
    let data = null;

    if (category === USER_CATEGORY.DOCTOR) {
      doctor_id = req.userDetails.userCategoryData.basic_info.id;
      data = {
        doctor_id,
        provider_id: null,
        provider_type: USER_CATEGORY.DOCTOR,
      };
    }

    if (req.userDetails.userRoleData.basic_info.linked_with === "provider") {
      provider_id = req.userDetails.userRoleData.basic_info.linked_id;
      doctor_id = req.userDetails.userCategoryData.basic_info.id;
      data = {
        doctor_id,
        provider_id,
        provider_type: req.userDetails.userRoleData.basic_info.linked_with,
      };
    }
    // chanage provider type to provider
    if (category === "provider" && req.body.doctor_id) {
      provider_id = req.userDetails.userCategoryData.basic_info.id;
      doctor_id = req.body.doctor_id;
      data = {
        doctor_id,
        provider_id,
        provider_type: USER_CATEGORY.PROVIDER,
      };
    }

    try {
      let serviceSubscription = req.body;
      const serviceSubscriptionService = new ServiceSubscriptionService();
      serviceSubscription =
        await serviceSubscriptionService.addServiceSubscription({
          ...serviceSubscription,
          ...data,
        });

      return raiseSuccess(
        res,
        200,
        {
          serviceSubscription,
        },
        "Subscription added successfully"
      );
    } catch (error) {
      log.debug("Service Subscription 500 error: ", error);
      return raiseServerError(res);
    }
  };

  updateServiceSubscription = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      let { params: { id } = {}, body } = req;
      log.debug(`Report : id = ${id}`);
      if (!id) {
        return raiseClientError(
          res,
          422,
          {},
          "Please select correct ServiceOffer to update"
        );
      }
      const serviceSubscriptionService = new ServiceSubscriptionService();
      let serviceSubscription =
        await serviceSubscriptionService.updateServiceSubscription(body, id);
      return raiseSuccess(
        res,
        200,
        {
          ...serviceSubscription,
        },
        "Service updated successfully"
      );
    } catch (error) {
      log.debug("updateServiceSubscription 500 error: ", error);
      return raiseServerError(res);
    }
  };

  getServiceOfferingById = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      let { params: { id } = {} } = req;
      log.debug(`Report : id = ${id}`);

      if (!id) {
        return raiseClientError(
          res,
          422,
          {},
          "Please select correct ServiceOffer to update"
        );
      }
      let data = { id };
      const serviceSubscriptionService = new ServiceSubscriptionService();
      let serviceSubscription =
        await serviceSubscriptionService.getServiceSubscriptionByData(data);

      const serviceSubscriptionMapping = new ServiceSubscriptionMapping();
      let servicedata = { subscription_plan_id: id };
      let services =
        await serviceSubscriptionMapping.getAllServiceSubscriptionMappingByData(
          servicedata
        );
      serviceSubscription.services = services;

      return raiseSuccess(
        res,
        200,
        {
          ...serviceSubscription,
        },
        "success"
      );
    } catch (error) {
      log.debug("getServiceOfferingById 500 error: ", error);
      return raiseServerError(res);
    }
  };

  getServiceOfferingByData = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { query } = req;

      const serviceSubscriptionService = new ServiceSubscriptionService();
      let serviceSubscriptions =
        await serviceSubscriptionService.getAllServiceSubscriptionByData(query);

      let serviceSubscriptionsData = [];
      for (let serviceSubscription in serviceSubscriptions) {
        let serviceSubData = serviceSubscriptions[serviceSubscription];
        const serviceSubscriptionMapping = new ServiceSubscriptionMapping();
        let servicedata = { subscription_plan_id: serviceSubData.id };
        let services =
          await serviceSubscriptionMapping.getAllServiceSubscriptionMappingByData(
            servicedata
          );
        serviceSubData.services = services;
        serviceSubscriptionsData.push(serviceSubData);
      }

      return raiseSuccess(
        res,
        200,
        {
          ...serviceSubscriptionsData,
        },
        "Service updated successfully"
      );
    } catch (ex) {
      log.debug("getServiceOfferingByData 500 error: ", ex);
      return raiseServerError(res);
    }
  };

  getServiceSubscriptionForAdmin = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    const {
      userDetails: { userId, userData: { category } = {}, userCategoryId } = {},
      permissions = [],
    } = req;
    let provider_id = null;
    let data = null;
    let { params: { doctor_id } = {}, body } = req;

    if (category === USER_CATEGORY.DOCTOR) {
      data = {
        doctor_id,
        provider_id: null,
        provider_type: USER_CATEGORY.DOCTOR,
      };
    }

    if (category === "provider" && doctor_id) {
      provider_id = req.userDetails.userCategoryData.basic_info.id;
      data = {
        doctor_id,
        provider_id,
        provider_type: USER_CATEGORY.PROVIDER,
      };
    }

    if (category === "admin" && doctor_id) {
      provider_id = req.userDetails.userRoleData.basic_info.linked_id;
      // TODO: Check why this self-assignment has been done
      let myDoctorId = doctor_id;
      data = {
        // myDoctorId,
        provider_id,
        // provider_type: req.userDetails.userRoleData.basic_info.linked_with,
      };
    }

    try {
      const serviceSubscriptionService = new ServiceSubscriptionService();
      let serviceSubscriptions =
        await serviceSubscriptionService.getAllServiceSubscriptionByData(data);

      let serviceSubscriptionsData = [];
      for (let serviceSubscription in serviceSubscriptions) {
        let serviceSubData = serviceSubscriptions[serviceSubscription];
        const serviceSubscriptionMapping = new ServiceSubscriptionMapping();
        let servicedata = { subscription_plan_id: serviceSubData.id };
        let services =
          await serviceSubscriptionMapping.getAllServiceSubscriptionMappingByData(
            servicedata
          );
        serviceSubData.services = services;
        serviceSubscriptionsData.push(serviceSubData);
      }
      return raiseSuccess(
        res,
        200,
        {
          ...serviceSubscriptionsData,
        },
        "Service updated successfully"
      );
    } catch (ex) {
      log.debug("getServiceSubscriptionForAdmin 500 error: ", ex);
      return raiseServerError(res);
    }
  };

  getServiceSubscriptionForPatient = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    let data = null;
    let { provider_id, provider_type, doctor_id } = req.query;

    if (USER_CATEGORY.PROVIDER === provider_type) {
      data = {
        doctor_id: parseInt(doctor_id),
        provider_type,
        provider_id: parseInt(provider_id),
      };
    }
    if (USER_CATEGORY.DOCTOR === provider_type) {
      data = {
        doctor_id: parseInt(doctor_id),
        provider_type,
      };
    }
    try {
      const serviceSubscriptionService = new ServiceSubscriptionService();
      let serviceSubscriptions =
        await serviceSubscriptionService.getAllServiceSubscriptionByData(data);

      let serviceSubscriptionsData = [];
      for (let serviceSubscription in serviceSubscriptions) {
        let serviceSubData = serviceSubscriptions[serviceSubscription];
        const serviceSubscriptionMapping = new ServiceSubscriptionMapping();
        let servicedata = { subscription_plan_id: serviceSubData.id };
        let services =
          await serviceSubscriptionMapping.getAllServiceSubscriptionMappingByData(
            servicedata
          );
        serviceSubData.services = services;
        serviceSubscriptionsData.push(serviceSubData);
      }

      return raiseSuccess(
        res,
        200,
        {
          ...serviceSubscriptionsData,
        },
        "Service updated successfully"
      );
    } catch (ex) {
      log.debug("getServiceSubscriptionForPatient 500 error: ", ex);
      return raiseServerError(res);
    }
  };

  getServiceOfferingForUser = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    const {
      userDetails: { userId, userData: { category } = {}, userCategoryId } = {},
      permissions = [],
    } = req;
    let doctor_id,
      provider_id = null;
    let data = null;

    if (category === USER_CATEGORY.DOCTOR) {
      doctor_id = req.userDetails.userCategoryData.basic_info.id;
      data = {
        doctor_id,
        provider_type: USER_CATEGORY.DOCTOR,
      };
    }

    if (req.userDetails.userRoleData.basic_info.linked_with === "provider") {
      provider_id = req.userDetails.userRoleData.basic_info.linked_id;
      doctor_id = req.userDetails.userCategoryData.basic_info.id;
      data = {
        doctor_id,
        provider_id,
        provider_type: req.userDetails.userRoleData.basic_info.linked_with,
      };
    }

    try {
      const serviceSubscriptionService = new ServiceSubscriptionService();
      let serviceSubscriptions =
        await serviceSubscriptionService.getAllServiceSubscriptionByData(data);

      let serviceSubscriptionsData = [];
      for (let serviceSubscription in serviceSubscriptions) {
        let serviceSubData = serviceSubscriptions[serviceSubscription];
        const serviceSubscriptionMapping = new ServiceSubscriptionMapping();
        let servicedata = { subscription_plan_id: serviceSubData.id };
        let services =
          await serviceSubscriptionMapping.getAllServiceSubscriptionMappingByData(
            servicedata
          );
        serviceSubData.services = services;
        serviceSubscriptionsData.push(serviceSubData);
      }

      return raiseSuccess(
        res,
        200,
        {
          ...serviceSubscriptionsData,
        },
        "Service updated successfully"
      );
    } catch (ex) {
      log.debug("getServiceOfferingForUser 500 error: ", ex);
      return raiseServerError(res);
    }
  };
}

export default new ServiceSubscriptionController();
