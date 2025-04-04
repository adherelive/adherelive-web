import moment from "moment";
import { EVENT_STATUS, EVENT_TYPE } from "../../constant";
import { createLogger } from "../../libs/logger";

// services
import medicationService from "../services/medicationReminder/mReminder.service";
import vitalService from "../services/vitals/vital.service";
import EventService from "../services/scheduleEvents/scheduleEvent.service";
import QueueService from "../services/awsQueue/queue.service";
import userRoleService from "../services/userRoles/userRoles.service";
import patientsService from "../services/patients/patients.service";
import DietService from "../services/diet/diet.service";
import WorkoutService from "../services/workouts/workout.service";

// wrappers
import VitalWrapper from "../apiWrapper/mobile/vitals";

const logger = createLogger("LONG_TERM > CRON-JOBS");

class LongTerm {
  getUserFromRole = async (roleId) => {
    try {
      const userRoles = await userRoleService.findOne({
        where: { id: roleId },
      });

      const { user_identity } = userRoles || {};

      return user_identity;
    } catch (error) {
      logger.error("getUserFromRole error in LongTerm: ", error);
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
      logger.error("getMedications error in LongTerm: ", error);
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
      logger.error("getVitals error in LongTerm: ", error);
      throw error;
    }
  };

  getDiets = async () => {
    try {
      const dietService = new DietService();
      let dietIds = [];
      const { rows: allDiets = [] } =
        (await dietService.findAndCountAll({ where: { end_date: null } })) ||
        [];

      if (allDiets.length > 0) {
        for (const diet of allDiets) {
          const { id } = diet || {};
          dietIds.push(id);
        }
      }

      return dietIds;
    } catch (error) {
      logger.error("getDiets error in LongTerm: ", error);
      throw error;
    }
  };

