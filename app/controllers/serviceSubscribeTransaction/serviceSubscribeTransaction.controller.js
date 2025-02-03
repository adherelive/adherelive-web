import Controller from "../index";

import { createLogger } from "../../../libs/log";
import moment from "moment";

// Services
import ServiceSubscribeTransaction from "../../services/serviceSubscribeTransaction/serviceSubscribeTransaction";
import ServiceSubscription from "../../services/serviceSubscription/serviceSubscription.service";
import ServiceSubscriptionUserMappingService from "../../services/serviceSubscriptionUserMapping/serviceSubscriptionUserMapping.service";
import ServiceUserMapping from "../../services/serviceUserMapping/serviceUserMapping.service";
import ServiceOffering from "../../services/serviceOffering/serviceOffering.service";
import DoctorService from "../../services/doctor/doctor.service";
import PatientService from "../../services/patients/patients.service";
import ServiceSubscriptionMapping from "../../services/serviceSubscriptionMapping/serviceSubscritpionMapping.service";
import TransactionActivate from "../../services/transactionActivity/transactionActivity.service";
import { USER_CATEGORY } from "../../../constant";

const Log = createLogger("WEB > CONTROLLER > Service Subscribe Transaction");

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

      const serviceSubscribeTransaction = new ServiceSubscribeTransaction();
      let transaction = serviceSubscribeTransaction.addServiceSubscriptionTx({
        doctor_id,
        provider_id,
        provider_type,
        ...req.body,
      });

      return raiseSuccess(
        res,
        200,
        {
          transaction,
        },
        "Service added successfully"
      );
    } catch (error) {
      Log.debug("Service Subscribe 500 error: ", error);
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
    // change constants.
    if (
      req.userDetails.userRoleData.basic_info.linked_with ===
      USER_CATEGORY.PROVIDER
    ) {
      provider_id = req.userDetails.userRoleData.basic_info.linked_id;
      doctor_id = req.userDetails.userCategoryData.basic_info.id;
      data = {
        doctor_id,
        provider_id,
        provider_type: req.userDetails.userRoleData.basic_info.linked_with,
      };
    }
    // change constant
    if (category === USER_CATEGORY.PROVIDER) {
      provider_id = req.userDetails.userCategoryData.basic_info.id;
      data = {
        provider_id,
        provider_type: USER_CATEGORY.PROVIDER,
      };
    }

    // const serviceSubscribeTransaction = new ServiceSubscribeTransaction();
    let transactions =
      await ServiceSubscribeTransaction.getAllServiceSubscriptionTx(data);

    for (let i = 0; i < transactions.length; i++) {
      transactions[i].doctor = await DoctorService.getDoctorByDoctorId(
        transactions[i].doctor_id
      );
      let users = await PatientService.getPatientById({
        id: transactions[i].patient_id,
      });

      transactions[i].patient = users.dataValues;
      if (transactions[i].subscription_user_plan_id) {
        const serviceSubscriptionUserMappingService =
          new ServiceSubscriptionUserMappingService();
        let userServicesSubscriptions =
          await serviceSubscriptionUserMappingService.getAllServiceSubscriptionUserMappingByData(
            { id: transactions[i].subscription_user_plan_id }
          );
        let serviceSubscription = new ServiceSubscription();
        let details = await serviceSubscription.getServiceSubscriptionByData({
          id: userServicesSubscriptions[0]["service_subscription_plan_id"],
        });
        userServicesSubscriptions["details"] = details;
        userServicesSubscriptions[0]["details"] = details;
        transactions[i].subplan = userServicesSubscriptions;
      }

      if (transactions[i].service_user_plan_id) {
        let service = new ServiceUserMapping();
        let services = await service.getAllServiceUserMappingByData({
          id: transactions[i].service_user_plan_id,
        });

        let serviceOffering = new ServiceOffering();
        let details = await serviceOffering.getServiceOfferingByData({
          id: services[0]["service_plan_id"],
        });
        services[0]["details"] = details;
        // transactions[i].subPlan = services

        transactions[i].services = services;
      }
    }
    return raiseSuccess(res, 200, { ...transactions }, "Success");
  };
  // create activities.
  createActivity = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { id, service_subscription_id, service_plan_id } = req.body;
      // id is tx id that we will get from service_subscription_transactions table.
      // we can get the service_user_mapping tx.
      // we can get the service_sub_user_mapping tx.
      let transactions =
        await ServiceSubscribeTransaction.getAllServiceSubscriptionTx({
          id: id,
        });

      await ServiceSubscribeTransaction.updateServiceSubscriptionTx(
        {
          patient_status: "active",
          due_date: moment(new Date(), "DD-MM-YYYY"),
        },
        id
      );

      let {
        doctor_id,
        provider_id,
        provider_type,
        patient_id,
        amount,
        subscription_user_plan_id,
        service_user_plan_id,
      } = transactions[0];

      if (service_user_plan_id) {
        const serviceUserMapping = new ServiceUserMapping();
        await serviceUserMapping.updateServiceUserMapping(
          { patient_status: "active" },
          service_user_plan_id
        );
      }

      if (subscription_user_plan_id) {
        const serviceSubUserMapping =
          new ServiceSubscriptionUserMappingService();

        let userServicesSubscriptions =
          await serviceSubUserMapping.getAllServiceSubscriptionUserMappingByData(
            { id: subscription_user_plan_id }
          );

        let { durations } = userServicesSubscriptions[0];

        await serviceSubUserMapping.updateServiceSubscriptionUserMapping(
          {
            patient_status: "active",
            service_date: moment(new Date(), "DD-MM-YYYY"),
            next_recharge_date: moment(new Date(), "DD-MM-YYYY").add(
              1,
              "months"
            ),
            expire_date: moment(new Date(), "DD-MM-YYYY").add(
              durations,
              "months"
            ),
          },
          subscription_user_plan_id
        );
      }

      if (service_plan_id) {
        let response = [];
        let activitiesData = {
          service_offering_id: service_plan_id,
          doctor_id,
          provider_id,
          service_sub_tx_id: id,
          provider_type,
          patient_id,
          status: "pending",
          patient_status: "inactive",
          amount,
          billing_frequency: "onces",
          due_date: moment(new Date(), "DD-MM-YYYY").add(7, "days"),
        };
        const txActivities = new TransactionActivate();
        await txActivities.addTransactionActivite(activitiesData);
        response.push(activitiesData);
        return raiseSuccess(res, 200, { response }, "Success");
      }

      const serviceSubscriptionMapping = new ServiceSubscriptionMapping();
      let serviceData = { subscription_plan_id: service_subscription_id };
      let services =
        await serviceSubscriptionMapping.getAllServiceSubscriptionMappingByData(
          serviceData
        );

      let response = [];
      Object.keys(services).forEach((id) => {
        for (let i = 0; i < services[id]["service_frequency"]; i++) {
          let activitiesData = {
            service_offering_id: services[id]["service_plan_id"],
            doctor_id,
            provider_id,
            provider_type,
            patient_id,
            status: "pending",
            patient_status: "inactive",
            amount,
            billing_frequency: "onces",
            due_date: moment(new Date(), "DD-MM-YYYY").add(1, "months"),
            service_subscription_id: service_subscription_id,
          };

          const txActivities = new TransactionActivate();
          txActivities.addTransactionActivite(activitiesData);
          response.push(activitiesData);
        }
      });
      return raiseSuccess(res, 200, { response }, "Success");
    } catch (error) {
      Log.debug("Subscribe create activity 500 error: ", error);
      return raiseServerError(res);
    }
  };

  updateTx = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      let { params: { id } = {}, body } = req;
      let { servicesUserMapping, subscriptionUserMapping, ...txBody } =
        req.body;
      Log.info(`Report id = ${id}`);
      if (!id) {
        return raiseClientError(res, 422, {}, "Please provide tx id.");
      }
      // const serviceSubscribeTransaction = new ServiceSubscribeTransaction();
      let userServicesSubscriptions =
        await ServiceSubscribeTransaction.updateServiceSubscriptionTx(
          txBody,
          id
        );

      // need to update service-offering user mapping
      let transactions =
        await ServiceSubscribeTransaction.getAllServiceSubscriptionTx({
          id,
        });
      let { patient_status } = txBody;
      for (let i = 0; i < transactions.length; i++) {
        if (transactions[i].subscription_user_plan_id) {
          const serviceSubscriptionUserMappingService =
            new ServiceSubscriptionUserMappingService();
          await serviceSubscriptionUserMappingService.updateServiceSubscriptionUserMapping(
            { patient_status },
            transactions[i].subscription_user_plan_id
          );
        }
        if (transactions[i].service_user_plan_id) {
          let service = new ServiceUserMapping();
          await service.updateServiceUserMapping(
            { patient_status },
            transactions[i].service_user_plan_id
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
      Log.debug("updateServiceTx 500 error: ", error);
      return raiseServerError(res);
    }
  };
}

export default new ServiceSubscriptionTxController();
