import Controller from "../index";
import Logger from "../../../libs/log";
// services
import TxActivities from "../../services/transactionActivity/transactionActivity.service";
import ServiceSubscription from "../../services/serviceSubscription/serviceSubscription.service";
import ServiceSubscriptionUserMappingService from "../../services/serviceSubscriptionUserMapping/serviceSubscriptionUserMapping.service";
import ServiceUserMapping from "../../services/serviceUserMapping/serviceUserMapping.service";
import ServiceOffering from "../../services/serviceOffering/serviceOffering.service";
import DoctorService from "../../services/doctor/doctor.service";
import PatientService from "../../services/patients/patients.service";
import PatientWrapper from "../../ApiWrapper/web/patient";
import { USER_CATEGORY } from "../../../constant";
const Log = new Logger("WEB > CONTROLLER > Service Offering");

class ServiceSubscriptionTxController extends Controller {
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
    let { status } = req.query;
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
    console.log({ testone: "testvalue" }, req.query);
    if (status) data["status"] = status;

    const txActivitiesService = new TxActivities();
    console.log("testing data is", { data });
    let txActivities = await txActivitiesService.getAllTxActivitiesByData(data);
    console.log(txActivities);
    let response = [];
    for (let i in txActivities) {
      txActivities[i].doctor = await DoctorService.getDoctorByDoctorId(
        txActivities[i].doctor_id
      );
      let users = await PatientService.getPatientById({
        id: txActivities[i].patient_id,
      });
      const patientData = await PatientWrapper(patient);
      console.log({
        myuserdetails: users.user.getBasicInfo,
        patoemtdo: txActivities[i].patient_id,
      });
      console.log("users", users);
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

  updateTxActivities = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      let { params: { id } = {}, body } = req;
      Log.info(`Report : id = ${id}`);
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
      Log.debug("updateService 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new ServiceSubscriptionTxController();
