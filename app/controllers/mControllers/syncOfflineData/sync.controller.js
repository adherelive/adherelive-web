import Controller from "../../index";
import Logger from "../../../../libs/log";
import moment from "moment";

// Services
import medicationReminderService from "../../../services/medicationReminder/mReminder.service";
import EventService from "../../../services/scheduleEvents/scheduleEvent.service";
import twilioService from "../../../services/twilio/twilio.service";

// Wrapper
import MobileMReminderWrapper from "../../../ApiWrapper/mobile/medicationReminder";
import VitalTemplateWrapper from "../../../ApiWrapper/mobile/vitalTemplates";
import EventWrapper from "../../../ApiWrapper/common/scheduleEvents";
import VitalWrapper from "../../../ApiWrapper/mobile/vitals";
import CarePlanWrapper from "../../../ApiWrapper/mobile/carePlan";
import DoctorWrapper from "../../../ApiWrapper/mobile/doctor";
import PatientWrapper from "../../../ApiWrapper/mobile/patient";

import { EVENT_STATUS, EVENT_TYPE, USER_CATEGORY } from "../../../../constant";

const Log = new Logger("MOBILE > SYNC > CONTROLLER");

class SyncController extends Controller {
  constructor() {
    super();
  }

  syncOfflineData = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { body } = req;
      const {
        event_type = null,
        event_data = {},
        event_id = null,
        update_time = null
      } = body;
      Log.debug("data got from body is: ", event_type, event_id);

      if (event_type === EVENT_TYPE.MEDICATION_REMINDER) {
        return this.syncMedicationReminderStatus(event_data, event_id, res);
      } else if (event_type === EVENT_TYPE.VITALS) {
        return this.syncVitalsResponseData(event_data, update_time, res);
      }

      return raiseSuccess(res, 200, {}, "No such event present");
    } catch (error) {
      Log.debug("Sync offline data 500 error: ", error);
      return raiseServerError(res);
    }
  };

  syncMedicationReminderStatus = async (event_data, event_id, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    const { status } = event_data;
    let eventDetails = await EventService.getEventByData({ id: event_id });
    let { details = {} } = eventDetails;

    details = { ...details, ...{ status } };
    eventDetails = { ...eventDetails, ...{ details } };

    const mEventDetails = await EventService.update(eventDetails, event_id);

    const updatedEventDetails = await EventService.getEventByData({
      id: event_id
    });

    const eventApiDetails = await EventWrapper(updatedEventDetails);

    return raiseSuccess(
      res,
      200,
      {
        events: {
          [eventApiDetails.getEventId()]: {
            ...eventApiDetails.getAllInfo()
          }
        }
      },
      "Medication reminder event status updated successfully"
    );
  };

  // syncMedicationReminderStatus = async (event_data, event_id, res) => {
  //   const { raiseSuccess, raiseClientError, raiseServerError } = this;
  //     const { status } = event_data;
  //     let medicationDetails = await medicationReminderService.getMedication({id: event_id});
  //     let { details = {}} = medicationDetails;

  //     details = {...details, ...{status}}
  //     medicationDetails = {...medicationDetails, ...{details}}
  //     const mReminderDetails = await medicationReminderService.updateMedication(
  //         medicationDetails,
  //         event_id
  //     );
  //     const updatedMedicationDetails = await medicationReminderService.getMedication({id: event_id});

  //     const medicationApiDetails = await MobileMReminderWrapper(
  //         updatedMedicationDetails
  //     );

  //     return raiseSuccess(
  //         res,
  //         200,
  //         {
  //             medications: {
  //               [medicationApiDetails.getMReminderId()]: {
  //                 ...medicationApiDetails.getBasicInfo()
  //               }
  //             }
  //         },
  //         "Medication status updated successfully"
  //     );
  // }

  syncVitalsResponseData = async (event_data, createdTime, res) => {
    try {
      Log.debug("Going to sync vitals response data: ", event_data);
      const { raiseSuccess, raiseClientError, raiseServerError } = this;
      const { vital_id = null, data = {} } = event_data;

      const { event_id, ...rest } = data || {};

      Log.info(`event_id ${event_id}`);

      // const createdTime = moment() // todo: take this time from API data.
      //   .utc()
      //   .toISOString();

      const event = await EventWrapper(null, event_id);

      const vital = await VitalWrapper({ id: vital_id });

      Log.info(`vital ${vital.getVitalId()} ${vital.getVitalTemplateId()}`);

      const vitalTemplate = await VitalTemplateWrapper({
        id: vital.getVitalTemplateId()
      });

      Log.info(`event.getStatus() ${event.getStatus()}`);

      if (event.getStatus() === EVENT_STATUS.SCHEDULED) {
        const updateEvent = await EventService.update(
          {
            details: {
              ...event.getDetails(),
              response: {
                value: rest,
                createdTime
              }
            },
            status: EVENT_STATUS.COMPLETED
          },
          event_id
        );
      } else {
        return raiseClientError(
          res,
          422,
          {},
          "Cannot update response for the vital which has passed or has been missed"
        );
      }

      Log.info("above the careplan extraction part:;:");

      const carePlan = await CarePlanWrapper(null, vital.getCarePlanId());

      const doctorData = await DoctorWrapper(null, carePlan.getDoctorId());
      const patientData = await PatientWrapper(null, carePlan.getPatientId());

      let customMessage = `${vitalTemplate.getName()} Vital Update : `;

      for (const template of vitalTemplate.getTemplate()) {
        customMessage += `${template["label"]}: ${
          data[template["id"]] ? data[template["id"]] : "--"
        }${vitalTemplate.getUnit()}   `;
      }

      Log.info("Above the twilio msg part: ");

      const twilioMsg = await twilioService.addSymptomMessage(
        doctorData.getUserId(),
        patientData.getUserId(),
        customMessage
      );

      return raiseSuccess(
        res,
        200,
        {
          ...(await vital.getAllInfo())
        },
        `${vitalTemplate.getName().toUpperCase()} vital updated successfully`
      );
    } catch (error) {
      console.log("$$$$$$$$$$$$ error: ", error);
      return raiseServerError(res);
    }
  };
}

export default new SyncController();
