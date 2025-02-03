// Services
import EventService from "../../../services/scheduleEvents/scheduleEvent.service";
import twilioService from "../../../services/twilio/twilio.service";

// Wrapper
import VitalTemplateWrapper from "../../../apiWrapper/mobile/vitalTemplates";
import EventWrapper from "../../../apiWrapper/common/scheduleEvents";
import VitalWrapper from "../../../apiWrapper/mobile/vitals";
import CarePlanWrapper from "../../../apiWrapper/mobile/carePlan";
import DoctorWrapper from "../../../apiWrapper/mobile/doctor";
import PatientWrapper from "../../../apiWrapper/mobile/patient";

import { EVENT_STATUS } from "../../../../constant";

export const syncMedicationReminderStatus = async (
  event_data,
  event_id,
  res
) => {
  try {
    const eventService = new EventService();
    const { status } = event_data;
    let eventDetails = await eventService.getEventByData({ id: event_id });
    let { details = {} } = eventDetails;

    details = { ...details, status };
    eventDetails = { ...eventDetails, ...{ details } };

    const mEventDetails = await eventService.update(eventDetails, event_id);

    const updatedEventDetails = await eventService.getEventByData({
      id: event_id,
    });

    const eventApiDetails = await EventWrapper(updatedEventDetails);

    return eventApiDetails;
  } catch (error) {
    log.info("ERROR in syncing medication reminder status: ");
  }
};

export const syncVitalsResponseData = async (
  event_data,
  createdTime,
  res,
  userRoleId
) => {
  try {
    const eventService = new EventService();
    const { vital_id = null, data = {} } = event_data;

    const { event_id, ...rest } = data || {};

    const event = await EventWrapper(null, event_id);

    const vital = await VitalWrapper({ id: vital_id });

    const vitalTemplate = await VitalTemplateWrapper({
      id: vital.getVitalTemplateId(),
    });

    let { response: prevResponse = [] } = event.getDetails() || {};

    prevResponse.unshift({
      value: rest,
      createdTime,
    });

    const updateEvent = await eventService.update(
      {
        details: {
          ...event.getDetails(),
          response: prevResponse,
        },
        status: EVENT_STATUS.COMPLETED,
      },
      event_id
    );

    const carePlan = await CarePlanWrapper(null, vital.getCarePlanId());
    const doctorRoleId = carePlan.getUserRoleId();
    const doctorData = await DoctorWrapper(null, carePlan.getDoctorId());
    const patientData = await PatientWrapper(null, carePlan.getPatientId());

    let customMessage = `${vitalTemplate.getName()} Vital Update : `;

    for (const template of vitalTemplate.getTemplate()) {
      customMessage += `${template["label"]}: ${
        data[template["id"]] ? data[template["id"]] : "--"
      }${vitalTemplate.getUnit()}   `;
    }

    const twilioMsg = await twilioService.addSymptomMessage(
      doctorRoleId,
      userRoleId,
      customMessage
    );

    const updatedEventDetails = await eventService.getEventByData({
      id: event_id,
    });

    const eventApiDetails = await EventWrapper(updatedEventDetails);

    return {
      syncEventApiDetails: eventApiDetails,
      vitalApiDetails: vital,
      vitalTemplate,
    };
  } catch (error) {
    log.info("error: ", error);
  }
};
