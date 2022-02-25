import BaseUserRole from "../../../services/userRoles";

import userRolesService from "../../../services/userRoles/userRoles.service";
import providerService from "../../../services/provider/provider.service";
import doctorService from "../../../services/doctor/doctor.service";
import patientService from "../../../services/patients/patients.service";
import doctorProviderMappingService from "../../../services/doctorProviderMapping/doctorProviderMapping.service";

// --- WRAPPERS
import DoctorWrapper from "../../mobile/doctor";
import ProviderWrapper from "../../mobile/provider";
import DoctorProviderMappingWrapper from "../../web/doctorProviderMapping";
import PatientWrapper from "../../mobile/patient";

import { USER_CATEGORY } from "../../../../constant";

class MUserRoleWrapper extends BaseUserRole {
  constructor(data) {
    super(data);
  }

  getBasicInfo = () => {
    const { _data } = this;
    const {
      id,
      user_identity,
      linked_id,
      linked_with,
      created_at,
      deleted_at,
      updated_at,
    } = _data || {};

    return {
      basic_info: {
        id,
        user_identity,
        linked_id,
        linked_with,
      },
      updated_at,
      deleted_at,
      created_at,
    };
  };

  getAllInfo = async () => {
    const {
      _data: { id, linked_id, linked_with } = {},
      getBasicInfo,
      getUser,
    } = this;

    const { doctor } = getUser() || {};

    let doctors = {};
    let admins = {};
    let providers = {};
    let patients = {};

    if (doctor && doctor.id) {
      const doctorWrapper = await DoctorWrapper(doctor);
      doctors = { ...doctors, [doctor.id]: await doctorWrapper.getAllInfo() };

      if (linked_with === USER_CATEGORY.PROVIDER && linked_id) {
        const providerData = await ProviderWrapper(null, linked_id);

        // user_category_data = {
        //     ...user_category_data ,
        //     linked_provider_id:provider_id,
        //     provider : { [provider_id] : { ...providerAllInfo} }
        //  };
        providers = { [linked_id]: await providerData.getAllInfo() };
      }
    }

    // if (linked_with === USER_CATEGORY.PROVIDER && linked_id) {

    //   const providerData = await ProviderWrapper(null, linked_id);

    //   // user_category_data = {
    //   //     ...user_category_data ,
    //   //     linked_provider_id:provider_id,
    //   //     provider : { [provider_id] : { ...providerAllInfo} }
    //   //  };
    //   providers = { [linked_id]: providerData.getBasicInfo() };
    // }

    // switch (getUserRoleUserCategoryType) {
    //     case USER_CATEGORY.PROVIDER:
    //         const providerData = await providerService.getProviderByData({id:getUserRoleUserCategoryId});
    //         const providerDataWrapper = await  ProviderWrapper(providerData);
    //         const providerAllInfo = await providerDataWrapper.getAllInfo();
    //         const providerId = await providerDataWrapper.getProviderId();

    //         providers = {
    //             [providerId]:{...providerAllInfo}
    //         }

    //         break;
    //     case USER_CATEGORY.DOCTOR:
    //         const doctorData = await doctorService.getDoctorByData({id:getUserRoleUserCategoryId});
    //         const doctorDataWrapper  = await DoctorWrapper(doctorData);
    //         const doctorAllInfo = await doctorDataWrapper.getAllInfo();
    //         const doctorId = await doctorDataWrapper.getDoctorId();
    //         doctors = {
    //             [doctorId]:{...doctorAllInfo}
    //         }
    //         const doctor_id = getUserRoleUserCategoryId;
    //         const doctorProvider = await doctorProviderMappingService.getProviderForDoctor(
    //             doctor_id
    //           );

    //           let provider_id = null ;
    //           if (doctorProvider) {

    //             const doctorProviderWrapper = await DoctorProviderMappingWrapper(
    //               doctorProvider
    //             );
    //             provider_id = await doctorProviderWrapper.getProviderId();

    //             const providerData = await ProviderWrapper(null, provider_id);
    //             const providerAllInfo =await  providerData.getAllInfo();

    //             // user_category_data = {
    //             //     ...user_category_data ,
    //             //     linked_provider_id:provider_id,
    //             //     provider : { [provider_id] : { ...providerAllInfo} }
    //             //  };
    //             providers =  { [provider_id] : { ...providerAllInfo} };
    //           }

    //         break;
    //     case USER_CATEGORY.PATIENT:
    //         const patientData = await patientService.getPatientByData({id:getUserRoleUserCategoryId});
    //         const patientDatawrapper = await PatientWrapper(patientData);
    //         const patietAllInfo = await patientDatawrapper.getAllInfo();
    //         const patientId = await patientDatawrapper.getPatientId();
    //         patients = {
    //             [patientId]:{...patietAllInfo}
    //         }

    //         break;
    //     case USER_CATEGORY.ADMIN:
    //         user_category_data = {};
    //         break;
    //     default:
    //         break;
    // }

    return {
      user_roles: {
        [id]: getBasicInfo(),
      },
      doctors,
      patients,
      providers,
      admins,
    };
  };

  getAllInfoWithImp = async () => {
    const {
      _data: { id, linked_id, linked_with } = {},
      getBasicInfo,
      getUser,
    } = this;

    const { doctor } = getUser() || {};
    let providers = {};

    if (doctor && doctor.id) {
      if (linked_with === USER_CATEGORY.PROVIDER && linked_id) {
        const providerData = await ProviderWrapper(null, linked_id);
        providers = { [linked_id]: await providerData.getAllInfo() };
      }
    }
    return {
      user_roles: {
        [id]: getBasicInfo(),
      },
      providers,
    };
  };
}

export default async (data = null, id = null) => {
  if (data) {
    return new MUserRoleWrapper(data);
  }
  const profile = await userRolesService.getSingleUserRoleByData({ id });
  return new MUserRoleWrapper(profile);
};
