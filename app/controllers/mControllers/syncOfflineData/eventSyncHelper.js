// Services
import EventService from "../../../services/scheduleEvents/scheduleEvent.service";
import twilioService from "../../../services/twilio/twilio.service";

// Wrapper
import VitalTemplateWrapper from "../../../ApiWrapper/mobile/vitalTemplates";
import EventWrapper from "../../../ApiWrapper/common/scheduleEvents";
import VitalWrapper from "../../../ApiWrapper/mobile/vitals";
import CarePlanWrapper from "../../../ApiWrapper/mobile/carePlan";
import DoctorWrapper from "../../../ApiWrapper/mobile/doctor";
import PatientWrapper from "../../../ApiWrapper/mobile/patient";

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
    console.log("ERROR in syncing medication reminder status: ", error);
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

    console.log(`event_id ${event_id}`);

    const event = await EventWrapper(null, event_id);

    const vital = await VitalWrapper({ id: vital_id });

    console.log(`vital ${vital.getVitalId()} ${vital.getVitalTemplateId()}`);

    const vitalTemplate = await VitalTemplateWrapper({
      id: vital.getVitalTemplateId(),
    });

    console.log(`event.getStatus() ${event.getStatus()}`);

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
    console.log("$$$$$$$$$$$$ error: ", error);
  }
};
