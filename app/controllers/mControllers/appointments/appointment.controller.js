import Controller from "../../index";
import appointmentService from "../../../services/appointment/appointment.service";
import scheduleService from "../../../services/events/event.service";
import { Proxy_Sdk, EVENTS } from "../../../proxySdk";
import { EVENT_STATUS, EVENT_TYPE, USER_CATEGORY } from "../../../../constant";
import moment from "moment";

import MAppointmentWrapper from "../../../ApiWrapper/mobile/appointments";
import DoctorWrapper from "../../../ApiWrapper/mobile/doctor";
import PatientWrapper from "../../../ApiWrapper/mobile/patient";
import CarePlanAppointmentWrapper from "../../../ApiWrapper/mobile/carePlanAppointment";

import carePlanAppointmentService from "../../../services/carePlanAppointment/carePlanAppointment.service";
import carePlanService from "../../../services/carePlan/carePlan.service";
import doctorService from "../../../services/doctor/doctor.service";
import patientService from "../../../services/patients/patients.service";

import {
  getCarePlanAppointmentIds,
  getCarePlanMedicationIds,
  getCarePlanSeverityDetails
} from "../carePlans/carePlanHelper";

import Log from "../../../../libs/log";

const Logger = new Log("MOBILE APPOINTMENT CONTROLLLER");

class MobileAppointmentController extends Controller {
  constructor() {
    super();
  }

  create = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { body, userDetails } = req;
      const {
        participant_two,
        description = "",
        date,
        organizer = {},
        start_time,
        end_time,
        treatment_id = "",
        care_plan_id = null,
        reason = ""
      } = body;
      const { userId, userData: { category } = {} } = userDetails || {};
      const { id: participant_two_id, category: participant_two_type } =
        participant_two || {};

      let userCategoryId = null;

      switch (category) {
        case USER_CATEGORY.DOCTOR:
          const doctor = await doctorService.getDoctorByData({
            user_id: userId
          });
          const doctorData = await DoctorWrapper(doctor);
          userCategoryId = doctorData.getDoctorId();
          break;
        case USER_CATEGORY.PATIENT:
          const patient = await patientService.getPatientByUserId(userId);
          const patientData = await PatientWrapper(patient);
          userCategoryId = patientData.getPatientId();
          break;
        default:
          break;
      }

      const previousAppointments = await appointmentService.checkTimeSlot(
        date,
        start_time,
        end_time
      );

      if (previousAppointments.length > 0) {
        return raiseClientError(
          res,
          422,
          {
            error_type: "slot_present"
          },
          `Appointment Slot already present between`
        );
      }

      const appointment_data = {
        participant_one_type: category,
        participant_one_id: userCategoryId,
        participant_two_type,
        participant_two_id,
        organizer_type:
          Object.keys(organizer).length > 0 ? organizer.category : category,
        organizer_id:
          Object.keys(organizer).length > 0 ? organizer.id : userCategoryId,
        description,
        start_date: moment(date),
        end_date: moment(date),
        start_time,
        end_time,
        details: {
          treatment_id,
          reason
        }
      };

      const appointment = await appointmentService.addAppointment(
        appointment_data
      );
      const appointmentData = await MAppointmentWrapper(appointment);

      // ADD CAREPLAN APPOINTMENT
      if (care_plan_id) {
        const carePlanAppointment = await carePlanAppointmentService.addCarePlanAppointment(
          {
            care_plan_id,
            appointment_id: appointmentData.getAppointmentId()
          }
        );

        const careplanAppointmentData = await CarePlanAppointmentWrapper(
          carePlanAppointment
        );

        return raiseSuccess(
          res,
          200,
          {
            ...(await careplanAppointmentData.getReferenceInfo())
          },
          `appointment created for careplan id : ${care_plan_id}`
        );
      }

