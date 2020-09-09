import BaseAppointment from "../../../services/appointment";
import appointmentService from "../../../services/appointment/appointment.service";

class AppointmentWrapper extends BaseAppointment {
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
}

export default async (data = null, id = null) => {
  if (data !== null) {
    return new AppointmentWrapper(data);
  }
  const appointment = await appointmentService.getAppointmentById(id);
  return new AppointmentWrapper(appointment.get());
};