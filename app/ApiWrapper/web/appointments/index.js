import BaseAppointment from "../../../services/appointment";

import appointmentService from "../../../services/appointment/appointment.service";
import careplanAppointmentService from "../../../services/carePlanAppointment/carePlanAppointment.service";
import ScheduleEventService from "../../../services/scheduleEvents/scheduleEvent.service";
import documentService from "../../../services/uploadDocuments/uploadDocuments.service";
import doctorService from "../../../services/doctor/doctor.service";
import EventWrapper from "../../common/scheduleEvents";

import UploadDocumentWrapper from "../../web/uploadDocument";
import {
  EVENT_STATUS,
  EVENT_TYPE,
  DOCUMENT_PARENT_TYPE,
} from "../../../../constant";

class AppointmentWrapper extends BaseAppointment {
  constructor(data) {
    super(data);
  }

  getOrganizerDetails = async (organizer_id, organizer_type) => {
    let organizer = {};
    console.log("organizer_id", organizer_id);
    console.log("organizer_type", organizer_type);
    if (organizer_type === "doctor") {
      organizer = await doctorService.getDoctorByUserId(organizer_id);
    }
    return organizer;
  };
  // Gauarav changes
  getOrganizerDetailsFromId = async (organizer_id, organizer_type) => {
    let organizer = {};
    console.log("organizer_id", organizer_id);
    console.log("organizer_type", organizer_type);
    if (organizer_type === "doctor") {
      organizer = await doctorService.getDoctorByDoctorId(organizer_id);
    }
    return organizer;
  };

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
      provider_id,
      provider_name,
      start_date,
      end_date,
      rr_rule = "",
      start_time,
      end_time,
    } = _data || {};

    return {
      basic_info: {
        id,
        description,
        details,
        start_date,
        end_date,
        start_time,
        end_time,
      },
      participant_one: {
        id: participant_one_id,
        category: participant_one_type,
      },
      participant_two: {
        id: participant_two_id,
        category: participant_two_type,
      },
      organizer: {
        id: organizer_id,
        category: organizer_type,
      },
      rr_rule,
      provider_id,
      provider_name,
    };
  };

  getAllInfo = async () => {
    const { getBasicInfo, _data } = this;
    const { id } = _data;

    const scheduleEventService = new ScheduleEventService();
    const scheduleEventData = await scheduleEventService.getAllEventByData({
      event_id: id,
      event_type: EVENT_TYPE.APPOINTMENT,
    });

    let activeEventId = null;
    let scheduleData = {};

    if (scheduleEventData.length > 0) {
      for (let i = 0; i < scheduleEventData.length; i++) {
        const scheduleEvent = await EventWrapper(scheduleEventData[i]);
        if (scheduleEvent.getStatus() === EVENT_STATUS.SCHEDULED) {
          activeEventId = scheduleEvent.getScheduleEventId();
        }
        scheduleData[scheduleEvent.getScheduleEventId()] =
          scheduleEvent.getAllInfo();
      }
    }

    let uploadDocumentsData = {};
    let uploadDocumentIds = [];
    const uploadDocuments =
      await documentService.getDoctorQualificationDocuments(
        DOCUMENT_PARENT_TYPE.APPOINTMENT_DOC,
        id
      );

    for (const uploadDocument of uploadDocuments) {
      const uploadDocumentData = await UploadDocumentWrapper(uploadDocument);
      uploadDocumentsData[uploadDocumentData.getUploadDocumentId()] =
        uploadDocumentData.getBasicInfo();
      uploadDocumentIds.push(uploadDocumentData.getUploadDocumentId());
    }

    // care_plan_id
    const { care_plan_id = null } =
      (await careplanAppointmentService.getCareplanByAppointment({
        appointment_id: id,
      })) || {};
    let appointment = getBasicInfo();
    let organizer = await this.getOrganizerDetailsFromId(
      appointment.organizer.id,
      appointment.organizer.category
    );

    console.log("organizer", organizer);
    appointment.organizer.name = `${organizer.first_name} ${organizer.last_name}`;
    // appointment.organizer.name =
    return {
      appointments: {
        [`${id}`]: {
          ...appointment,
          active_event_id: activeEventId,
          appointment_document_ids: uploadDocumentIds,
          care_plan_id,
        },
      },
      schedule_events: {
        ...scheduleData,
      },
      upload_documents: {
        ...uploadDocumentsData,
      },
      appointment_id: id,
    };
  };

  getReferenceInfo = async () => {
    const { getAllInfo } = this;

    return getAllInfo();
  };
}

export default async (data = null, id = null) => {
  if (data !== null) {
    return new AppointmentWrapper(data);
  }
  const appointment = await appointmentService.getAppointmentById(id);
  return new AppointmentWrapper(appointment.get());
};
