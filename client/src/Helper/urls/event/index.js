export const getAddAppointmentURL = () => {
  return "/events/appointments";
};

export const getAddReminderURL = () => {
  return "/events/reminders";
};

export const getAppointments = (userId, startDate, endDate) => {
  return `/appointments?userId=${userId}&startDate=${startDate}&endDate=${endDate}`;
};

export const getDashboardReminder = (userId, startDate, endDate) => {
  return `/dashBoardReminders?userId=${userId}&startDate=${startDate}&endDate=${endDate}`;
};

export const getAppointmentsHistory = (userId) => {
  return `users/${userId}/appointments/history`;
};

export const getCancelAppointment = (eventId, all) => {
  return `/appointments/delete?id=${eventId}&all=${all}`;
};

export const getCancelReminderURL = (eventId, all) => {
  return `/reminders/delete?id=${eventId}&all=${all}`;
};

export const getCreateAdverseEventURL = () => {
  return `/adverse-events`;
};

export const getRescheduleAppointmentURL = (id) => {
  return `/appointments/${id}/re-schedule`;
};

export const getEditNotesURL = (id) => {
  return `/appointments/${id}/edit-notes`;
};

export const getEditReminderURL = (id) => {
  return `/reminders/${id}/edit`;
};

export const getEditNotesReminderURL = (id) => {
  return `/reminders/${id}/edit-notes`;
};

export const setAppointmentStatusURL = (eventId) => {
  return `/events/${eventId}/status`;
};

export const getFetchAdverseEvent = (userId) => {
  return `/users/${userId}/adverse-events`;
};

export const getLastEditedEvent = () => {
  return "/appointments/lastEdited";
};

export const getEventUsers = (eventId) => {
  return `/events/${eventId}/eventUsers`;
};

export const getEventDataById = (eventId) => {
  return `/events/eventData/${eventId}`;
};

export const getBookedSlotsURL = () => {
  return `/events/booked-timeslot`;
};

export const addVideoRoomParticipantsURL = (eventId) => {
  return `/events/${eventId}/addVideoRoomParticipants`;
};

export const getAddMedicationReminderURL = () => {
  return "/medication-reminders";
};
export const getUpdateMedicationReminderStatusURL = (
  scheduleEventId,
  status
) => {
  return `medication-reminders/${scheduleEventId}/${status}`;
};
export const getUpdateMedicationReminderURL = (scheduleEventId) => {
  return `medication-reminders/${scheduleEventId}`;
};

export const getScheduleEventsUrl = () => {
  return `/schedule-events`;
};

export const getAppointmentCompleteUrl = (id) => {
  return `/events/${id}/complete`;
};

export const getAllMissedScheduleEventsUrl = () => {
  return `/events/missed`;
};

export const getPatientMissedEventsUrl = (patient_id) => {
  return `/events/missed/${patient_id}`;
};

export const getEditVitalResponseUrl = ({ id, index }) => {
  return `/events/${id}/vitals/response?index=${index}`;
};

export const getDeleteVitalResponseUrl = ({ id, index }) => {
  return `/events/${id}/vitals/response?index=${index}`;
};
