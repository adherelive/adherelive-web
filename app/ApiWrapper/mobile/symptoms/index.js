import BaseSymptom from "../../../services/symptom";

// SERVICES
import SymptomService from "../../../services/symptom/symptom.service";

// WRAPPERS
import UserWrapper from "../user";
import DoctorWrapper from "../doctor";
import PatientWrapper from "../patient";
import CarePlanWrapper from "../carePlan";

import Logger from "../../../../libs/log";
const Log = new Logger("API_WRAPPER > MOBILE > SYMPTOMS");

class SymptomWrapper extends BaseSymptom {
    constructor(data) {
        super(data);
    }

    getBasicInfo = () => {
        const {_data} = this;
        const {
            id,
            patient_id,
            care_plan_id,
            config,
            text
        } = _data || {};

        return {
            basic_info: {
                id,
                patient_id,
                care_plan_id
            },
            config,
            text
        };
    };

    getReferenceInfo = async () => {
        const {getSymptomId, getBasicInfo, _data} = this;

        const {patient = {}, care_plan = {}} = _data || {};
        const {doctor} = care_plan || {};

        const doctors = await DoctorWrapper(doctor);
        const patients = await PatientWrapper(patient);
        const carePlans = await CarePlanWrapper(care_plan);

        const userData = {};
        const doctorUser = await UserWrapper(null, doctors.getUserId());
        const patientUser = await UserWrapper(null, patients.getUserId());

        userData[`${doctors.getUserId()}`] = doctorUser.getBasicInfo();
        userData[`${patients.getUserId()}`] = patientUser.getBasicInfo();

        return {
            symptoms: {
                [getSymptomId()]: getBasicInfo()
            },
            users: {
                ...userData
            },
            patients: {
                [patients.getPatientId()]: patients.getBasicInfo()
            },
            doctors: {
                [doctors.getDoctorId()]: doctors.getBasicInfo()
            },
            care_plans: {
                [carePlans.getCarePlanId()]: carePlans.getBasicInfo()
            }
        };

        // Log.debug("patient", patient);
        // Log.debug("care_plan", care_plan);
        // Log.debug("doctor", doctor);
    };
}

export default async ({data = null, id = null}) => {
    if(data) {
        return new SymptomWrapper(data);
    }
    const symptom = await SymptomService.getByData({id});
    return new SymptomWrapper(symptom);
};