  getWorkouts = async () => {
    try {
      const workoutService = new WorkoutService();
      let workoutIds = [];
      const { rows: allWorkouts = [] } =
        (await workoutService.findAndCountAll({ where: { end_date: null } })) ||
        [];

      if (allWorkouts.length > 0) {
        for (const diet of allWorkouts) {
          const { id } = diet || {};
          workoutIds.push(id);
        }
      }

      return workoutIds;
    } catch (error) {
      logger.error("getWorkouts error in LongTerm: ", error);
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

      const { user_role_id } = actor || {};

      let patientUserRoleId = null;
      for (const participant of participants) {
        if (participant !== user_role_id) {
          patientUserRoleId = participant;
          break;
        }
      }

      const patientUserId = await this.getUserFromRole(patientUserRoleId);
      if (!patientUserId) return;
      // const patientData = await patientsService.getPatientByUserId(patientUserId);
      // const patient = await PatientWrapper(patientData);

      const eventScheduleData = {
        patient_id: patientUserId,
        type: EVENT_TYPE.MEDICATION_REMINDER,
        event_id: medicationId,
        details,
        // status: EVENT_STATUS.SCHEDULED,
        start_date: moment().utc().toISOString(),
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
      logger.error("createMedicationEvents error in LongTerm: ", error);
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

      const vitals = await VitalWrapper({ data: vital });

      // const {id: actorId, user_role_id} = actor || {};
      const { id: actorId } = actor || {};

      const { user_role_id } = actor || {};

      let patientUserRoleId = null;
      for (const participant of participants) {
        logger.debug("participant in LongTerm: ", participant);
        if (participant !== user_role_id) {
          patientUserRoleId = participant;
          break;
        }
      }

      const patientUserId = await this.getUserFromRole(patientUserRoleId);
      logger.debug("patientUserId in LongTerm: ", patientUserId);

      if (!patientUserId) return;
      const patientData = await patientsService.getPatientByUserId(
        patientUserId
      );

      const { id: patientId } = patientData || {};
      // const patient = await PatientWrapper(patientData);

      const { vital_templates } = await vitals.getReferenceInfo();
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
      logger.debug("createVitalEvents eventScheduleData: ", eventScheduleData);

      const queueService = new QueueService();
      logger.debug("8");
      await queueService.sendMessage(eventScheduleData);
    } catch (error) {
      logger.error("createVitalEvents error", error);
      throw error;
    }
  };

  createDietEvents = async (dietId) => {
    try {
      const eventService = new EventService();

      const scheduleEvent =
        (await eventService.getEventByData({
          event_id: dietId,
          event_type: EVENT_TYPE.DIET,
        })) || null;

      logger.debug("dietId, scheduleEvent in LongTerm: ", dietId, scheduleEvent);

      const { details: { actor, participants = [] } = {} } =
        scheduleEvent || {};

      const { user_role_id } = actor || {};

      let patientUserRoleId = null;
      for (const participant of participants) {
        if (participant !== user_role_id) {
          patientUserRoleId = participant;
          break;
        }
      }

      const patientUserId = await this.getUserFromRole(patientUserRoleId);
      if (!patientUserId) return;
      const eventScheduleData = {
        patient_id: patientUserId,
        type: EVENT_TYPE.DIET,
        event_id: dietId,
        start_date: moment().utc().toISOString(),
        end_date: null,
        participants,
        actor,
      };
      logger.debug(
        "createDietEvents eventScheduleData in LongTerm: ",
        eventScheduleData
      );

      const queueService = new QueueService();
      await queueService.sendMessage(eventScheduleData);
    } catch (error) {
      logger.error("createDietEvents error in LongTerm: ", error);
      throw error;
    }
  };

  createWorkoutEvents = async (workoutId) => {
    try {
      const eventService = new EventService();

      const scheduleEvent =
        (await eventService.getEventByData({
          event_id: workoutId,
          event_type: EVENT_TYPE.WORKOUT,
        })) || null;

      const { details: { actor, participants = [] } = {} } =
        scheduleEvent || {};

      const { user_role_id } = actor || {};

      let patientUserRoleId = null;
      for (const participant of participants) {
        if (participant !== user_role_id) {
          patientUserRoleId = participant;
          break;
        }
      }

      const patientUserId = await this.getUserFromRole(patientUserRoleId);
      if (!patientUserId) return;
      const eventScheduleData = {
        patient_id: patientUserId,
        type: EVENT_TYPE.WORKOUT,
        event_id: workoutId,
        start_date: moment().utc().toISOString(),
        end_date: null,
        participants,
        actor,
      };
      logger.debug(
        "createWorkoutEvents eventScheduleData in LongTerm: ",
        eventScheduleData
      );

      const queueService = new QueueService();
      await queueService.sendMessage(eventScheduleData);
    } catch (error) {
      logger.error("createWorkoutEvents error in LongTerm: ", error);
      throw error;
    }
  };

  runObserver = async () => {
    try {
      const eventService = new EventService();

      // medications
      const medicationIds = await this.getMedications();

      logger.debug("runObserver in LongTerm ---> medicationIds: ", medicationIds);

      if (medicationIds.length > 0) {
        for (const medicationId of medicationIds) {
          const scheduleEvent =
            (await eventService.getEventByData({
              event_id: medicationId,
              event_type: EVENT_TYPE.MEDICATION_REMINDER,
            })) || null;

          if (scheduleEvent) {
            const scheduleEvents =
              (await eventService.getAllEventByData({
                event_id: medicationId,
                event_type: EVENT_TYPE.MEDICATION_REMINDER,
                status: EVENT_STATUS.PENDING,
              })) || [];

            if (scheduleEvents.length === 0) {
              await this.createMedicationEvents(medicationId);
            }
          }
        }
      }

      // vitals
      const vitalIds = await this.getVitals();

      logger.debug("runObserver in LongTerm ---> vitalIds: ", vitalIds);

      if (vitalIds.length > 0) {
        for (const vitalId of vitalIds) {
          const scheduleEvent =
            (await eventService.getEventByData({
              event_id: vitalId,
              event_type: EVENT_TYPE.VITALS,
            })) || null;

          if (scheduleEvent) {
            const scheduleEvents =
              (await eventService.getAllEventByData({
                event_id: vitalId,
                event_type: EVENT_TYPE.VITALS,
                status: EVENT_STATUS.PENDING,
              })) || [];

            if (scheduleEvents.length === 0) {
              await this.createVitalEvents(vitalId);
            }
          }
        }
      }

      // diets
      const dietIds = await this.getDiets();

      logger.debug("observer dietIds in LongTerm: ", dietIds);

      if (dietIds.length > 0) {
        for (const dietId of dietIds) {
          const scheduleEvent =
            (await eventService.getEventByData({
              event_id: dietId,
              event_type: EVENT_TYPE.DIET,
            })) || null;

          if (scheduleEvent) {
            const scheduleEvents =
              (await eventService.getEventByData({
                event_id: dietId,
                event_type: EVENT_TYPE.DIET,
                status: EVENT_STATUS.PENDING,
              })) || [];

            logger.debug(
              "observer dietIds scheduleEvents length in LongTerm: ",
              scheduleEvents.length
            );
            if (scheduleEvents.length === 0) {
              await this.createDietEvents(dietId);
            }
          }
        }
      }

      // workouts
      const workoutIds = await this.getWorkouts();

      logger.debug("observer workoutIds in LongTerm: ", workoutIds);

      if (workoutIds.length > 0) {
        for (const workoutId of workoutIds) {
          const scheduleEvent =
            (await eventService.getEventByData({
              event_id: workoutId,
              event_type: EVENT_TYPE.WORKOUT,
            })) || null;

          if (scheduleEvent) {
            const scheduleEvents =
              (await eventService.getAllEventByData({
                event_id: workoutId,
                event_type: EVENT_TYPE.WORKOUT,
                status: EVENT_STATUS.PENDING,
              })) || [];

            if (scheduleEvents.length === 0) {
              await this.createWorkoutEvents(workoutId);
            }
          }
        }
      }
    } catch (error) {
      logger.error("Error running observer in LongTerm: ", error);
      throw error;
    }
  };
}

export default new LongTerm();
