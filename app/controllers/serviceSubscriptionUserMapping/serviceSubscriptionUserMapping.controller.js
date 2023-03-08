import Controller from "../index";
import Logger from "../../../libs/log";
// services
import ServiceSubscriptionUserMappingService from "../../services/serviceSubscriptionUserMapping/serviceSubscriptionUserMapping.service";
import ServiceUserMappingService from "../../services/serviceUserMapping/serviceUserMapping.service";
import ServiceSubscriptionService from "../../services/serviceSubscription/serviceSubscription.service";
import ServiceSubscriptionMapping from "../../services/serviceSubscriptionMapping/serviceSubscritpionMapping.service";
import ServiceOffering from "../../services/serviceOffering/serviceOffering.service";
import TxService from "../../services/serviceSubscribeTranaction/serviceSubscribeTranaction";
import doctorService from "../../services/doctor/doctor.service";
import providerService from "../../services/provider/provider.service";
import ProviderWrapper from "../../ApiWrapper/web/provider";
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
    console.log({ data });
    let userServicesSubscriptions =
      await serviceSubscriptionUserMappingService.getAllServiceSubscriptionUserMappingByData(
        data
      );
    let response = {};

    console.log("userServicesSubscriptions", userServicesSubscriptions);
    let doctors = {};
    let doctorsInproviders = {};
    for (let userServicesSubscription in userServicesSubscriptions) {
      let doctor_id_for_sub =
        userServicesSubscriptions[userServicesSubscription]["doctor_id"];
      let doctory_provider_type =
        userServicesSubscriptions[userServicesSubscription]["provider_type"];
      console.log("===================================");
      console.log({ userServicesSubscription });
      console.log({ doctors, doctor_id_for_sub });
      console.log("===================================");
      console.log(userServicesSubscription);
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
        ...userServicesSubscriptions[userServicesSubscription],
        subscriptions: { ...serviceSubecription[0] },
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
      console.log(serviceData);

      const serviceOffering = new ServiceOffering();
      let servicedata = { id: serviceData.service_plan_id };
      let doctor_id_for_sub = userServices[userService]["doctor_id"];
      let doctory_provider_type = userServices[userService]["provider_type"];
      console.log({ doctor_id_for_sub });
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

    console.log("userServicesSubscriptions", userServicesSubscriptions);
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
        console.log("doctor is in provider.");
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

        console.log(doctorsInproviders[doctor_id_for_sub]);
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

      console.log(
        "getServiceSubscriptionUserMappingAndServiceUserByPatientIdAndDoctorId called"
      );
      console.log({ provider_id, patient_id, provider_type, doctor_id });
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

      console.log("===================");
      console.log({ data });
      console.log("===================");
      const serviceSubscriptionUserMappingService =
        new ServiceSubscriptionUserMappingService();
      console.log({ data });
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
          await serviceSubscriptionService.getAllServiceSubscriptionByData(
            data
          );

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
        let doctor_id_for_sub = userServices[userService]["doctor_id"];
        console.log({ doctor_id_for_sub });

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

      if (body.durations) {
        let expire_date = new Date(req.body.start_date);
        expire_date.setMonth(expire_date.getMonth() + req.body.durations);
        body = { ...body, expire_date }
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
      Log.debug("updateService 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new ServiceSubscriptionUserMappingController();
