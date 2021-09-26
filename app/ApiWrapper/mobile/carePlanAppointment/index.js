import BaseCarePlanAppointment from "../../../services/carePlanAppointment";
import carePlanAppointmentService from "../../../services/carePlanAppointment/carePlanAppointment.service";
import appointmentService from "../../../services/appointment/appointment.service";
import carePlanService from "../../../services/carePlan/carePlan.service";
import AppointmentWrapper from "../../../ApiWrapper/mobile/appointments";
import CarePlanWrapper from "../../../ApiWrapper/mobile/carePlan";

class CarePlanAppointmentWrapper extends BaseCarePlanAppointment {
  constructor(data) {
    super(data);
  }

  getBasicInfo = () => {
    const { _data } = this;
    const { id, care_plan_id, appointment_id } = _data || {};

    return {
      basic_info: {
        id,
        care_plan_id,
        appointment_id
      }
    };
  };

  getReferenceInfo = async () => {
    const {
      getBasicInfo,
      getCarePlanAppointmentId,
      getAppointmentId,
      getCarePlanId,
      _data
    } = this;

    const appointment = await appointmentService.getAppointmentById(
      getAppointmentId()
    );
    const appointmentData = await AppointmentWrapper(appointment);

    const carePlan = await carePlanService.getCarePlanById(getCarePlanId());
    const carePlanData = await CarePlanWrapper(carePlan);

    return {
      care_plan_appointments: {
        [getCarePlanAppointmentId()]: getBasicInfo()
      },
      appointments: {
        [getAppointmentId()]: appointmentData.getBasicInfo()
      },
      care_plans: {
        [getCarePlanId()]: {
          ...(await carePlanData.getAllInfo()),
          care_plan_appointment_ids: [getCarePlanAppointmentId()]
        }
      }
    };
  };
}

export default async (data = null, id = null) => {
  if (data) {
    return new CarePlanAppointmentWrapper(data);
  }
  const carePlan = await carePlanAppointmentService.getSingleCarePlanAppointmentByData(
    { id }
  );
  return new CarePlanAppointmentWrapper(carePlan);
};
