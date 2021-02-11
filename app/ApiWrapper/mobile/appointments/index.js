import BaseAppointment from "../../../services/appointment";
import {
  EVENT_STATUS,
  EVENT_TYPE,
  DOCUMENT_PARENT_TYPE
} from "../../../../constant";

import appointmentService from "../../../services/appointment/appointment.service";
import carePlanAppointmentService from "../../../services/carePlanAppointment/carePlanAppointment.service";
import ScheduleEventService from "../../../services/scheduleEvents/scheduleEvent.service";
import documentService from "../../../services/uploadDocuments/uploadDocuments.service";

import EventWrapper from "../../common/scheduleEvents";
import UploadDocumentWrapper from "../../mobile/uploadDocument";

class MAppointmentWrapper extends BaseAppointment {
  constructor(data) {
    super(data);
  }

  getBasicInfo = () => {
    const { _data } = this;
    const {
      id,
      participant_one_id,
      participant_one_type,
      participant_two_id,
      participant_two_type,
      organizer_id,
      organizer_type,
      description,
      details,
      start_date,
      end_date,
      start_time,
      end_time,
      provider_id,
      provider_name,
      rr_rule = ""
    } = _data || {};
    const updatedDetails = {
      ...details,
      start_time,
      end_time
    };
    return {
      basic_info: {
        id,
        description,
        details: updatedDetails,
        start_date,
        end_date
      },
      participant_one: {
        id: participant_one_id,
        category: participant_one_type
      },
      participant_two: {
        id: participant_two_id,
        category: participant_two_type
      },
      organizer: {
        id: organizer_id,
        category: organizer_type
      },
      rr_rule,
      provider_id,
      provider_name
    };
  };

  getAllInfo = async () => {
    const { getBasicInfo, getAppointmentId, _data } = this;

    const { id } = _data;

    // get careplan attached to medication
    const appointmentCareplan = await carePlanAppointmentService.getCareplanByAppointment({appointment_id: id}) || null;
    const {care_plan_id = null} = appointmentCareplan || {};

    const scheduleEventService = new ScheduleEventService();
    const scheduleEventData = await scheduleEventService.getAllEventByData({
      event_id: id,
      event_type: EVENT_TYPE.APPOINTMENT
    });

    let activeEventId = null;
    let scheduleData = {};

    if (scheduleEventData.length > 0) {
      for (let i = 0; i < scheduleEventData.length; i++) {
        const scheduleEvent = await EventWrapper(scheduleEventData[i]);
        if (scheduleEvent.getStatus() === EVENT_STATUS.SCHEDULED) {
          activeEventId = scheduleEvent.getScheduleEventId();
        }

        scheduleData[
          scheduleEvent.getScheduleEventId()
        ] = scheduleEvent.getAllInfo();
      }
    }

    let uploadDocumentsData = {};
    let uploadDocumentIds = [];
    const uploadDocuments = await documentService.getDoctorQualificationDocuments(
      DOCUMENT_PARENT_TYPE.APPOINTMENT_DOC,
      id
    );

    for (const uploadDocument of uploadDocuments) {
      const uploadDocumentData = await UploadDocumentWrapper(uploadDocument);
      uploadDocumentsData[
        uploadDocumentData.getUploadDocumentId()
      ] = uploadDocumentData.getBasicInfo();
      uploadDocumentIds.push(uploadDocumentData.getUploadDocumentId());
    }

    return {
      appointments: {
        [`${id}`]: {
          ...getBasicInfo(),
          active_event_id: activeEventId,
          appointment_document_ids: uploadDocumentIds,
          care_plan_id
        }
      },
      schedule_events: {
        ...scheduleData
      },
      appointment_docs: {
        ...uploadDocumentsData
      }
    };
  };

  getReferenceInfo = async () => {
    const { getAllInfo } = this;

    return getAllInfo();
  };
}

export default async (data = null, id = null) => {
  if (data) {
    return new MAppointmentWrapper(data);
  }
  const appointment = await appointmentService.getAppointmentById(id);
  return new MAppointmentWrapper(appointment);
};
