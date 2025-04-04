import { EVENT_TYPE, NOTIFICATION_STAGES } from "../../constant";
import Appointment from "./Appointments/observer";
import Medication from "./Medications/observer";
import Vital from "./Vitals/observer";

class JobSdk {
  execute = ({ eventType, eventStage, event }) => {
    switch (eventType) {
      case EVENT_TYPE.APPOINTMENT:
        return this.handleAppointmentPayload({ eventStage, event });
      case EVENT_TYPE.MEDICATION_REMINDER:
        return this.handleMedicationPayload({ eventStage, event });
      case EVENT_TYPE.VITALS:
        return Vital.execute(eventStage, event);
      default:
        break;
    }
  };

  handleAppointmentPayload = ({ eventStage, event }) => {
    switch (eventStage) {
      case NOTIFICATION_STAGES.PRIOR:
        return Appointment.execute(NOTIFICATION_STAGES.PRIOR, event);
      case NOTIFICATION_STAGES.CREATE:
        return Appointment.execute(NOTIFICATION_STAGES.CREATE, event);
      default:
        return { default: "0", type: "appointment" };
    }
  };

  handleMedicationPayload = ({ eventStage, event }) => {
    switch (eventStage) {
      case NOTIFICATION_STAGES.PRIOR:
        return Medication.execute(NOTIFICATION_STAGES.PRIOR, event);
      case NOTIFICATION_STAGES.CREATE:
        return Medication.execute(NOTIFICATION_STAGES.CREATE, event);
      default:
        return { default: "0", type: "medication" };
    }
  };
}

export default new JobSdk();
