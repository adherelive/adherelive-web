import Controller from "../index";
import Logger from "../../../libs/log";
// services
import ServiceSubscriptionService from "../../services/serviceSubscription/serviceSubscription.service";
import ServiceOfferingService from "../../services/serviceOffering/serviceOffering.service";
import { USER_CATEGORY } from "../../../constant";
import ServiceSubscriptionMapping from "../../services/serviceSubscriptionMapping/serviceSubscritpionMapping.service";

const Log = new Logger("WEB > CONTROLLER > Service Offering");

class ReportController extends Controller {
  constructor() {
    super();
  }

  create = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      let {
        body: {
          provider_type,
          provider_id,
          doctor_id,
          service_offering_name,
          description,
          service_charge,
          currency,
          is_active,
          payment_link,
        },
        // userDetails: { userData: { category }, userCategoryId } = {},
      } = req;
      let id = "";

      const {
        userDetails: {
          userId,
          userData: { category } = {},
          userCategoryId,
        } = {},
        permissions = [],
      } = req;

      provider_type = req.userDetails.userRoleData.basic_info.linked_with;
      
      // when user is logged in as a doctor
      if (category === USER_CATEGORY.DOCTOR) {
        doctor_id = req.userDetails.userCategoryData.basic_info.id;
        provider_type = USER_CATEGORY.DOCTOR;
      }
      // when user is logged in as a doctor in provider
      if (req.userDetails.userRoleData.basic_info.linked_with === "provider") {
        provider_id = req.userDetails.userRoleData.basic_info.linked_id;
        doctor_id = req.userDetails.userCategoryData.basic_info.id;
        provider_type = req.userDetails.userRoleData.basic_info.linked_with
      }
      // login as a provider admin.
      if (category === "provider" && req.body.doctor_id) {
        provider_id = req.userDetails.userCategoryData.basic_info.id;
        doctor_id = req.body.doctor_id;
        provider_type = USER_CATEGORY.PROVIDER
      }



      const serviceOfferingService = new ServiceOfferingService();
      ({
        id,
        provider_type,
        is_active,
        doctor_id,
        provider_id,
        service_offering_name,
        description,
        service_charge,
        currency,
        payment_link,
      } = await serviceOfferingService.addServiceOffering({
        provider_type,
        provider_id,
        doctor_id,
        service_offering_name,
        description,
        service_charge,
        currency,
        is_active,
        payment_link,
      }));

      let service = {
        id,
        provider_type,
        provider_id,
        is_active,
        service_offering_name,
        description,
        service_charge,
        currency,
        doctor_id,
        payment_link,
      };

      return raiseSuccess(
        res,
        200,
        {
          service,
        },
        "Service added successfully"
      );
    } catch (error) {
      Log.debug("addService 500 error", error);
      return raiseServerError(res);
    }
  };

  updateServiceOffering = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      let {
        params: { id } = {},
        body: {
          provider_type,
          provider_id,
          service_offering_name,
          description,
          service_charge,
          currency,
        },
      } = req;
      Log.info(`Report : id = ${id}`);

      if (!id) {
        return raiseClientError(
          res,
          422,
          {},
          "Please select correct ServiceOffer to update"
        );
      }
      let data = {
        provider_type,
        provider_id,
        service_offering_name,
        description,
        service_charge,
        currency,
      };
      const serviceOfferingService = new ServiceOfferingService();
      const updatedService = await serviceOfferingService.updateServiceOffering(
        data,
        id
      );
      return raiseSuccess(
        res,
        200,
        {
          ...updatedService,
        },
        "Service updated successfully"
      );
    } catch (error) {
      Log.debug("updateService 500 error", error);
      return raiseServerError(res);
    }
  };

  getServiceOfferingById = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      let { params: { id } = {} } = req;
      Log.info(`Report : id = ${id}`);

      if (!id) {
        return raiseClientError(
          res,
          422,
          {},
          "Please select correct ServiceOffer to update"
        );
      }
      const serviceOfferingService = new ServiceOfferingService();
      let data = { id };
      const services = await serviceOfferingService.getServiceOfferingByData(
        data
      );

      return raiseSuccess(
        res,
        200,
        {
          ...services,
        },
        "success"
      );
    } catch (error) {
      Log.debug("updateService 500 error", error);
      return raiseServerError(res);
    }
  };

  getServiceOfferingByData = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { query } = req;

      const serviceOfferingService = new ServiceOfferingService();
      const services = await serviceOfferingService.getAllServiceOfferingByData(
        query
      );

      return raiseSuccess(
        res,
        200,
        {
          ...services,
        },
        "Service updated successfully"
      );
    } catch (ex) {
      Log.debug("getServiceByData 500 error", ex);
      return raiseServerError(res);
    }
  };

  getServiceOfferingForAdmin = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    const {
      userDetails: { userId, userData: { category } = {}, userCategoryId } = {},
      permissions = [],
    } = req;
    let { params: { doctor_id } = {}, body } = req;
    let provider_id = null;
    let data = null;

    if (category === USER_CATEGORY.DOCTOR) {
      // doctor_id = req.userDetails.userCategoryData.basic_info.id;
      data = {
        doctor_id,
        provider_type: USER_CATEGORY.DOCTOR,
      };
    }

    if (req.userDetails.userRoleData.basic_info.linked_with === USER_CATEGORY.PROVIDER) {
      provider_id = req.userDetails.userRoleData.basic_info.linked_id;
      // doctor_id = req.userDetails.userCategoryData.basic_info.id;
      data = {
        doctor_id,
        provider_id,
        provider_type: USER_CATEGORY.PROVIDER,
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

    const serviceOfferingService = new ServiceOfferingService();
    const services = await serviceOfferingService.getAllServiceOfferingByData(
      data
    );
    return raiseSuccess(res, 200, { ...services }, "Success");
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

    const serviceOfferingService = new ServiceOfferingService();
    const services = await serviceOfferingService.getAllServiceOfferingByData(
      data
    );
    return raiseSuccess(res, 200, { ...services }, "Success");
  };

  /////////////////////////////////////////////////////////
  getServiceOfferingForPatient = async (req, res) => {
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

    const serviceOfferingService = new ServiceOfferingService();
    try {
      const services = await serviceOfferingService.getAllServiceOfferingByData(
        data
      );
      let mainServiceData = {};
      for (let service in services) {
        let serviceData = services[service];

        mainServiceData[serviceData.id] = serviceData;
      }

      const serviceSubscriptionService = new ServiceSubscriptionService();
      let serviceSubscriptions =
        await serviceSubscriptionService.getAllServiceSubscriptionByData(data);

      let serviceSubscriptionsData = {};
      for (let serviceSubscription in serviceSubscriptions) {
        let serviceSubData = serviceSubscriptions[serviceSubscription];
        const serviceSubscriptionMapping = new ServiceSubscriptionMapping();
        let servicedata = { subscription_plan_id: serviceSubData.id };
        let services =
          await serviceSubscriptionMapping.getAllServiceSubscriptionMappingByData(
            servicedata
          );
        serviceSubData.services = services;
        serviceSubscriptionsData[serviceSubData.id] = serviceSubData;
      }
      return raiseSuccess(
        res,
        200,
        {
          services: mainServiceData,
          subscriptions: serviceSubscriptionsData,
        },
        "Success"
      );
    } catch (ex) {
      Log.debug("getServiceByData 500 error", ex);
      return raiseServerError(res);
    }
  };
}

export default new ReportController();
