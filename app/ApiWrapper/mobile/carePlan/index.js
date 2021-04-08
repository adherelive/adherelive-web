import BaseCarePlan from "../../../services/carePlan";
import carePlanService from "../../../services/carePlan/carePlan.service";
import carePlanAppointmentService from "../../../services/carePlanAppointment/carePlanAppointment.service";
import carePlanMedicationService from "../../../services/carePlanMedication/carePlanMedication.service";
import VitalService from "../../../services/vitals/vital.service";

import CarePlanAppointmentWrapper from "../../../ApiWrapper/mobile/carePlanAppointment";
import DoctorWrapper from "../../web/doctor";

class CarePlanWrapper extends BaseCarePlan {
  constructor(data) {
    super(data);
  }

  getBasicInfo = () => {
    const { _data } = this;
    const {
      id,
      name,
      doctor_id,
      patient_id,
      details,
      activated_on,
      renew_on,
      expired_on,
      care_plan_template_id,
      user_role_id
    } = _data || {};

    return {
      basic_info: {
        id,
        name,
        doctor_id,
        patient_id,
        care_plan_template_id,
        user_role_id
      },
      details,
      activated_on,
      renew_on,
      expired_on
    };
  };

  getAllInfo = async () => {
    const { _data, getBasicInfo, getCarePlanId } = this;
    const { care_plan_appointments = [], care_plan_medications = [] } =
      _data || {};

    const vitals = await VitalService.getAllByData({
      care_plan_id: getCarePlanId()
    }) || [];

    const vitalIds = [];
    if (vitals.length > 0) {
      vitals.forEach(vital => {
        vitalIds.push(vital.get("id"));
      });
    }
    return {
      ...getBasicInfo(),
      appointment_ids: care_plan_appointments.map(appointment =>
        appointment.get("appointment_id")
      ),
      medication_ids: care_plan_medications.map(medication =>
        medication.get("medication_id")
      ),
      vital_ids: vitalIds
    };
  };

  getReferenceInfo = async () => {
    const {_data, getCarePlanId, getAllInfo} = this;
    const {doctor, patient} = _data || {};

    let doctorData = {};
    let doctor_id = null;

    if(doctor) {
      const doctors = await DoctorWrapper(doctor);
      doctorData[doctors.getDoctorId()] = await doctors.getAllInfo();
      doctor_id = doctors.getDoctorId();
    }

    return {
      care_plans: {
        [getCarePlanId()]: await getAllInfo(),
      },
      doctors: {
        ...doctorData
      },
      doctor_id
    };
  };
}

export default async (data = null, id = null) => {
  if (data) {
    return new CarePlanWrapper(data);
  }
  const carePlan = await carePlanService.getSingleCarePlanByData({ id });
  return new CarePlanWrapper(carePlan);
};
