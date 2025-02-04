import Controller from "../index";

import { createLogger } from "../../../libs/logger";

// Services
import TxActivities from "../../services/transactionActivity/transactionActivity.service";
import ServiceSubscription from "../../services/serviceSubscription/serviceSubscription.service";
import ServiceSubscriptionUserMappingService from "../../services/serviceSubscriptionUserMapping/serviceSubscriptionUserMapping.service";
import ServiceOffering from "../../services/serviceOffering/serviceOffering.service";
import DoctorService from "../../services/doctor/doctor.service";
import PatientService from "../../services/patients/patients.service";
import PatientWrapper from "../../apiWrapper/web/patient";
import { USER_CATEGORY } from "../../../constant";

const ReassignAudit = require("../../models/mongoModel/reassignAudit");
const logger = createLogger("WEB > CONTROLLER > Service Offering");

class TransactionActivityController extends Controller {
  constructor() {
    super();
  }

  getTxActivities = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    const {
      userDetails: { userId, userData: { category } = {}, userCategoryId } = {},
      permissions = [],
    } = req;

    let doctor_id,
      provider_id = null;
    let data = null;
    let { status, offset = 0, sort_duedate = null } = req.query;

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

    if (status) data["status"] = status;

    const txActivitiesService = new TxActivities();

    let txActivities = await txActivitiesService.getAllTxActivitiesByData(
      data,
      sort_duedate
    );

    let response = [];
    for (let i in txActivities) {
      txActivities[i].doctor = await DoctorService.getDoctorByDoctorId(
        txActivities[i].doctor_id
      );
      let users = await PatientService.getPatientById({
        id: txActivities[i].patient_id,
      });
      const patientData = await PatientWrapper(users);

      txActivities[i].patient = patientData;
      let serviceSubscription = new ServiceSubscription();

      let serviceSubscriptionDetails =
        await serviceSubscription.getServiceSubscriptionByData({
          id: txActivities[i].service_subscription_id,
        });
      txActivities[i]["serviceSubscriptionDetails"] =
        serviceSubscriptionDetails;
      let serviceOffering = new ServiceOffering();
      let details = await serviceOffering.getServiceOfferingByData({
        id: txActivities[i].service_offering_id,
      });
      txActivities[i]["details"] = details;
      response.push(txActivities);
    }
    return raiseSuccess(res, 200, { ...txActivities }, "Success");
  };

  getTxActivitiesbyPatient = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    const {
      userDetails: { userId, userData: { category } = {}, userCategoryId } = {},
      permissions = [],
    } = req;
    let doctor_id,
      provider_id = null;
    let data = null;
    let { status, patient_id, service_offering_id, service_subscription_id } =
      req.query;
    if (category === USER_CATEGORY.DOCTOR) {
      doctor_id = req.userDetails.userCategoryData.basic_info.id;
      data = {
        doctor_id,
        provider_type: USER_CATEGORY.DOCTOR,
        patient_id,
      };
      if (service_offering_id)
        data = { ...data, service_offering_id, service_subscription_id: null };
      if (service_subscription_id) data = { ...data, service_subscription_id };
    }

    if (req.userDetails.userRoleData.basic_info.linked_with === "provider") {
      provider_id = req.userDetails.userRoleData.basic_info.linked_id;
      doctor_id = req.userDetails.userCategoryData.basic_info.id;
      data = {
        doctor_id,
        patient_id,
        provider_id,
        provider_type: req.userDetails.userRoleData.basic_info.linked_with,
      };
      if (service_offering_id) {
        data = { ...data, service_offering_id, service_subscription_id: null };
      }
      if (service_subscription_id) {
        data = { ...data, service_subscription_id };
      }
    }

    if (status) data["status"] = status;

    const txActivitiesService = new TxActivities();

    let txActivities = await txActivitiesService.getAllTxActivitiesByData(data);

    let response = [];
    for (let i in txActivities) {
      txActivities[i].doctor = await DoctorService.getDoctorByDoctorId(
        txActivities[i].doctor_id
      );
      let users = await PatientService.getPatientById({
        id: txActivities[i].patient_id,
      });
      const patientData = await PatientWrapper(users);

      txActivities[i].patient = patientData;
      let serviceSubscription = new ServiceSubscription();

      logger.debug("=========================================");
      logger.debug({
        value: txActivities[i].service_subscription_id != null,
        mytestservice_subid: txActivities[i].service_subscription_id,
      });
      logger.debug("=========================================");

      if (txActivities[i].service_subscription_id != null) {
        let serviceSubscriptionDetails =
          await serviceSubscription.getServiceSubscriptionByData({
            id: txActivities[i].service_subscription_id,
          });
        txActivities[i]["serviceSubscriptionDetails"] =
          serviceSubscriptionDetails;
        let serviceOffering = new ServiceOffering();
        let details = await serviceOffering.getServiceOfferingByData({
          id: txActivities[i].service_offering_id,
        });
        txActivities[i]["details"] = details;
        response.push(txActivities);
      }

      if (txActivities[i].service_subscription_id == null) {
        // let serviceSubscriptionDetails =
        // await serviceSubscription.getServiceSubscriptionByData({
        // id: txActivities[i].service_subscription_id,
        // });
        // txActivities[i]["serviceSubscriptionDetails"] =
        // serviceSubscriptionDetails;
        let serviceOffering = new ServiceOffering();
        let details = await serviceOffering.getServiceOfferingByData({
          id: txActivities[i].service_offering_id,
        });
        txActivities[i]["details"] = details;
        response.push(txActivities);
      }
    }
    return raiseSuccess(res, 200, { ...txActivities }, "Success");
  };

  updateTxActivities = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      let { params: { id } = {}, body } = req;
      logger.debug(`Report : id = ${id}`);
      if (!id) {
        return raiseClientError(
          res,
          422,
          {},
          "Please select correct Id to update"
        );
      }
      const serviceSubscriptionUserMappingService =
        new ServiceSubscriptionUserMappingService();
      const txActivities = new TxActivities();
      let txActivitie = await txActivities.updateTxActivities(body, id);

      return raiseSuccess(
        res,
        200,
        {
          ...txActivitie,
        },
        "Activity updated successfully"
      );
    } catch (error) {
      logger.debug("updateService 500 error", error);
      return raiseServerError(res);
    }
  };

  reassignTxActivities = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      let { params: { id } = {}, body } = req;
      logger.debug(`Report : id = ${id}`);
      if (!id) {
        return raiseClientError(
          res,
          422,
          {},
          "Please select correct Id to update"
        );
      }
      const serviceSubscriptionUserMappingService =
        new ServiceSubscriptionUserMappingService();
      const txActivities = new TxActivities();

      const { assignedBy, assignedTo, reason, ...rest } = body;

      if (!(assignedBy || assignedTo)) {
        return raiseClientError(
          res,
          422,
          {},
          "Please select correct assignedBy and to assignedTo"
        );
      }

      // Audit Logic Here.
      let reassignAudit = new ReassignAudit({
        activity_id: id,
        assignedBy,
        assignedTo,
        reason,
      });
      reassignAudit = reassignAudit.save();

      let txActivitie = await txActivities.updateTxActivities(
        { ...rest, is_reassigned: true },
        id
      );
      return raiseSuccess(
        res,
        200,
        {
          ...txActivitie,
          reassignAudit,
        },
        "Activity updated successfully"
      );
    } catch (error) {
      logger.debug("updateService 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new TransactionActivityController();
