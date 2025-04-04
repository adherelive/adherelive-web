import Controller from "../index";

import { createLogger } from "../../../libs/logger";

// Services
import ServiceSubscriptionUserMappingService
    from "../../services/serviceSubscriptionUserMapping/serviceSubscriptionUserMapping.service";
import ServiceUserMappingService from "../../services/serviceUserMapping/serviceUserMapping.service";
import ServiceSubscriptionService from "../../services/serviceSubscription/serviceSubscription.service";
import ServiceSubscriptionMapping from "../../services/serviceSubscriptionMapping/serviceSubscritpionMapping.service";
import ServiceOffering from "../../services/serviceOffering/serviceOffering.service";
import TxService from "../../services/serviceSubscribeTransaction/serviceSubscribeTransaction";
import doctorService from "../../services/doctor/doctor.service";
import providerService from "../../services/provider/provider.service";
import ProviderWrapper from "../../apiWrapper/web/provider";
import { USER_CATEGORY, USER_STATUS } from "../../../constant";

const logger = createLogger("WEB > CONTROLLER > Service Offering");

class ServiceSubscriptionUserMappingController extends Controller {
  constructor() {
    super();
  }

  create = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    logger.debug("service user mapping controller - create - called");

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

    logger.debug("service user mapping controller - create - called");
    try {
      const serviceSubscriptionUserMappingService =
        new ServiceSubscriptionUserMappingService();
      // check same subscription is attached to user or not...
      let responseDb =
        await serviceSubscriptionUserMappingService.getAllServiceSubscriptionUserMappingByData(
          {
            provider_id,
            doctor_id,
            provider_type,
            patient_id: req.body.patient_id,
            service_subscription_plan_id: req.body.service_subscription_plan_id,
          }
        );

      if (responseDb.length > 0) {
        for (let userServicesSubscription in responseDb) {
          // if subscription is attached then check is it expired or not
          // if it is not expired then doctor can not attach the subscription to the user

          let expire_date = new Date(
            responseDb[userServicesSubscription]["expire_date"]
          );
          let today_date = new Date();
          if (today_date < expire_date) {
            // same subscription is already attached to user.
            return raiseClientError(
              res,
              422,
              {},
              "Same Subscription is already attached to patient."
            );
          }
        }
      }

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
      logger.debug(
        "service user mapping controller - create - userServices",
        userServicesSubscription
      );

      userServicesSubscription =
        await serviceSubscriptionUserMappingService.addServiceSubscriptionUserMapping(
          userServicesSubscription
        );

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

      let txres = await TxService.addServiceSubscriptionTx(txDetails);

      return raiseSuccess(
        res,
        200,
        { userServicesSubscription },
        "Service added successfully"
      );
    } catch (error) {
      logger.error("Subscribe create user mapping 500 error: ", error);
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

      for (let userServicesSubscription in userServicesSubscriptions) {
        let subId =
          userServicesSubscriptions[userServicesSubscription][
            "service_subscription_plan_id"
          ];
        let data = { id: subId };
        let serviceSubscriptionService = new ServiceSubscriptionService();

        let serviceSubscription =
          await serviceSubscriptionService.getServiceSubscriptionByData(data);

        const serviceSubscriptionMapping = new ServiceSubscriptionMapping();
        let servicedata = { subscription_plan_id: subId };

        let services =
          await serviceSubscriptionMapping.getAllServiceSubscriptionMappingByData(
            servicedata
          );
        serviceSubscription.services = services;

        response[subId] = { ...serviceSubscription };
      }

      return raiseSuccess(
        res,
        200,
        {
          ...response,
        },
        "success"
      );
    } catch (error) {
      logger.error("getServiceSubscriptionUserMappingByPatientId 500 error: ", error);
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
      logger.error("getServiceSubscriptionUserMappingAndServiceUserByPatientId 500 error: ", error);
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

    let doctors = {};
    let doctorsInproviders = {};
    for (let userServicesSubscription in userServicesSubscriptions) {
      let doctor_id_for_sub =
        userServicesSubscriptions[userServicesSubscription]["doctor_id"];
      let doctory_provider_type =
        userServicesSubscriptions[userServicesSubscription]["provider_type"];

      if (doctor_id_for_sub && !doctors[doctor_id_for_sub]) {
        doctors[doctor_id_for_sub] = await doctorService.getDoctorByDoctorId(
          doctor_id_for_sub
        );
      }

      if (
        doctory_provider_type === USER_CATEGORY.PROVIDER &&
        doctor_id_for_sub &&
        !doctorsInproviders[doctor_id_for_sub]
      ) {
        doctorsInproviders[doctor_id_for_sub] =
          await doctorService.getDoctorByDoctorId(doctor_id_for_sub);
        doctorsInproviders[doctor_id_for_sub][
          userServicesSubscriptions[userServicesSubscription]["provider_id"]
        ] = await providerService.getProviderByData({
          id: userServicesSubscriptions[userServicesSubscription][
            "provider_id"
          ],
        });
      }

      let subId =
        userServicesSubscriptions[userServicesSubscription][
          "service_subscription_plan_id"
        ];

      let data = { id: subId };

      let serviceSubscriptionService = new ServiceSubscriptionService();

      let serviceSubscription =
        await serviceSubscriptionService.getAllServiceSubscriptionByData(data);

      const serviceSubscriptionMapping = new ServiceSubscriptionMapping();
      let servicedata = { subscription_plan_id: subId };

      let services =
        await serviceSubscriptionMapping.getAllServiceSubscriptionMappingByData(
          servicedata
        );
      // serviceSubscription.services = {...services};

      response[userServicesSubscriptions[userServicesSubscription]["id"]] = {
        ...userServicesSubscriptions[userServicesSubscription],
        subscriptions: { ...serviceSubscription[0] },
        details: userServicesSubscriptions[userServicesSubscription],
        services: { ...services },
      };
      // response.push({...serviceSubscription});
    }

    let servicesSubResponse = response;
    // ===============================================================================
    const serviceuserMappingServices = new ServiceUserMappingService();
    let userServices =
      await serviceuserMappingServices.getAllServiceUserMappingByData(data);

    let serviceDatas = [];

    for (let userService in userServices) {
      let serviceData = userServices[userService];

      const serviceOffering = new ServiceOffering();
      let servicedata = { id: serviceData.service_plan_id };
      let doctor_id_for_sub = userServices[userService]["doctor_id"];
      let doctory_provider_type = userServices[userService]["provider_type"];

      if (doctor_id_for_sub && !doctors[doctor_id_for_sub])
        doctors[doctor_id_for_sub] = await doctorService.getDoctorByDoctorId(
          doctor_id_for_sub
        );

      if (
        doctory_provider_type === USER_CATEGORY.PROVIDER &&
        doctor_id_for_sub &&
        !doctorsInproviders[doctor_id_for_sub]
      ) {
        doctorsInproviders[doctor_id_for_sub] =
          await doctorService.getDoctorByDoctorId(doctor_id_for_sub);
        doctorsInproviders[doctor_id_for_sub][
          userServices[userService]["provider_id"]
        ] = await providerService.getProviderByData({
          id: userServices[userService]["provider_id"],
        });
      }

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
        doctors,
        doctorsInproviders,
        services: { ...servicesResponse },
        subscription: { ...servicesSubResponse },
      },
      "success"
    );
  };

  getServiceSubscriptionDoctorByPatientId = async (req, res) => {
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
      logger.error("getServiceSubscriptionDoctorByPatientId 500 error; ", error);
      return raiseServerError(res);
    }

    let data = { patient_id };
    const serviceSubscriptionUserMappingService =
      new ServiceSubscriptionUserMappingService();

    let userServicesSubscriptions =
      await serviceSubscriptionUserMappingService.getAllServiceSubscriptionUserMappingByData(
        data
      );

    let doctors = {};
    let doctorsInproviders = {};
    for (let userServicesSubscription in userServicesSubscriptions) {
      let doctor_id_for_sub =
        userServicesSubscriptions[userServicesSubscription]["doctor_id"];
      let doctory_provider_type =
        userServicesSubscriptions[userServicesSubscription]["provider_type"];
      if (
        doctory_provider_type === USER_CATEGORY.DOCTOR &&
        doctor_id_for_sub &&
        !doctors[doctor_id_for_sub]
      ) {
        doctors[doctor_id_for_sub] = await doctorService.getDoctorByDoctorId(
          doctor_id_for_sub
        );
      }

      if (
        doctory_provider_type === USER_CATEGORY.PROVIDER &&
        doctor_id_for_sub &&
        !doctorsInproviders[doctor_id_for_sub]
      ) {
        let provider_id =
          userServicesSubscriptions[userServicesSubscription]["provider_id"];

        let doctorDetails = await doctorService.getDoctorByDoctorId(
          doctor_id_for_sub
        );
        let provider = await providerService.getProviderByData({
          id: provider_id,
        });
        let providerDetails = await ProviderWrapper(provider);
        // doctorDetails["provider"] = { ...providerDetails };
        let providerBasicInfo = providerDetails.getBasicInfo().basic_info;
        doctorsInproviders[doctor_id_for_sub] = {
          doctorDetails,
          providerDetails: providerBasicInfo,
        };
      }
    }
    const serviceuserMappingServices = new ServiceUserMappingService();
    let userServices =
      await serviceuserMappingServices.getAllServiceUserMappingByData(data);

    for (let userService in userServices) {
      let doctor_id_for_sub = userServices[userService]["doctor_id"];
      let doctory_provider_type = userServices[userService]["provider_type"];

      if (
        doctory_provider_type === USER_CATEGORY.DOCTOR &&
        doctor_id_for_sub &&
        !doctors[doctor_id_for_sub]
      )
        doctors[doctor_id_for_sub] = await doctorService.getDoctorByDoctorId(
          doctor_id_for_sub
        );

      if (
        doctory_provider_type === USER_CATEGORY.PROVIDER &&
        doctor_id_for_sub &&
        !doctorsInproviders[doctor_id_for_sub]
      ) {
        let provider_id = userServices[userService]["provider_id"];

        let doctorDetails = await doctorService.getDoctorByDoctorId(
          doctor_id_for_sub
        );
        let providerDetails = await providerService.getProviderByData({
          id: provider_id,
        });
        providerDetails = await ProviderWrapper(providerDetails);
        let providerBasicInfo = providerDetails.getBasicInfo().basic_info;
        doctorsInproviders[doctor_id_for_sub] = {
          doctorDetails,
          providerDetails: providerBasicInfo,
        };
      }
    }
    return raiseSuccess(
      res,
      200,
      {
        doctors,
        doctorsInproviders,
      },
      "success"
    );
  };

  getServiceSubscriptionUserMappingAndServiceUserByPatientIdAndDoctorId =
    async (req, res) => {
      let { provider_id, patient_id, provider_type, doctor_id } = req.query;
      // assuming that i am getting patientId,doctor_id, provider_type, provider_id

      patient_id = parseInt(patient_id);
      doctor_id = parseInt(doctor_id);

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
        logger.error("getServiceSubscriptionUserMappingAndServiceUserByPatientIdAndDoctorId 500 error: ", error);
        return raiseServerError(res);
      }

      let data = {};

      if (USER_CATEGORY.PROVIDER === provider_type)
        data = {
          patient_id,
          provider_id: parseInt(provider_id),
          provider_type,
          doctor_id,
        };
      if (USER_CATEGORY.DOCTOR === provider_type)
        data = { patient_id, provider_type, doctor_id };

      const serviceSubscriptionUserMappingService =
        new ServiceSubscriptionUserMappingService();
      let userServicesSubscriptions =
        await serviceSubscriptionUserMappingService.getAllServiceSubscriptionUserMappingByData(
          data
        );
      let response = {};

      for (let userServicesSubscription in userServicesSubscriptions) {
        let subId =
          userServicesSubscriptions[userServicesSubscription][
            "service_subscription_plan_id"
          ];

        let data = { id: subId };

        let serviceSubscriptionService = new ServiceSubscriptionService();

        let serviceSubscription =
          await serviceSubscriptionService.getAllServiceSubscriptionByData(
            data
          );

        const serviceSubscriptionMapping = new ServiceSubscriptionMapping();
        let servicedata = { subscription_plan_id: subId };

        let services =
          await serviceSubscriptionMapping.getAllServiceSubscriptionMappingByData(
            servicedata
          );
        // serviceSubscription.services = {...services};

        response[userServicesSubscriptions[userServicesSubscription]["id"]] = {
          ...serviceSubscription[0],
          details: userServicesSubscriptions[userServicesSubscription],
          services: { ...services },
        };
        // response.push({...serviceSubscription});
      }

      let servicesSubResponse = response;
      // ===============================================================================
      const serviceuserMappingServices = new ServiceUserMappingService();
      let userServices =
        await serviceuserMappingServices.getAllServiceUserMappingByData(data);

      let serviceDatas = [];

      for (let userService in userServices) {
        let serviceData = userServices[userService];
        const serviceOffering = new ServiceOffering();
        let servicedata = { id: serviceData.service_plan_id };
        let doctor_id_for_sub = userServices[userService]["doctor_id"];

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
      logger.debug(`Report : id = ${id}`);
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

      if (body.durations) {
        let expire_date = new Date(req.body.startDate);

        expire_date.setMonth(expire_date.getMonth() + req.body.durations);
        body = { ...body, expire_date };
      }

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
      logger.error("updateServiceSubscriptionUserMapping 500 error: ", error);
      return raiseServerError(res);
    }
  };
}

export default new ServiceSubscriptionUserMappingController();
