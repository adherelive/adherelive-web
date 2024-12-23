import BaseCarePlan from "../../../services/carePlan";
import carePlanService from "../../../services/carePlan/carePlan.service";
// import carePlanAppointmentService from "../../../services/carePlanAppointment/carePlanAppointment.service";
// import carePlanMedicationService from "../../../services/carePlanMedication/carePlanMedication.service";
import VitalService from "../../../services/vitals/vital.service";
import DietService from "../../../services/diet/diet.service";
import WorkoutService from "../../../services/workouts/workout.service";
import CarePlanSecondaryDoctorMappingsService from "../../../services/careplanSecondaryDoctorMappings/careplanSecondaryDoctorMappings.service";
import DoctorService from "../../../services/doctor/doctor.service";
// import CarePlanAppointmentWrapper from "../../../apiWrapper/mobile/carePlanAppointment";
import DoctorWrapper from "../../web/doctor";
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
      name,
      doctor_id,
      patient_id,
      details,
      activated_on,
      renew_on,
      expired_on,
      care_plan_template_id,
      user_role_id,
      channel_id,
    } = _data || {};

    return {
      basic_info: {
        id,
        name,
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

    const vitals =
      (await VitalService.getAllByData({
        care_plan_id: getCarePlanId(),
      })) || [];

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

    const secondary_doctor_user_role_ids =
      this.getCareplnSecondaryProfiles() || [];

    return {
      ...getBasicInfo(),
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
      // providers:{ ...providersApiData},
      // user_roles:{ ...userRolesApiData},
      // doctors:{ ...doctorData}
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
      providers: { ...providersApiData },
      user_roles: { ...userRolesApiData },
      doctor_id,
    };
  };

  getReferenceInfoWithImp = async () => {
    const { _data, getCarePlanId, getAllInfo } = this;
    return {
      care_plans: {
        [getCarePlanId()]: await getAllInfo(),
      },
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
