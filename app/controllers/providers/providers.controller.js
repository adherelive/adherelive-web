import Controller from "../index";
import Log from "../../../libs/log";
import moment from "moment";

import userService from "../../services/user/user.service";
import doctorService from "../../services/doctor/doctor.service";
import providerService from "../../services/provider/provider.service";
import doctorProviderMappingService from "../../services/doctorProviderMapping/doctorProviderMapping.service";

import UserWrapper from "../../ApiWrapper/web/user";
import DoctorWrapper from "../../ApiWrapper/web/doctor";
import ProviderWrapper from "../../ApiWrapper/web/provider";
import DoctorProviderMappingWrapper from "../../ApiWrapper/web/doctorProviderMapping";

import { USER_CATEGORY } from "../../../constant";

const Logger = new Log("WEB > PROVIDERS > CONTROLLER");

class ProvidersController extends Controller {
  constructor() {
    super();
  }

  getAll = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const { userDetails: { userId } = {} } = req;

      const providerData = await providerService.getProviderByData({
        user_id: userId
      });
      const provider = await ProviderWrapper(providerData);
      const providerId = provider.getProviderId();

      let doctorIds = [];
      const doctorProviderMapping = await doctorProviderMappingService.getDoctorProviderMappingByData(
        { provider_id: providerId }
      );

      for (const mappingData of doctorProviderMapping) {
        const mappingWrapper = await DoctorProviderMappingWrapper(mappingData);
        const doctorId = mappingWrapper.getDoctorId();
        doctorIds.push(doctorId);
      }

      console.log("doctor ids got are: ", doctorIds);

      let doctorApiDetails = {};
      let userApiDetails = {};
      let userIds = [];
      let specialityDetails = {};

      for (const doctor of doctorIds) {
        const doctorWrapper = await DoctorWrapper(null, doctor);

        doctorApiDetails[
          doctorWrapper.getDoctorId()
        ] = doctorWrapper.getBasicInfo();
        const { specialities } = await doctorWrapper.getReferenceInfo();
        specialityDetails = { ...specialityDetails, ...specialities };
        userIds.push(doctorWrapper.getUserId());
      }

      //   const userDetails = await userService.getUserByData({
      //     category: USER_CATEGORY.DOCTOR
      //   });

      //   await userDetails.forEach(async user => {
      //     const userWrapper = await UserWrapper(user.get());
      //     userApiDetails[userWrapper.getId()] = userWrapper.getBasicInfo();
      //   });

      return raiseSuccess(
        res,
        200,
        {
          //   users: {
          //     ...userApiDetails
          //   },
          providers: {
            [provider.getProviderId()]: provider.getBasicInfo()
          },
          doctors: {
            ...doctorApiDetails
          },
          specialities: {
            ...specialityDetails
          },
          //   user_ids: userIds,
          doctor_ids: doctorIds
        },
        "doctor details fetched successfully"
      );
    } catch (error) {
      Logger.debug("getall 500 error ", error);
      return raiseServerError(res);
    }
  };
}

export default new ProvidersController();
