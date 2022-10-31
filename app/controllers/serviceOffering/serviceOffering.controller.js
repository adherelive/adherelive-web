import Controller from "../index";
import Logger from "../../../libs/log";
// services
import ServiceOfferingService from "../../services/serviceOffering/serviceOffering.service";
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

      doctor_id = userId;

      console.log(req);

      if (req.userDetails.userRoleData.basic_info.linked_with === "provider")
        provider_id = req.userDetails.userRoleData.basic_info.linked_id;

      // when docker login with provider and added service to that doctor.

      if (category === "provider" && req.body.doctor_id) {
        provider_id = req.userDetails.userCategoryData.basic_info.id;
        doctor_id = req.body.doctor_id;
      }

      provider_type = req.userDetails.userRoleData.basic_info.linked_with;
      console.log("====================================");

      console.log({ doctor_id, provider_id, provider_type });
      console.log(req);
      console.log("====================================");
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
      } = await serviceOfferingService.addServiceOffering({
        provider_type,
        provider_id,
        doctor_id,
        service_offering_name,
        description,
        service_charge,
        currency,
        is_active,
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
      console.log("services", services);
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
      console.log(query);
      const serviceOfferingService = new ServiceOfferingService();
      const services = await serviceOfferingService.getAllServiceOfferingByData(
        query
      );
      console.log("services", services);
      return raiseSuccess(
        res,
        200,
        {
          ...services,
        },
        "Service updated successfully"
      );
    } catch (ex) {
      Log.debug("getServiceByData 500 error", error);
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

    if (req.userDetails.userRoleData.basic_info.linked_with === "doctor") {
      // doctor_id = req.userDetails.userCategoryData.basic_info.id;
      data = {
        doctor_id,
        provider_type: req.userDetails.userRoleData.basic_info.linked_with,
      };
    }

    if (req.userDetails.userRoleData.basic_info.linked_with === "provider") {
      provider_id = req.userDetails.userRoleData.basic_info.linked_id;
      // doctor_id = req.userDetails.userCategoryData.basic_info.id;
      data = {
        doctor_id,
        provider_id,
        provider_type: req.userDetails.userRoleData.basic_info.linked_with,
      };
    }
    if (category === "provider" && doctor_id) {
      provider_id = req.userDetails.userCategoryData.basic_info.id;
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

  getServiceOfferingForUser = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    const {
      userDetails: { userId, userData: { category } = {}, userCategoryId } = {},
      permissions = [],
    } = req;
    let doctor_id,
      provider_id = null;
    let data = null;

    if (req.userDetails.userRoleData.basic_info.linked_with === "doctor") {
      doctor_id = req.userDetails.userCategoryData.basic_info.id;
      data = {
        doctor_id,
        provider_type: req.userDetails.userRoleData.basic_info.linked_with,
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
}

export default new ReportController();
