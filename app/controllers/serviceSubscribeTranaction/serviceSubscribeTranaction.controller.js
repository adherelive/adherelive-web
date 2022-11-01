import Controller from "../index";
import Logger from "../../../libs/log";
import moment from "moment";
// services
import ServiceSubscribeTx from "../../services/serviceSubscribeTranaction/serviceSubscribeTranaction";
import ServiceSubscription from "../../services/serviceSubscription/serviceSubscription.service";
import ServiceSubscriptionUserMappingService from "../../services/serviceSubscriptionUserMapping/serviceSubscriptionUserMapping.service";
import ServiceUserMapping from "../../services/serviceUserMapping/serviceUserMapping.service";
import ServiceOffering from "../../services/serviceOffering/serviceOffering.service";
import DoctorService from "../../services/doctor/doctor.service";
import PatientService from "../../services/patients/patients.service";
import ServiceSubscriptionMapping from "../../services/serviceSubscriptionMapping/serviceSubscritpionMapping.service";
import TransactionActivite from "../../services/transactionActivity/transactionActivity.service";
import { USER_CATEGORY } from "../../../constant";
const Log = new Logger("WEB > CONTROLLER > Service Offering");

class ServiceSubscriptionTxController extends Controller {
  constructor() {
    super();
  }

  create = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const {
        userDetails: {
          userId,
          userData: { category } = {},
          userCategoryId,
        } = {},
        permissions = [],
      } = req;
      let doctor_id,
        provider_id,
        provider_type = null;

      provider_type = req.userDetails.userRoleData.basic_info.linked_with;
      if (category === USER_CATEGORY.DOCTOR) {
        doctor_id = req.userDetails.userCategoryData.basic_info.id;
        provider_type = USER_CATEGORY.DOCTOR;
      }

      if (
        req.userDetails.userRoleData.basic_info.linked_with ===
        USER_CATEGORY.PROVIDER
      ) {
        provider_id = req.userDetails.userRoleData.basic_info.linked_id;
        doctor_id = req.userDetails.userCategoryData.basic_info.id;
      }

      if (category === "provider" && req.body.doctor_id) {
        provider_id = req.userDetails.userCategoryData.basic_info.id;
        doctor_id = req.body.doctor_id;
      }

      const serviceSubscribeTx = new ServiceSubscribeTx();
      let tranaction = serviceSubscribeTx.addServiceSubscriptionTx({
        doctor_id,
        provider_id,
        provider_type,
        ...req.body,
      });

