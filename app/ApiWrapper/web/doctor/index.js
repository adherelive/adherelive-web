import BaseDoctor from "../../../services/doctor";
import doctorService from "../../../services/doctor/doctor.service";
import carePlanService from "../../../services/carePlan/carePlan.service";
import ConsentService from "../../../services/consents/consent.service";
import doctorProviderMappingService from "../../../services/doctorProviderMapping/doctorProviderMapping.service";
import { completePath } from "../../../helper/filePath";
import SpecialityWrapper from "../../web/speciality";
import CarePlanWrapper from "../../web/carePlan";
import ConsentWrapper from "../../web/consent";
import DoctorProviderMappingWrapper from "../../web/doctorProviderMapping";
import UserWrapper from "../../web/user";

class DoctorWrapper extends BaseDoctor {
  constructor(data) {
    super(data);
  }

  getReferenceInfo = async () => {
    const { _data, getAllInfo, getDoctorId } = this;
    const { speciality, user } = _data || {};

    let specialityData = {};
    let userData = {};

    if (speciality) {
      const specialityDetails = await SpecialityWrapper(speciality);
      specialityData[specialityDetails.getSpecialityId()] = specialityDetails.getBasicInfo();
    }

    if(user) {
      const users = await UserWrapper(user.get());
      userData[users.getId()] = users.getBasicInfo();
    }

      return {
        doctors: {
          [getDoctorId()] : await getAllInfo()
        },
        specialities: {
          ...specialityData,
        },
        users: {
          ...userData,
        }
      };
  };

  getBasicInfo = () => {
    const { _data } = this;
    const {
      id,
      user_id,
      gender,
      first_name,
      middle_name,
      last_name,
      city,
      speciality_id,
      qualifications,
      activated_on,
      profile_pic,
      signature_pic,
        full_name,
    } = _data || {};
    return {
      basic_info: {
        id,
        user_id,
        gender,
        first_name,
        middle_name,
        last_name,
        full_name,
        city,
        speciality_id,
        profile_pic: completePath(profile_pic),
        signature_pic: completePath(signature_pic)
      },
      qualifications,
      activated_on,
    };
  };

  getAllInfo = async () => {
    const { _data, getDoctorId } = this;
    const {
      id,
      user_id,
      gender,
      first_name,
      middle_name,
      last_name,
      full_name,
      qualifications,
      activated_on,
      profile_pic,
      city,
      speciality_id,
      razorpay_account_id,
      signature_pic
    } = _data || {};

    const consentService = new ConsentService();
    const consents = await consentService.getAllByData({
      doctor_id: getDoctorId()
    });

    const watchlistPatients = await doctorService.getAllWatchlist({
      doctor_id: getDoctorId()
    });

    let watchlist_patient_ids = [];

    if (watchlistPatients.length > 0) {
      for (const watchlist of watchlistPatients) {
        watchlist_patient_ids.push(watchlist.patient_id);
      }
    }

    const patientIds = [];
    if (consents.length > 0) {
      for (const consentData of consents) {
        const consent = await ConsentWrapper({ data: consentData });
        patientIds.push(consent.getPatientId());
      }
    }

    const carePlansDoctor =
      (await carePlanService.getMultipleCarePlanByData({
        doctor_id: getDoctorId()
      })) || [];
    const carePlansPatient =
      (await carePlanService.getMultipleCarePlanByData({
        patient_id: patientIds
      })) || [];

    const carePlanIds = [];

    let carePlans = [...carePlansDoctor, ...carePlansPatient];

    if (carePlans.length > 0) {
      carePlans.sort((carePlanA, carePlanB) => {
        if (carePlanA.get("expired_on")) {
          return -1;
        } else {
          return 1;
        }
      });

      for (const carePlanData of carePlans) {
        const carePlan = await CarePlanWrapper(carePlanData);
        if (!carePlanIds.includes(carePlan.getCarePlanId()))
          carePlanIds.push(carePlan.getCarePlanId());
      }
    }

    const doctorProvider = await doctorProviderMappingService.getProviderForDoctor(
      getDoctorId()
    );

    let providerId = null;
    if (doctorProvider) {
      const doctorProviderWrapper = await DoctorProviderMappingWrapper(
        doctorProvider
      );
      providerId = doctorProviderWrapper.getProviderId();
    }

    return {
      basic_info: {
        id,
        user_id,
        gender,
        first_name,
        middle_name,
        last_name,
        full_name,
        speciality_id,
        profile_pic: completePath(profile_pic),
        signature_pic: completePath(signature_pic)
      },
      city,
      qualifications,
      activated_on,
      care_plan_ids: carePlanIds,
      watchlist_patient_ids,
      razorpay_account_id,
      provider_id: providerId
    };
  };
}

export default async (data = null, id = null) => {
  if (data) {
    return new DoctorWrapper(data);
  }
  const doctor = await doctorService.getDoctorByData({ id });
  return new DoctorWrapper(doctor);
};
