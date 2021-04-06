import Logger from "../../../libs/log";
import doctorService from "../../services/doctor/doctor.service";

// wrappers
import DoctorWrapper from "../../ApiWrapper/web/doctor";

import {
    USER_CATEGORY
  } from "../../../constant";

const Log = new Logger("ADHOC > HELPER");

export const getLinkDetails = async (category, userId) => {
    try {
        let response = {};

        switch(category) {
            case USER_CATEGORY.DOCTOR:
                const doctor = await doctorService.getDoctorByUserId(userId);
                if(doctor) {
                    const doctorWrapper = await DoctorWrapper(doctor);
                    const {provider_id} = await doctorWrapper.getAllInfo();
                    if(provider_id) {
                        response = {linked_id: provider_id, linked_with: USER_CATEGORY.PROVIDER}
                    } else {
                        response = {linked_id: null, linked_with: null}
                    } 
                }
                break;
            default:
                response = {linked_id: null, linked_with: null};
        }

        return response;
    } catch(error) {
        Log.debug("getLinkDetails error", error);
        return null;
    }
};