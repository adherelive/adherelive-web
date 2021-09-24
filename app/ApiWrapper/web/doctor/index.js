import { Op } from "sequelize";

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
import userRoleService from "../../../services/userRoles/userRoles.service";
import UserRoleWrapper from "../../web/userRoles";
import DoctorPatientWatchlistService from "../../../services/doctorPatientWatchlist/doctorPatientWatchlist.service";
import DoctorPatientWatchlistWrapper from "../../web/doctorPatientWatchlist";

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
      specialityData[
        specialityDetails.getSpecialityId()
      ] = specialityDetails.getBasicInfo();
    }

    if (user) {
      const users = await UserWrapper(user.get());
      userData[users.getId()] = users.getBasicInfo();
    }

    return {
      doctors: {
        [getDoctorId()]: await getAllInfo()
      },
      specialities: {
        ...specialityData
      },
      users: {
        ...userData
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
      full_name
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
      activated_on
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
    // const consents = await consentService.getAllByData({
    //   doctor_id: getDoctorId()
    // });

    const watchlistPatients = await doctorService.getAllWatchlist({
      doctor_id: getDoctorId()
    });

    let watchlist_patient_ids = [];

    if (watchlistPatients.length > 0) {
      for (const watchlist of watchlistPatients) {
        watchlist_patient_ids.push(watchlist.patient_id);
      }
    }

    // const patientIds = [];
    // if (consents.length > 0) {
    //   for (const consentData of consents) {
    //     const consent = await ConsentWrapper({ data: consentData });
    //     patientIds.push(consent.getPatientId());
    //   }
    // }

    const doctorUserId = this.getUserId();
    const UserRole = await userRoleService.getFirstUserRole(doctorUserId);
    let userRoleId = null;
    if (UserRole) {
      const userRoleWrapper = await UserRoleWrapper(UserRole);
      userRoleId = await userRoleWrapper.getId();
    }

    // get all user roles
    const { rows: userRoles } =
      (await userRoleService.findAndCountAll({
        where: {
          user_identity: this.getUserId()
        },
        attributes: ["id"]
      })) || [];

    const userRoleIds = userRoles.map(userRole => userRole.id);

    let carePlanIds = {};
    let watchlistPatientIds = {};

    for (let index = 0; index < userRoleIds.length; index++) {
      let patientIds = [];

      const consents = await consentService.getAllByData({
        user_role_id: userRoleIds[index]
      });

      if (consents.length > 0) {
        for (const consentData of consents) {
          const consent = await ConsentWrapper({ data: consentData });
          patientIds.push(consent.getPatientId());
        }
      }

      const watchlistRecords = await DoctorPatientWatchlistService.getAllByData(
        { user_role_id: userRoleIds[index] }
      );
      const userRoleId = userRoleIds[index];
      let curreRoleIdPatientIds = [];
      if (watchlistRecords && watchlistRecords.length) {
        for (let i = 0; i < watchlistRecords.length; i++) {
          const watchlistWrapper = await DoctorPatientWatchlistWrapper(
            watchlistRecords[i]
          );
          const patient_id = await watchlistWrapper.getPatientId();
          curreRoleIdPatientIds.push(patient_id);
        }

        watchlistPatientIds[userRoleId] = [...curreRoleIdPatientIds];
      }

      const { rows: doctorCarePlans } =
        (await carePlanService.findAndCountAll({
          where: {
            [Op.or]: [
              { user_role_id: userRoleIds[index] },
              { patient_id: patientIds }
            ]
          },
          order: [["expired_on", "ASC"]],
          attributes: ["id"],
          userRoleId: userRoleIds[index]
        })) || [];

      const { rows: doctorCarePlans } =
        (await carePlanService.findAndCountAll({
          where: {
            [Op.or]: [
              { user_role_id: userRoleIds[index] },
              { patient_id: patientIds }
            ]
          },
          order: [["expired_on", "ASC"]],
          attributes: ["id"],
          userRoleId: userRoleIds[index]
        })) || [];

      carePlanIds[userRoleIds[index]] = [
        ...new Set(doctorCarePlans.map(carePlan => carePlan.id))
      ];
    }

    // const carePlansDoctor =
    //   (await carePlanService.getMultipleCarePlanByData({
    //     user_role_id:userRoleId
    //   })) || [];
    // const carePlansPatient =
    // await carePlanService.findAndCountAll({
    //   where: {
    //     patient_id: patientIds,
    //   },
    //   attributes: ["id"]
    // }) || [];

    // careplanPatientIds = carePlansPatient.map(careplan => careplan.id);

    // const carePlanIds = [];

    // Object.keys(carePlanIds).forEach(roleId => {
    //   const temp = carePlanIds[roleId] || [];
    //   carePlanIds[roleId] = [...new Set([...temp, ...careplanPatientIds])];
    // });

    // let carePlans = [...carePlansDoctor, ...carePlansPatient];

    // if (carePlans.length > 0) {
    //   carePlans.sort((carePlanA, carePlanB) => {
    //     if (carePlanA.get("expired_on")) {
    //       return -1;
    //     } else {
    //       return 1;
    //     }
    //   });

    //   for (const carePlanData of carePlans) {
    //     const carePlan = await CarePlanWrapper(carePlanData);
    //     if (!carePlanIds.includes(carePlan.getCarePlanId()))
    //       carePlanIds.push(carePlan.getCarePlanId());
    //   }
    // }

    // const doctorProvider = await doctorProviderMappingService.getProviderForDoctor(
    //   getDoctorId()
    // );

    // let providerId = null;
    // if (doctorProvider) {
    //   const doctorProviderWrapper = await DoctorProviderMappingWrapper(
    //     doctorProvider
    //   );
    //   providerId = doctorProviderWrapper.getProviderId();
    // }

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
      watchlist_ids: watchlistPatientIds
      // provider_id: providerId
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
