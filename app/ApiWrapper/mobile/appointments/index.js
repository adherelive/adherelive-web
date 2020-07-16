import BaseAppointment from "../../../services/appointment";
import appointmentService from "../../../services/appointment/appointment.service";

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
      rr_rule = "",
    } = _data || {};
    const updatedDetails = {
      ...details,
      start_time,
      end_time,
    };
    return {
      basic_info: {
        id,
        description,
        details: updatedDetails,
        start_date,
        end_date,
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
    };
  };
}

export default async (data = null, id = null) => {
  if (data) {
    return new MAppointmentWrapper(data);
  }
  const appointment = await appointmentService.getAppointment({ id });
  return new MAppointmentWrapper(appointment);
};
