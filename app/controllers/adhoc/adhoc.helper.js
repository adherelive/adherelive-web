import Logger from "../../../libs/log";
import doctorService from "../../services/doctor/doctor.service";
import patientService from "../../services/patients/patients.service";
import providerService from "../../services/provider/provider.service";

// wrappers
import DoctorWrapper from "../../ApiWrapper/web/doctor";
import PatientWrapper from "../../ApiWrapper/web/patient";
import ProviderWrapper from "../../ApiWrapper/web/provider";

import {
    USER_CATEGORY
  } from "../../../constant";

const Log = new Logger("ADHOC > HELPER");

export const getCategoryDetails = async (category, userId) => {
    try {
        let response = {};

        switch(category) {
            case USER_CATEGORY.DOCTOR:
                const doctor = await doctorService.getDoctorByUserId(userId);
                if(doctor) {
                    const doctorWrapper = await DoctorWrapper(doctor);
                    response = {category_id: doctorWrapper.getDoctorId()}
                }
                break;
            case USER_CATEGORY.PROVIDER:
                const provider = await providerService.getProviderByData({user_id: userId});
                if(provider) {
                    const providerWrapper = await ProviderWrapper(provider);
                    response = {category_id: providerWrapper.getProviderId()}
                }
                break;
            case USER_CATEGORY.PATIENT:
                const patient = await patientService.getPatientByUserId(userId);
                if(patient) {
                    const patientWrapper = await PatientWrapper(patient);
                    response = {category_id: patientWrapper.getPatientId()}
                }
                break;
            case USER_CATEGORY.ADMIN:
                response = { category_id: 1} // have only one admin now
                break;
            default:
                break;
        }

        return response;
    } catch(error) {
        Log.debug("getCategoryDetails error", error);
        return null;
    }
};