      return raiseSuccess(
        res,
        200,
        {
          appointments: {
            [appointmentData.getAppointmentId()]: appointmentData.getBasicInfo()
          }
        },
        "appointment created successfully"
      );
    } catch (error) {
      Logger.debug("500 error --> ", error);
      return raiseServerError(res);
    }
  };

  // createCarePlanAppointment = async (req, res) => {
  //   const { raiseClientError, raiseSuccess, raiseServerError } = this;
  //   try {
  //     const{carePlanId: care_plan_id = 0 }=req.params;
  //     const { body, userDetails,  } = req;
  //     const {
  //       participant_two,
  //       description = "",
  //       date,
  //       organizer = {},
  //       start_time,
  //       end_time,
  //       treatment = "",
  //       reason=''
  //       // participant_one_type = "",
  //       // participant_one_id = "",
  //     } = body;
  //     console.log("====================> ", organizer);
  //     console.log("[ APPOINTMENTS ] appointments &&&&&&&&&&&&***", care_plan_id, typeof(care_plan_id));
  //     const { userId, userData: { category } = {} } = userDetails || {};
  //     const { id: participant_two_id, category: participant_two_type } =
  //       participant_two || {};
  //
  //
  //     // Logger.debug("Start date", date);
  //     const getAppointmentForTimeSlot = await appointmentService.checkTimeSlot(
  //       date,
  //       start_time,
  //       end_time
  //     );
  //
  //     // Logger.debug("getAppointmentForTimeSlot", getAppointmentForTimeSlot);
  //
  //     if (getAppointmentForTimeSlot.length > 0) {
  //       return raiseClientError(
  //         res,
  //         422,
  //         {
  //           error_type: "slot_present",
  //         },
  //         `Appointment Slot already present between`
  //       );
  //     }
  //
  //     const appointment_data = {
  //       participant_one_type: category,
  //       participant_one_id: userId,
  //       participant_two_type,
  //       participant_two_id,
  //       organizer_type:
  //         Object.keys(organizer).length > 0 ? organizer.category : category,
  //       organizer_id: Object.keys(organizer).length > 0 ? organizer.id : userId,
  //       description,
  //       start_date: moment(date),
  //       end_date: moment(date),
  //       start_time,
  //       end_time,
  //       details: {
  //         treatment,
  //         reason
  //       },
  //     };
  //
  //     const appointment = await appointmentService.addAppointment(
  //       appointment_data
  //     );
  //
  //     let data_to_create = {
  //       care_plan_id:parseInt(care_plan_id),
  //       appointment_id: appointment.get('id')
  //     }
  //
  //     let newAppointment = await carePlanAppointmentService.addCarePlanAppointment(data_to_create);
  //
  //     let carePlan= await carePlanService.getCarePlanById(care_plan_id);
  //
  //     let carePlanAppointmentIds= await getCarePlanAppointmentIds(care_plan_id);
  //     let carePlanMedicationIds = await getCarePlanMedicationIds(care_plan_id);
  //     let carePlanSeverityDetails = await getCarePlanSeverityDetails(care_plan_id);
  //     const carePlanApiWrapper = await CarePlanWrapper(carePlan);
  //     let carePlanApiData = {};
  //
  //     carePlanApiData[
  //       carePlanApiWrapper.getCarePlanId()
  //     ] = {...carePlanApiWrapper.getBasicInfo(),...carePlanSeverityDetails,carePlanMedicationIds,carePlanAppointmentIds};
  //
  //
  //     const appointmentApiData = await new AppointmentWrapper(appointment);
  //
  //     const eventScheduleData = {
  //       event_type: EVENT_TYPE.APPOINTMENT,
  //       event_id: appointmentApiData.getAppointmentId(),
  //       details: appointmentApiData.getExistingData(),
  //       status: EVENT_STATUS.PENDING,
  //       start_time,
  //       end_time,
  //     };
  //
  //     return raiseSuccess(
  //       res,
  //       200,
  //       {
  //         care_plans: {...carePlanApiData},
  //         appointments: {
  //           [appointmentApiData.getAppointmentId()]: {
  //             ...appointmentApiData.getBasicInfo(),
  //           },
  //         },
  //       },
  //       "appointment created successfully"
  //     );
  //   } catch (error) {
  //       Logger.debug("APPOINTMENT CREATE CARE-PLAN APPOINTMENT", error);
  //     return raiseServerError(res);
  //   }
  // };

  getAppointmentForPatient = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const { params: { patient_id } = {}, userDetails: { userId } = {} } = req;

      const appointmentList = await appointmentService.getAppointmentForPatient(
        patient_id
      );
      // Logger.debug("appointmentList", appointmentList);

      // if (appointmentList.length > 0) {
      let appointmentApiData = {};

      for (const appointment of appointmentList) {
        const appointmentWrapper = await MAppointmentWrapper(appointment);
        appointmentApiData[
          appointmentWrapper.getAppointmentId()
        ] = appointmentWrapper.getBasicInfo();
      }

      return raiseSuccess(
        res,
        200,
        {
          appointments: {
            ...appointmentApiData
          }
        },
        `appointment data for patient: ${id} fetched successfully`
      );
      // } else {
      // }
    } catch (error) {
      // Logger.debug("500 error", error);
      return raiseServerError(res);
    }
  };

  update = async (req, res) => {

    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { params: { id } = {}, body, userDetails } = req;
      const {
        participant_two,
        description = "",
        date,
        organizer = {},
        start_time,
        end_time,
        treatment_id = "",
        reason = ""
        // participant_one_type = "",
        // participant_one_id = "",
      } = body;
        Logger.debug("CONDITION CHECK ---> ",  moment(date));
      const { userId, userData: { category } = {} } = userDetails || {};
      const { id: participant_two_id, category: participant_two_type } =
        participant_two || {};

      const oldAppointment = await appointmentService.getAppointmentById(id);

      const oldAppointmentData = await MAppointmentWrapper(oldAppointment);

      Logger.debug("CONDITION CHECK ---> 1",  moment(start_time));
      Logger.debug("CONDITION CHECK ---> 2",  moment(oldAppointmentData.getStartTime()));

      if (
        moment(date).diff(moment(oldAppointmentData.getStartDate()), 'd') > 0 ||
        moment(start_time).diff(moment(oldAppointmentData.getStartTime()), 'm') >
          0 ||
        moment(end_time).diff(moment(oldAppointmentData.getEndTime()), 'm') > 0
      ) {
          const previousAppointments = await appointmentService.checkTimeSlot(
              date,
              start_time,
              end_time
          );

          if (previousAppointments.length > 0) {
              return raiseClientError(
                  res,
                  422,
                  {
                      error_type: "slot_present"
                  },
                  `Appointment Slot already present between`
              );
          }
      }
      //
      // const appointmentData = await MAppointmentWrapper(appointment);
      // const {basic_info: {start_date, details: {start_time: prev_start_time, end_time: prev_end_time} = {}} = {}} = appointmentData.getBasicInfo() || {};

      const appointment_data = {
        participant_one_type: category,
        participant_one_id: userId,
        participant_two_type,
        participant_two_id,
        organizer_type:
          Object.keys(organizer).length > 0 ? organizer.category : category,
        organizer_id: Object.keys(organizer).length > 0 ? organizer.id : userId,
        description,
        start_date: moment(date),
        end_date: moment(date),
        start_time,
        end_time,
        details: {
          treatment_id,
          reason
        }
      };

      const appointment = await appointmentService.updateAppointment(
        id,
        appointment_data
      );

      const updatedAppointmentDetails = await appointmentService.getAppointmentById(id);

      const appointmentApiData = await MAppointmentWrapper(
        updatedAppointmentDetails
      );

      // const eventScheduleData = {
      //   event_type: EVENT_TYPE.APPOINTMENT,
      //   event_id: appointmentApiData.getAppointmentId(),
      //   details: appointmentApiData.getExistingData(),
      //   status: EVENT_STATUS.PENDING,
      //   start_time,
      //   end_time,
      // };

      // const scheduleEvent = await scheduleService.addNewJob(eventScheduleData);
      // console.log("[ APPOINTMENTS ] scheduleEvent ", scheduleEvent);

      // TODO: schedule event and notifications here
      // await Proxy_Sdk.scheduleEvent({ data: eventScheduleData });

      // response
      return raiseSuccess(
        res,
        200,
        {
          appointments: {
            [appointmentApiData.getAppointmentId()]: {
              ...appointmentApiData.getBasicInfo()
            }
          }
        },
        "appointment updated successfully"
      );
    } catch (error) {
      Logger.debug("update 500 error", error);
      return raiseServerError(res);
    }
  };

  delete = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const {
        params: { appointment_id } = {},
        userDetails: { userId } = {}
      } = req;

      const carePlanAppointmentDetails = await carePlanAppointmentService.deleteCarePlanAppointmentByAppointmentId(
        appointment_id
      );
      const appointmentDetails = await appointmentService.deleteAppointment(
        appointment_id
      );

      return raiseSuccess(res, 200, {}, `appointment deleted successfully`);
    } catch (error) {
      // Logger.debug("500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new MobileAppointmentController();
