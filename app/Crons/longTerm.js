import moment from "moment";
import { EVENT_STATUS, EVENT_TYPE } from "../../constant";
import Logger from "../../libs/log";

// services
import medicationService from "../services/medicationReminder/mReminder.service";
import vitalService from "../services/vitals/vital.service";
import EventService from "../services/scheduleEvents/scheduleEvent.service";
import QueueService from "../services/awsQueue/queue.service";
import userRoleService from "../services/userRoles/userRoles.service";
import patientsService from "../services/patients/patients.service";

// wrappers
import VitalWrapper from "../ApiWrapper/mobile/vitals";
import PatientWrapper from "../ApiWrapper/mobile/patient";

const Log = new Logger("LONG_TERM > CRONS");

class LongTerm {
  getuserFromRole = async (roleId) => {
    try {
        const userRoles = await userRoleService.findOne({
          where: {id: roleId}
        });

        const {user_identity} = userRoles || {};

        return user_identity;
    } catch(error) {
      Log.debug("getuserFromRole error", error);
      throw error;
    }
  };

  getMedications = async () => {
    try {
      let medicationIds = [];
      const allMedications =
        (await medicationService.getAllMedicationByData({ end_date: null })) ||
        [];

      if (allMedications.length > 0) {
        for (const medication of allMedications) {
          const { id } = medication || {};
          medicationIds.push(id);
        }
      }

      return medicationIds;
    } catch (error) {
      Log.debug("getMedications error", error);
      throw error;
    }
  };

  getVitals = async () => {
    try {
      let vitalIds = [];
      const allVitals =
        (await vitalService.getAllByData({ end_date: null })) || [];

      if (allVitals.length > 0) {
        for (const vital of allVitals) {
          const { id } = vital || {};
          vitalIds.push(id);
        }
      }

      return vitalIds;
    } catch (error) {
      Log.debug("getVitals error", error);
      throw error;
    }
  };

  createMedicationEvents = async (medicationId) => {
    try {
      const eventService = new EventService();

      const medication = await medicationService.getMedication({
        id: medicationId,
      });

      const scheduleEvent =
        (await eventService.getEventByData({
          event_id: medicationId,
          event_type: EVENT_TYPE.MEDICATION_REMINDER,
        })) || null;

      const { details: { actor, participants = [] } = {} } =
        scheduleEvent || {};

      const { details, details: { when_to_take } = {} } = medication || {};

      const { id: actorId } = actor || {};

      let patientUserRoleId = null;
      for (const participant of participants) {
        if (participant !== user_role_id) {
          patientUserRoleId = participant;
          break;
        }
      }

      const patientUserId = await this.getuserFromRole(patientUserRoleId);

      // const patientData = await patientsService.getPatientByUserId(patientUserId);

      // const patient = await PatientWrapper(patientData);

      const eventScheduleData = {
        patient_id: patientUserId,
        type: EVENT_TYPE.MEDICATION_REMINDER,
        event_id: medicationId,
        details,
        //   status: EVENT_STATUS.SCHEDULED,
        start_date: moment()
          .utc()
          .toISOString(),
        end_date: null,
        when_to_take,
        participants,
        actor,
        participant_one: patientUserId,
        participant_two: actorId,
      };

      const queueService = new QueueService();
      await queueService.sendMessage(eventScheduleData);
    } catch (error) {
      Log.debug("createMedicationEvents error", error);
      throw error;
    }
  };

  createVitalEvents = async (vitalId) => {
    try {
      const eventService = new EventService();

      const vital = await vitalService.getByData({
        id: vitalId,
      });

      const scheduleEvent =
        (await eventService.getEventByData({
          event_id: vitalId,
          event_type: EVENT_TYPE.VITALS,
        })) || null;

      const { details: { actor, participants = [] } = {} } =
        scheduleEvent || {};

      const vitals = await VitalWrapper({data: vital});

      const { id: actorId, user_role_id } = actor || {};

      let patientUserRoleId = null;
      for (const participant of participants) {
        if (participant !== user_role_id) {
          patientUserRoleId = participant;
          break;
        }
      }

      const patientUserId = await this.getuserFromRole(patientUserRoleId);

      const patientData = await patientsService.getPatientByUserId(patientUserId);

      const {id: patientId} = patientData || {};

      // const patient = await PatientWrapper(patientData);

      const {vital_templates} = await vitals.getReferenceInfo();

      const eventScheduleData = {
        type: EVENT_TYPE.VITALS,
        patient_id: patientId,
        patientUserId,
        event_id: vitalId,
        event_type: EVENT_TYPE.VITALS,
        critical: false,
        start_date: moment().utc().toISOString(),
        end_date: null,
        details: vitals.getBasicInfo(),
        participants,
        actor,
        vital_templates: vital_templates[vitals.getVitalTemplateId()],
      };

      // Log.debug("eventScheduleData", eventScheduleData);

      const queueService = new QueueService();
      await queueService.sendMessage(eventScheduleData);
    } catch (error) {
      Log.debug("createVitalEvents error", error);
      throw error;
    }
  };

  observer = async () => {
    try {
      const eventService = new EventService();

      // medications
      const medicationIds = await this.getMedications();

      Log.debug("medicationIds", medicationIds);

      if (medicationIds.length > 0) {
        for (const medicationId of medicationIds) {
          const scheduleEvents =
            (await eventService.getAllEventByData({
              event_id: medicationId,
              event_type: EVENT_TYPE.MEDICATION_REMINDER,
              status: EVENT_STATUS.PENDING,
            })) || [];

          Log.debug("scheduleEvents", scheduleEvents.length);

          if (scheduleEvents.length === 0) {
            await this.createMedicationEvents(medicationId);
          }
        }
      }

      // vitals
      const vitalIds = await this.getVitals();

      Log.debug("vitalIds", vitalIds);

      if (vitalIds.length > 0) {
        for (const vitalId of vitalIds) {
          const scheduleEvents =
            (await eventService.getAllEventByData({
              event_id: vitalId,
              event_type: EVENT_TYPE.VITALS,
              status: EVENT_STATUS.PENDING,
            })) || [];

          Log.debug("vitalIds scheduleEvents", scheduleEvents.length);

          if (scheduleEvents.length === 0) {
            await this.createVitalEvents(vitalId);
          }
        }
      }
    } catch (error) {
      Log.debug("observer error", error);
      throw error;
    }
  };
}

export default new LongTerm();
