// Services
import { createLogger } from "../../../libs/log";
import doctorService from "../../services/doctor/doctor.service";
import patientService from "../../services/patients/patients.service";
import providerService from "../../services/provider/provider.service";

// Wrappers
import DoctorWrapper from "../../apiWrapper/web/doctor";
import PatientWrapper from "../../apiWrapper/web/patient";
import ProviderWrapper from "../../apiWrapper/web/provider";

import { USER_CATEGORY } from "../../../constant";

const log = createLogger("ADHOC > HELPER");

export const getLinkDetails = async (category, userId) => {
  try {
    let response = {};

    switch (category) {
      case USER_CATEGORY.DOCTOR:
        const doctor = await doctorService.getDoctorByUserId(userId);
        if (doctor) {
          const doctorWrapper = await DoctorWrapper(doctor);
          const { provider_id } = await doctorWrapper.getAllInfo();
          if (provider_id) {
            response = {
              linked_id: provider_id,
              linked_with: USER_CATEGORY.PROVIDER,
            };
          } else {
            response = { linked_id: null, linked_with: null };
          }
        }
        break;
      default:
        response = { linked_id: null, linked_with: null };
    }

    return response;
  } catch (error) {
    log.debug("getLinkDetails error", error);
    return null;
  }
};

export const getUserDetails = async (category, categoryId) => {
  try {
    let response = {};

    switch (category) {
      case USER_CATEGORY.DOCTOR:
        const doctor =
          (await doctorService.findOne({
            where: { id: categoryId },
            attributes: ["user_id"],
          })) || null;

        const { user_id: doctorUserId } = doctor || {};
        response = { user_id: doctorUserId };
        break;
      case USER_CATEGORY.PATIENT:
        const patient = await patientService.getPatientById(categoryId);
        const patientWrapper = await PatientWrapper(patient);
        const patientUserId = patientWrapper.getUserId();
        response = { user_id: patientUserId };
        break;
      case USER_CATEGORY.PROVIDER:
        const providers = await providerService.getProviderByData({
          id: categoryId,
        });
        if (providers && providers.length) {
          const providerWrapper = await ProviderWrapper(providers[0]);
          const providerUserId = providerWrapper.getUserId();
          response = { user_id: providerUserId };
        }
        break;
      default:
        response = { user_id: null };
    }

    return response;
  } catch (error) {
    log.debug("getLinkDetails error", error);
    return null;
  }
};
