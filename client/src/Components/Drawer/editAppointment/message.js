import { defineMessages } from "react-intl";
import messages from "../PatientDetails/message";

const message = defineMessages({
  edit_appointment: {
    id: "app.drawer.edit.appointment.title",
    description: "",
    defaultMessage: "Edit Appointment",
  },
  patient: {
    id: "app.drawer.add.appointment.patient",
    description: "",
    defaultMessage: "Patient",
  },
  select_patient: {
    id: "app.drawer.add.appointment.select.patient",
    description: "",
    defaultMessage: "Select Patient",
  },
  start_date: {
    id: "app.drawer.add.appointment.start.date",
    description: "",
    defaultMessage: "Date",
  },
  start_time: {
    id: "app.drawer.add.appointment.start.time",
    description: "",
    defaultMessage: "Start Time",
  },
  end_time: {
    id: "app.drawer.add.appointment.end.time",
    description: "",
    defaultMessage: "End Time",
  },
  submit_text: {
    id: "app.drawer.add.appointment.submit",
    description: "",
    defaultMessage: "Submit",
  },
  add_appointment_success: {
    id: "app.drawer.add.appointment.success.message",
    description: "",
    defaultMessage: "Appointment created successfully",
  },
  edit_appointment_success: {
    id: "app.drawer.edit.appointment.success.message",
    description: "",
    defaultMessage: "Appointment updated successfully",
  },
  error_select_date: {
    id: "app.drawer.add.appointment.error.select.date",
    description: "",
    defaultMessage: "Please select date",
  },
  error_select_start_time: {
    id: "app.drawer.add.appointment.error.select.start.time",
    description: "",
    defaultMessage: "Please select start time",
  },
  error_select_end_time: {
    id: "app.drawer.add.appointment.error.select.end.time",
    description: "",
    defaultMessage: "Please select end time",
  },
  error_purpose: {
    id: "app.drawer.add.appointment.error.select.purpose",
    description: "",
    defaultMessage: "Please enter purpose of appointment.",
  },
  error_valid_purpose: {
    id: "app.drawer.add.appointment.error.select.valid.purpose",
    description: "",
    defaultMessage: "Please enter a valid purpose of appointment.",
  },
  treatment_text: {
    id: "app.drawer.add.appointment.treatment.text",
    description: "",
    defaultMessage: "Treatment",
  },
  purpose_text: {
    id: "app.drawer.add.appointment.purpose.text",
    description: "",
    defaultMessage: "Purpose",
  },
  purpose_text_placeholder: {
    id: "app.drawer.add.appointment.purpose.text.placeholder",
    description: "",
    defaultMessage: "Enter purpose here",
  },
  treatment_text_placeholder: {
    id: "app.drawer.add.appointment.treatment.text.placeholder",
    description: "",
    defaultMessage: "Enter treatment here",
  },
  description_text: {
    id: "app.drawer.add.appointment.description.text",
    description: "",
    defaultMessage: "Notes",
  },
  description_text_placeholder: {
    id: "app.drawer.add.appointment.description.text.placeholder",
    description: "",
    defaultMessage: "Enter description here",
  },

  schedule: {
    id: "app.event.schedule",
    description: "",
    defaultMessage: "Schedule New",
  },
  cancel: {
    id: "app.event.cancel",
    description: "",
    defaultMessage: "Cancel",
  },
  addAppointment: {
    id: "app.event.addAppointment",
    description: "",
    defaultMessage: "Add Appointment",
  },
  addCareCoach: {
    id: "app.event.addCareCoach",
    description: "",
    defaultMessage: "Add Care Coach",
  },
  addProduct: {
    id: "app.event.addProduct",
    description: "",
    defaultMessage: "Add Product",
  },
  addReminder: {
    id: "app.event.addReminder",
    description: "",
    defaultMessage: "Add Reminder",
  },
  addMedicationReminder: {
    id: "app.event.addMedicationReminder",
    description: "",
    defaultMessage: "Add",
  },
  editAppointment: {
    id: "app.event.EditAppointment",
    description: "",
    defaultMessage: "Edit Appointment",
  },
  chooseAppointmentType: {
    id: "app.event.chooseAppointment",
    description: "",
    defaultMessage: "Choose Appointment Type",
  },
  editReminder: {
    id: "app.event.EditReminder",
    description: "",
    defaultMessage: "Edit Reminder",
  },
  editMedicationReminder: {
    id: "app.event.EditMedicationReminder",
    description: "",
    defaultMessage: "Edit Medication Reminder",
  },
  chooseWhen: {
    id: "app.event.chooseWhen",
    description: "",
    defaultMessage: "Choose When",
  },
  appointment: {
    id: "add.event.appointment",
    description: "",
    defaultMessage: "Appointment",
  },
  reminder: {
    id: "add.event.reminder",
    description: "",
    defaultMessage: "Reminder",
  },
  reminderTitle: {
    id: "app.event.reminderTitle",
    description: "",
    defaultMessage: "Reminder Title",
  },
  alongWithPlaceHolder: {
    id: "app.event.reminderalongwith",
    description: "",
    defaultMessage: "Tag a patient or a doctor",
  },
  medicationReminderAlongWithPlaceHolder: {
    id: "app.event.medicationReminderAlongWithPlaceHolder",
    description: "",
    defaultMessage: "Tag a patient",
  },
  alongWithLabelAppointment: {
    id: "app.event.appointmentAlongWithLabel",
    description: "",
    defaultMessage: "Appointment with",
  },
  alongWithLabelReminder: {
    id: "app.event.reminderAlongWithLabel",
    description: "",
    defaultMessage: "Reminder with",
  },
  doesNotRepeat: {
    id: "app.event.doesNotRepeat",
    description: "",
    defaultMessage: "Does not repeat",
  },
  repeatsDaily: {
    id: "app.event.repeatsDaily",
    description: "",
    defaultMessage: "Repeats Daily",
  },
  repeatsWeekly: {
    id: "app.event.repeatsWeekly",
    description: "",
    defaultMessage: "Repeats Weekly",
  },
  repeatsMonthly: {
    id: "add.event.repeatsMonthly",
    description: "",
    defaultMessage: "Repeats Monthly",
  },
  repeatsYearly: {
    id: "add.event.repeatsYearly",
    description: "",
    defaultMessage: "Repeats Yearly",
  },
  repeatIntervalError: {
    id: "add.event.repeatIntervalError",
    description: "",
    defaultMessage: "Repeat Interval is required",
  },
  activity: {
    id: "add.event.activity",
    description: "",
    defaultMessage: "Activity",
  },

  followup: {
    id: "app.event.followup",
    description: "",
    defaultMessage: "Follow Up",
  },
  medication: {
    id: "add.event.medication",
    description: "",
    defaultMessage: "Medication",
  },
  materialDelivery: {
    id: "add.event.materialDelivery",
    description: "",
    defaultMessage: "Material Delivery",
  },
  visit: {
    id: "app.event.visit",
    description: "",
    defaultMessage: "Visit",
  },
  call: {
    id: "add.event.call",
    description: "",
    defaultMessage: "Phone Call",
  },
  textEmail: {
    id: "add.event.textEmail",
    description: "",
    defaultMessage: "Video Call",
  },

  from: {
    id: "app.event.from",
    description: "",
    defaultMessage: "From",
  },
  till: {
    id: "add.event.till",
    description: "",
    defaultMessage: "Till",
  },
  on: {
    id: "add.event.on",
    description: "",
    defaultMessage: "On",
  },
  at: {
    id: "app.event.at",
    description: "",
    defaultMessage: "At",
  },
  repeatsOn: {
    id: "add.event.repeatsOn",
    description: "",
    defaultMessage: "Repeats on:",
  },
  notes: {
    id: "add.event.notes",
    description: "",
    defaultMessage: "Write notes (optional)",
  },
  cancelAppointment: {
    id: "cancel.event.calendarCard",
    description: "",
    defaultMessage: "Cancel Appointment",
  },
  cancelReminder: {
    id: "cancel.event.Reminder",
    description: "",
    defaultMessage: "Cancel Reminder",
  },
  goback: {
    id: "cancel.all.event.calendarCard",
    description: "",
    defaultMessage: "Go Back",
  },
  contentAppt: {
    id: "cancel.modal.contentAppt",
    description: "",
    defaultMessage:
      "Please note that appointments once cancelled cannot be undone you may have to add new appointment in case you wanted to add similar appointment later.",
  },
  messageAppt: {
    id: "cancel.modal.messageAppt",
    description: "",
    defaultMessage: "Are you sure you want to cancel the appointment?",
  },
  contentRem: {
    id: "cancel.modal.contentRem",
    description: "",
    defaultMessage:
      "Please note that reminders once cancelled cannot be undone you may have to add new reminder in case you wanted to add similar reminder later.",
  },
  messageRem: {
    id: "cancel.modal.messageRem",
    description: "",
    defaultMessage: "Are you sure you want to cancel the reminder?",
  },
  alert: {
    id: "cancel.modal.alert",
    description: "",
    defaultMessage:
      "This action cannot be undone. For help, contact program admin",
  },
  buttonCancelThisOnly: {
    id: "cancel.modal.buttonCancelThisOnly",
    description: "",
    defaultMessage: "Cancel This Only",
  },
  buttonCancelAll: {
    id: "cancel.modal.buttonCancelAll",
    description: "",
    defaultMessage: "Cancel All",
  },
  remindMyCareCoach: {
    id: "add.event.remindCareCoach",
    description: "",
    defaultMessage: "Remind my Care Coach also",
  },
  forPatientApptType: {
    id: "event.modal.forPatientApptType",
    description: "",
    defaultMessage: "Follow Up appointment",
  },
  appointmentType: {
    id: "app.drawer.add.appointment.appointmentType",
    description: "",
    defaultMessage: "Type",
  },
  error_provider: {
    id: "app.drawer.add.appointment.error.select.provider",
    description: "",
    defaultMessage: "Please select provider",
  },
  provider: {
    id: "app.event.provider",
    description: "",
    defaultMessage: "Provider",
  },
  error_appointment_type_description: {
    id: "app.drawer.add.appointment.error.select.type.description",
    description: "",
    defaultMessage: "Please select type description",
  },
  error_appointment_type: {
    id: "app.drawer.add.appointment.error.select.type",
    description: "",
    defaultMessage: "Please select appointment type",
  },
  appointmentTypeDescription: {
    id: "app.drawer.add.appointment.appointmentTypeDescription",
    description: "",
    defaultMessage: "Description",
  },
  econsulting: {
    id: "add.event.econsulting",
    description: "",
    defaultMessage: "Online Video Call(E-consultation)",
  },
  reason: {
    id: "cancel.modal.reason",
    description: "",
    defaultMessage: "Write reason for cancelling this appointment",
  },
  chooseTypeDescription: {
    id: "cancel.modal.chooseTypeDescription",
    description: "",
    defaultMessage: "Choose Type Description",
  },
  chooseProvider: {
    id: "cancel.modal.chooseProvider",
    description: "",
    defaultMessage: "Choose Provider",
  },
  criticalAppointment: {
    id: "cancel.modal.criticalAppointment",
    description: "",
    defaultMessage: "Critical Appointment",
  },
  noMatchFound: {
    id: "cancel.modal.noMatchFound",
    description: "",
    defaultMessage: "No match found",
  },
  radiology: {
    id: "app.drawer.edit.appointment.radiology",
    description: "",
    defaultMessage: "Radiology",
  },
  radiologyTypeDesc: {
    id: "app.drawer.edit.appointment.radiologyTypeDesc",
    description: "",
    defaultMessage: "Radiology Type Description",
  },
  error_radio_type_required: {
    id: "app.drawer.edit.appointment.error_radio_type_required",
    description: "",
    defaultMessage: "Radiology Type Description Required",
  },
  markFav: {
    id: "app.drawer.edit.appointment.markFav",
    description: "",
    defaultMessage: "Mark favourite",
  },
  unMarkFav: {
    id: "app.drawer.edit.appointment.unMarkFav",
    description: "",
    defaultMessage: "Un-check",
  },
  somethingWentWrong: {
    id: "app.drawer.edit.appointment.somethingWentWrong",
    description: "",
    defaultMessage: "Something went wrong, please try again",
  },
  fillMandatory: {
    id: "app.drawer.edit.appointment.fillMandatory",
    description: "",
    defaultMessage: "Please fill all mandatory details.",
  },
  pastTimeError: {
    id: "app.drawer.edit.appointment.pastTimeError",
    description: "",
    defaultMessage: "Cannot create appointment for past time.",
  },
  validTimingError: {
    id: "app.drawer.edit.appointment.validTimingError",
    description: "",
    defaultMessage: "Please select valid timings for appointment.",
  },
  placeholderAppointmentType: {
    id: "app.drawer.edit.appointment.placeholderAppointmentType",
    description: "",
    defaultMessage: "Choose Appointment Type",
  },
  placeholderTypeDesc: {
    id: "app.drawer.edit.appointment.placeholderTypeDesc",
    description: "",
    defaultMessage: "Choose Type Description",
  },
  placeholderRadiologyTypeDesc: {
    id: "app.drawer.edit.appointment.placeholderRadiologyTypeDesc",
    description: "",
    defaultMessage: "Choose Radiology Type Description",
  },
  placeholderProvider: {
    id: "app.drawer.edit.appointment.placeholderProvider",
    description: "",
    defaultMessage: "Choose Provider",
  },
  viewDetails: {
    id: "app.drawer.edit.appointment.viewDetails",
    description: "",
    defaultMessage: "Appointment Details",
  },
});

export default message;