      return raiseSuccess(
        res,
        200,
        {
          tranaction,
        },
        "Service added successfully"
      );
    } catch (error) {
      Log.debug("addService 500 error", error);
      return raiseServerError(res);
    }
  };

  getServiceSubscriptionTxForUser = async (req, res) => {
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

    // const serviceSubscribeTx = new ServiceSubscribeTx();
    let tranactions = await ServiceSubscribeTx.getAllServiceSubscriptionTx(
      data
    );

    for (let i = 0; i < tranactions.length; i++) {
      tranactions[i].doctor = await DoctorService.getDoctorByDoctorId(
        tranactions[i].doctor_id
      );
      let users = await PatientService.getPatientById({
        id: tranactions[i].patient_id,
      });

      tranactions[i].patient = users.dataValues;
      if (tranactions[i].subscription_user_plan_id) {
        const serviceSubscriptionUserMappingService =
          new ServiceSubscriptionUserMappingService();
        let userServicesSubscriptions =
          await serviceSubscriptionUserMappingService.getAllServiceSubscriptionUserMappingByData(
            { id: tranactions[i].subscription_user_plan_id }
          );
        let serviceSubscription = new ServiceSubscription();
        let details = await serviceSubscription.getServiceSubscriptionByData({
          id: userServicesSubscriptions[0]["service_subscription_plan_id"],
        });
        userServicesSubscriptions["details"] = details;
        userServicesSubscriptions[0]["details"] = details;
        tranactions[i].subplan = userServicesSubscriptions;
      }

      if (tranactions[i].service_user_plan_id) {
        let service = new ServiceUserMapping();
        let services = await service.getAllServiceUserMappingByData({
          id: tranactions[i].service_user_plan_id,
        });

        let serviceOffering = new ServiceOffering();
        let details = await serviceOffering.getServiceOfferingByData({
          id: services[0]["service_plan_id"],
        });
        services[0]["details"] = details;
        // tranactions[i].subplan = services

        tranactions[i].services = services;
      }
    }
    return raiseSuccess(res, 200, { ...tranactions }, "Success");
  };
  // create activities.
  createActivity = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { id, service_subscription_id, service_plan_id } = req.body;
      let tranactions = await ServiceSubscribeTx.getAllServiceSubscriptionTx({
        id: id,
      });

      await ServiceSubscribeTx.updateServiceSubscriptionTx(
        { patient_status: "active" },
        id
      );

      console.log(tranactions[0]);
      let {
        doctor_id,
        provider_id,
        provider_type,
        patient_id,
        amount,
        subscription_user_plan_id,
        service_user_plan_id,
      } = tranactions[0];

      if (service_user_plan_id) {
        const serviceUserMapping = new ServiceUserMapping();
        serviceUserMapping.updateServiceUserMapping(
          { patient_status: "active" },
          service_user_plan_id
        );
      }

      if (subscription_user_plan_id) {
        const serviceSubUserMapping =
          new ServiceSubscriptionUserMappingService();
        serviceSubUserMapping.updateServiceSubscriptionUserMapping(
          { patient_status: "active" },
          subscription_user_plan_id
        );
      }

      console.log({ service_plan_id });
      if (service_plan_id) {
        console.log("INIF");
        let response = [];
        let activitieData = {
          service_offering_id: service_plan_id,
          doctor_id,
          provider_id,
          provider_type,
          patient_id,
          status: "pending",
          patient_status: "inactive",
          amount,
          billing_frequency: "onces",
          due_date: moment(new Date(), "DD-MM-YYYY").add(7, "days"),
        };
        const txActivities = new TransactionActivite();
        txActivities.addTransactionActivite(activitieData);
        response.push(activitieData);
        return raiseSuccess(res, 200, { response }, "Success");
      }

      const serviceSubscriptionMapping = new ServiceSubscriptionMapping();
      let servicedata = { subscription_plan_id: service_subscription_id };
      let services =
        await serviceSubscriptionMapping.getAllServiceSubscriptionMappingByData(
          servicedata
        );
      let response = [];
      Object.keys(services).forEach((id) => {
        let activitieData = {
          service_offering_id: services[id]["service_plan_id"],
          doctor_id,
          provider_id,
          provider_type,
          patient_id,
          status: "pending",
          patient_status: "inactive",
          amount,
          billing_frequency: "onces",
          due_date: moment(new Date(), "DD-MM-YYYY").add(30, "days"),
          service_subscription_id: service_subscription_id,
        };

        console.log({ activitieData });
        const txActivities = new TransactionActivite();
        txActivities.addTransactionActivite(activitieData);
        response.push(activitieData);
      });
      return raiseSuccess(res, 200, { response }, "Success");
    } catch (error) {
      Log.debug("addService 500 error", error);
      return raiseServerError(res);
    }
  };

  updateTx = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      let { params: { id } = {}, body } = req;
      let { servicesusermapping, subscriptionusermapping, ...txbody } =
        req.body;
      Log.info(`Report : id = ${id}`);
      if (!id) {
        return raiseClientError(res, 422, {}, "Please provide tx id.");
      }
      // const serviceSubscribeTx = new ServiceSubscribeTx();
      let userServicesSubscriptions =
        await ServiceSubscribeTx.updateServiceSubscriptionTx(txbody, id);

      // need to update serviceoffering user mapping
      let tranactions = await ServiceSubscribeTx.getAllServiceSubscriptionTx({
        id,
      });
      let { patient_status } = txbody;
      for (let i = 0; i < tranactions.length; i++) {
        if (tranactions[i].subscription_user_plan_id) {
          const serviceSubscriptionUserMappingService =
            new ServiceSubscriptionUserMappingService();
          await serviceSubscriptionUserMappingService.updateServiceSubscriptionUserMapping(
            { patient_status },
            tranactions[i].subscription_user_plan_id
          );
        }
        if (tranactions[i].service_user_plan_id) {
          let service = new ServiceUserMapping();
          await service.updateServiceUserMapping(
            { patient_status },
            tranactions[i].service_user_plan_id
          );
        }
      }

      // if user send the

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

export default new ServiceSubscriptionTxController();
