import BaseCarePlan from "../../../services/carePlan";
import carePlanService from "../../../services/carePlan/carePlan.service";
import VitalService from "../../../services/vitals/vital.service";
import DietService from "../../../services/diet/diet.service";
// import DoctorService from "../../../services/doctor/doctor.service";
import WorkoutService from "../../../services/workouts/workout.service";
import CarePlanSecondaryDoctorMappingsService from "../../../services/careplanSecondaryDoctorMappings/careplanSecondaryDoctorMappings.service";
import DoctorService from "../../../services/doctor/doctor.service";
// WRAPPERS...
import DoctorWrapper from "../doctor";
import PatientWrapper from "../patient";
import UserRoleWrapper from "../userRoles";
import ProviderWrapper from "../provider";
import { USER_CATEGORY } from "../../../../constant";

class CarePlanWrapper extends BaseCarePlan {
  constructor(data) {
    super(data);
  }

  getBasicInfo = () => {
    const { _data } = this;
    const {
      id,
      doctor_id,
      care_plan_template_id,
      patient_id,
      details,
      activated_on,
      renew_on,
      expired_on,
      user_role_id,
      channel_id,
    } = _data || {};

    return {
      basic_info: {
        id,
        doctor_id,
        patient_id,
        care_plan_template_id,
        user_role_id,
      },
      details,
      activated_on,
      renew_on,
      expired_on,
      channel_id,
    };
  };

  getAllInfo = async () => {
    const { _data, getBasicInfo, getCarePlanId } = this;
    let doctorData = {},
      providersApiData = {},
      userRolesApiData = {};
    const { care_plan_appointments = [], care_plan_medications = [] } =
      _data || {};
    const secondary_doctor_user_role_ids =
      this.getCareplnSecondaryProfiles() || [];
    const vitals =
      (await VitalService.getAllByData({ care_plan_id: getCarePlanId() })) ||
      [];

    const vitalIds = [];
    if (vitals.length > 0) {
      vitals.forEach((vital) => {
        vitalIds.push(vital.get("id"));
      });
    }

    const dietService = new DietService();
    const { rows: diets = [] } =
      (await dietService.findAndCountAll({
        where: { care_plan_id: getCarePlanId() },
        attributes: ["id"],
      })) || {};

    const dietIds = [];

    if (diets.length > 0) {
      diets.forEach((diet) => {
        if (dietIds.indexOf(diet.id) === -1) {
          dietIds.push(diet.id);
        }
      });
    }

    const workoutService = new WorkoutService();
    const { rows: workouts = [] } =
      (await workoutService.findAndCountAll({
        where: { care_plan_id: getCarePlanId() },
        attributes: ["id"],
      })) || {};

    const workoutIds = [];

    if (workouts.length > 0) {
      workouts.forEach((workout) => {
        if (workoutIds.indexOf(workout.id) === -1) {
          workoutIds.push(workout.id);
        }
      });
    }

    // get care plan basci info
    const basic_info = getBasicInfo();

    if (basic_info["basic_info"]["doctor_id"])
      basic_info["basic_info"]["doctor"] =
        await DoctorService.getDoctorByDoctorId(
          basic_info["basic_info"]["doctor_id"]
        );
    // get doctor by doctoriD.

    return {
      ...basic_info,
      appointment_ids: care_plan_appointments.map((appointment) =>
        appointment.get("appointment_id")
      ),
      medication_ids: care_plan_medications.map((medication) =>
        medication.get("medication_id")
      ),
      vital_ids: vitalIds,
      diet_ids: dietIds,
      workout_ids: workoutIds,
      secondary_doctor_user_role_ids,
    };
  };

  getAllSecDocs = async () => {
    const { _data, getBasicInfo, getCarePlanId } = this;
    const secondary_doctor_user_role_ids =
      this.getCareplnSecondaryProfiles() || [];

    const primary_doctor = this.getDoctorId();
    let doctors = {};
    for (let i in secondary_doctor_user_role_ids) {
      doctors[secondary_doctor_user_role_ids[i]] =
        await DoctorService.getDoctorByUserId(
          secondary_doctor_user_role_ids[i]
        );
    }

    let primary_doctor_details = await DoctorService.getDoctorByUserId(
      primary_doctor
    );

    return {
      primary_doctor_details,
      secondary_doctor_user_role_ids,
      doctors,
    };
  };

  getReferenceInfoWithImp = async () => {
    const { _data, getCarePlanId, getAllInfo } = this;
    const secondary_doctor_user_role_ids =
      this.getCareplnSecondaryProfiles() || [];
    return {
      care_plans: {
        [getCarePlanId()]: await getAllInfo(),
      },
    };
  };

  getReferenceInfoWithSecDocDetails = async () => {
    const { _data, getCarePlanId, getAllInfo, getAllSecDocs } = this;
    return {
      care_plans: {
        [getCarePlanId()]: await getAllSecDocs(),
      },
    };
  };

  getReferenceInfo = async () => {
    const { _data, getCarePlanId, getAllInfo } = this;
    const { doctor, patient } = _data || {};

    let doctorData = {},
      providersApiData = {},
      userRolesApiData = {};
    let doctor_id = null;

    if (doctor) {
      const doctors = await DoctorWrapper(doctor);
      doctorData[doctors.getDoctorId()] = await doctors.getAllInfo();
      doctor_id = doctors.getDoctorId();
    }

    let patientData = {};
    let patient_id = null;

    if (patient) {
      const patients = await PatientWrapper(patient);
      patientData[patients.getPatientId()] = await patients.getAllInfo();
      patient_id = patients.getPatientId();
    }

    const secondary_doctor_user_role_ids =
      this.getCareplnSecondaryProfiles() || [];

    if (secondary_doctor_user_role_ids.length) {
      for (let each in secondary_doctor_user_role_ids) {
        const secondary_doctor_role_id = secondary_doctor_user_role_ids[each];
        const userRoleWrapper = await UserRoleWrapper(
          null,
          secondary_doctor_role_id
        );
        const userId = await userRoleWrapper.getUserId();
        const doctor = (await DoctorService.getDoctorByUserId(userId)) || {};
        let doctorWrapper = {};
        if (doctor) {
          doctorWrapper = await DoctorWrapper(doctor);
          doctorData[doctorWrapper.getDoctorId()] =
            await doctorWrapper.getAllInfo();

          if (
            userRoleWrapper.getLinkedId() !== null &&
            userRoleWrapper.getLinkedWith() === USER_CATEGORY.PROVIDER
          ) {
            const providerWrapper = await ProviderWrapper(
              null,
              userRoleWrapper.getLinkedId()
            );
            providersApiData = {
              ...providersApiData,
              [providerWrapper.getProviderId()]: {
                ...providerWrapper.getBasicInfo(),
              },
            };
            userRolesApiData = {
              ...userRolesApiData,
              [userRoleWrapper.getId()]: { ...userRoleWrapper.getBasicInfo() },
            };
          }
        }
      }
    }

    return {
      care_plans: {
        [getCarePlanId()]: await getAllInfo(),
      },
      doctors: {
        ...doctorData,
      },
      patients: {
        ...patientData,
      },
      providers: { ...providersApiData },
      user_roles: { ...userRolesApiData },
      doctor_id,
      patient_id,
      care_plan_id: getCarePlanId(),
    };
  };
}

export default async (data = null, id = null) => {
  if (data) {
    return new CarePlanWrapper(data);
  }
  const carePlan = await carePlanService.getSingleCarePlanByData({ id });
  return new CarePlanWrapper(carePlan);
};
