import Logger from "../../libs/log";
import minioService from "../services/minio/minio.service";
import md5 from "js-md5";
import { completePath } from "../helper/filePath";
import { EVENT_TYPE } from "../../constant";

import CareplanWrapper from "../ApiWrapper/web/carePlan";
import PatientWrapper from "../ApiWrapper/web/patient";
import DietWrapper from "../ApiWrapper/web/diet";
import VitalWrapper from "../ApiWrapper/web/vitals";

import carePlanAppointmentService from "../services/carePlanAppointment/carePlanAppointment.service";

const Log = new Logger("CRON > HELPER");

export const uploadDocument = async ({
  buffer,
  fileName,
  id,
  folder,
  doHashing,
}) => {
  try {
      Log.info(`fileName : ${fileName}`);
      await minioService.createBucket();

      let hash = md5.create();
      hash.update(id);
      hash.hex();
      hash = String(hash);

      const subfolder = doHashing? hash.substring(4): id;

      const encodedFileName = subfolder + "/" + fileName;

      Log.info(`encodedFileName :: ${encodedFileName}`);

      const filePath = `${folder}/${encodedFileName}`;
      Log.info(`filePath :: ${filePath}`);

      await minioService.saveBufferObject(buffer, filePath, null);
      return completePath(`/${filePath}`);
  } catch(error) {
      Log.debug("uploadDocument catch error", error);
      throw error;
  }
};

export const getNotificationUsers = async (type, event_id) => {
  try {
    switch (type) {
      case EVENT_TYPE.APPOINTMENT:
        return appointmentUsers(event_id);
      case EVENT_TYPE.MEDICATION_REMINDER:
        return await medicationUsers(event_id);
      case EVENT_TYPE.VITALS:
        return await vitalUsers(event_id);
      case EVENT_TYPE.DIET:
        return await dietUsers(event_id);
      case EVENT_TYPE.WORKOUT:
        return await workoutUsers(event_id);
      case EVENT_TYPE.CARE_PLAN_ACTIVATION:
        return await careplanActivationUsers(event_id);
      default:
        return [];
    }
  } catch (error) {
    throw error;
  }
};

const appointmentUsers = async (appointment_id) => {
  try {
    const careplanAppointment =
      (await carePlanAppointmentService.getCareplanByAppointment({
        appointment_id,
      })) || {};

    const { care_plan_id } = await careplanAppointment;

    const carePlan = await CareplanWrapper(null, care_plan_id);

    const patient = await PatientWrapper(null, carePlan.getPatientId());
    const { user_role_id: patientUserRoleId } = await patient.getAllInfo();

    return [
      patientUserRoleId,
      carePlan.getUserRoleId(),
      ...carePlan.getCareplnSecondaryProfiles(),
    ];
  } catch (error) {
    throw error;
  }
};

const dietUsers = async (diet_id) => {
  try {

  } catch(error) {
    throw error;
  }
};

const workoutUsers = async (workout_id) => {};

const medicationUsers = async (medication_id) => {};

const vitalUsers = async (vital_id) => {
  try {
    const vital = await VitalWrapper({id: vital_id});
    const carePlan = await CareplanWrapper(null, vital.getCarePlanId());

    const patient = await PatientWrapper(null, carePlan.getPatientId());
    const { user_role_id: patientUserRoleId } = await patient.getAllInfo();

    return [
      patientUserRoleId,
      carePlan.getUserRoleId(),
      ...carePlan.getCareplnSecondaryProfiles(),
    ];
  } catch(error) {
    throw error;
  }
};

const careplanActivationUsers = async (care_plan_id) => {};
