import Controller from "../index";
import appointmentService from "../../services/appointment/appointment.service";
import scheduleService from "../../services/events/event.service";
import carePlanAppointmentService from "../../services/carePlanAppointment/carePlanAppointment.service";
import carePlanService from "../../services/carePlan/carePlan.service";
import { getCarePlanAppointmentIds, getCarePlanMedicationIds, getCarePlanSeverityDetails } from '../carePlans/carePlanHelper'
import CarePlanWrapper from "../../ApiWrapper/web/carePlan";
import { Proxy_Sdk, EVENTS } from "../../proxySdk";
import {EVENT_STATUS, EVENT_TYPE, USER_CATEGORY} from "../../../constant";
import moment from "moment";

import Log from "../../../libs/log";
import { raiseClientError } from "../../../routes/helper";
import AppointmentWrapper from "../../ApiWrapper/web/appointments";
import doctorService from "../../services/doctor/doctor.service";
import DoctorWrapper from "../../ApiWrapper/web/doctor";
import patientService from "../../services/patients/patients.service";
import PatientWrapper from "../../ApiWrapper/web/patient";

const FILE_NAME = "WEB APPOINTMENT CONTROLLER";

const Logger = new Log(FILE_NAME);

class AppointmentController extends Controller {
  constructor() {
    super();
  }

  create = async (req, res) => {
    const { raiseClientError } = this;
    try {
      Logger.debug("REQUEST DATA ---> ", req.body);
      const { body, userDetails } = req;
      const {
        participant_two,
        description = "",
        date,
        organizer = {},
        start_time,
        end_time,
        treatment_id = "",
        // participant_one_type = "",
        // participant_one_id = "",
      } = body;
      console.log("====================> ", organizer);
      const { userId, userData: { category } = {} } = userDetails || {};
      const { id: participant_two_id, category: participant_two_type } =
        participant_two || {};


      /*
      * check previous time slot for appointment based on
      * date,
      * start_time,
      * end_time,
      *
      * participant_one_id,
      * participant_one_type,
      * participant_two_id,
      * participant_two_type
      * */

      let userCategoryId = null;

      Logger.debug("userDetails --------------------> ", userDetails);

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


      // Logger.debug("Start date", date);
      const getAppointmentForTimeSlot = await appointmentService.checkTimeSlot(
        start_time,
        end_time,
          {
            participant_one_id: userCategoryId,
            participant_one_type: category
          },
          {
            participant_two_id,
            participant_two_type
          }
      );

      Logger.debug("getAppointmentForTimeSlot", getAppointmentForTimeSlot.length);

      if (getAppointmentForTimeSlot.length > 0) {
        return raiseClientError(
          res,
          422,
          {
            error_type: "slot_present",
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
        organizer_id: Object.keys(organizer).length > 0 ? organizer.id : userId,
        description,
        start_date: moment(date),
        end_date: moment(date),
        start_time,
        end_time,
        details: {
          treatment_id,
        },
      };

      const appointment = await appointmentService.addAppointment(
        appointment_data
      );

      const appointmentApiData = await new AppointmentWrapper(appointment);

      const eventScheduleData = {
        event_type: EVENT_TYPE.APPOINTMENT,
        event_id: appointmentApiData.getAppointmentId(),
        details: appointmentApiData.getBasicInfo(),
        status: EVENT_STATUS.PENDING,
        start_time,
        end_time,
      };

      // const scheduleEvent = await scheduleService.addNewJob(eventScheduleData);
      // console.log("[ APPOINTMENTS ] scheduleEvent ", scheduleEvent);

      // TODO: schedule event and notifications here
      await Proxy_Sdk.scheduleEvent({ data: eventScheduleData });

      // response
      return this.raiseSuccess(
        res,
        200,
        {
          appointments: {
            [appointmentApiData.getAppointmentId()]: {
              ...appointmentApiData.getBasicInfo(),
            },
          },
        },
        "appointment created successfully"
      );
    } catch (error) {
      console.log("[ APPOINTMENTS ] create error ---> ", error);
      return this.raiseServerError(res);
    }
  };

  createCarePlanAppointment = async (req, res) => {
    const { raiseClientError } = this;
    try {
      const { carePlanId: care_plan_id = 0 } = req.params;
      const { body, userDetails, } = req;
      const {
        participant_two,
        description = "",
        date,
        organizer = {},
        start_time,
        end_time,
        treatment_id = "",
        reason = ''
        // participant_one_type = "",
        // participant_one_id = "",
      } = body;
      console.log("====================> ", organizer);
      console.log("[ APPOINTMENTS ] appointments &&&&&&&&&&&&***", care_plan_id, typeof (care_plan_id));
      const { userId, userData: { category } = {} } = userDetails || {};
      const { id: participant_two_id, category: participant_two_type } =
        participant_two || {};

      let userCategoryId = null;

      Logger.debug("userDetails --------------------> ", userDetails);

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


      // Logger.debug("Start date", date);
      const getAppointmentForTimeSlot = await appointmentService.checkTimeSlot(
        start_time,
        end_time,
          {
            participant_one_id: userCategoryId,
            participant_one_type: category
          },
          {
            participant_two_id,
            participant_two_type
          }
      );

      // Logger.debug("getAppointmentForTimeSlot", getAppointmentForTimeSlot);

      if (getAppointmentForTimeSlot.length > 0) {
        return raiseClientError(
          res,
          422,
          {
            error_type: "slot_present",
          },
          `Appointment Slot already present between`
        );
      }

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
        },
      };

      const appointment = await appointmentService.addAppointment(
        appointment_data
      );

      let data_to_create = {
        care_plan_id: parseInt(care_plan_id),
        appointment_id: appointment.get('id')
      }

      let newAppointment = await carePlanAppointmentService.addCarePlanAppointment(data_to_create);

      let carePlan = await carePlanService.getCarePlanById(care_plan_id);

      let carePlanAppointmentIds = await getCarePlanAppointmentIds(care_plan_id);
      let carePlanMedicationIds = await getCarePlanMedicationIds(care_plan_id);
      let carePlanSeverityDetails = await getCarePlanSeverityDetails(care_plan_id);
      const carePlanApiWrapper = await CarePlanWrapper(carePlan);
      let carePlanApiData = {};

      carePlanApiData[
        carePlanApiWrapper.getCarePlanId()
      ] = { ...carePlanApiWrapper.getBasicInfo(), ...carePlanSeverityDetails, medication_ids: carePlanMedicationIds, appointment_ids: carePlanAppointmentIds };


      const appointmentApiData = await new MAppointmentWrapper(appointment);

      const eventScheduleData = {
        event_type: EVENT_TYPE.APPOINTMENT,
        event_id: appointmentApiData.getAppointmentId(),
        details: appointmentApiData.getBasicInfo(),
        status: EVENT_STATUS.PENDING,
        start_time,
        end_time,
      };

      // const scheduleEvent = await scheduleService.addNewJob(eventScheduleData);
      // console.log("[ APPOINTMENTS ] scheduleEvent ", scheduleEvent);

      // TODO: schedule event and notifications here
      await Proxy_Sdk.scheduleEvent({ data: eventScheduleData });

      // response
      return this.raiseSuccess(
        res,
        200,
        {
          care_plans: { ...carePlanApiData },
          appointments: {
            [appointmentApiData.getAppointmentId()]: {
              ...appointmentApiData.getBasicInfo(),
            },
          },
        },
        "appointment created successfully"
      );
    } catch (error) {
      console.log("[ APPOINTMENTS ] create error ---> ", error);
      return this.raiseServerError(res);
    }
  };

  update = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const { params: { appointment_id } = {}, body, userDetails } = req;
      const {
        participant_two,
        description = "",
        date,
        organizer = {},
        start_time,
        end_time,
        treatment_id = "",
        reason = ''
        // participant_one_type = "",
        // participant_one_id = "",
      } = body;
      console.log("UPDATEEEEEEEEEEEEE====================> ", date, appointment_id, start_time, end_time, userDetails);
      const { userId, userData: { category } = {} } = userDetails || {};
      const { id: participant_two_id, category: participant_two_type } =
        participant_two || {};

      const oldAppointment = await appointmentService.getAppointmentById(appointment_id);

      const oldAppointmentData = await MAppointmentWrapper(oldAppointment);

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

      Logger.debug("CONDITION CHECK ---> 1",  moment(date));
      Logger.debug("CONDITION CHECK ---> 2", moment(oldAppointmentData.getStartDate()));

      Logger.debug("12378939832 getting here 88888888888888888888888", moment(date).diff(moment(oldAppointmentData.getStartDate())));

      if (
          moment(date).diff(moment(oldAppointmentData.getStartDate()), 'd') !== 0 ||
          moment(start_time).diff(moment(oldAppointmentData.getStartTime()), 'm') !==
          0 ||
          moment(end_time).diff(moment(oldAppointmentData.getEndTime()), 'm') !== 0
      ) {

        const previousAppointments = await appointmentService.checkTimeSlot(
            date,
            start_time,
            end_time
        );

        const filteredAppointments = previousAppointments.filter(appointment => {
          console.log("appointment id", typeof appointment_id,typeof appointment.get("id"));
          return `${appointment.get("id")}` !== appointment_id;
        });

        console.log("appointment id", filteredAppointments);

        if (filteredAppointments.length > 0) {
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

      const appointment_data = {
        participant_one_type: category,
        participant_one_id: userCategoryId,
        participant_two_type,
        participant_two_id,
        organizer_type:
          Object.keys(organizer).length > 0 ? organizer.category : category,
        organizer_id: Object.keys(organizer).length > 0 ? organizer.id : userCategoryId,
        description,
        start_date: moment(date),
        end_date: moment(date),
        start_time,
        end_time,
        details: {
          treatment_id,
          reason
        },
      };

      const appointment = await appointmentService.updateAppointment(appointment_id,
        appointment_data
      );

      const updatedAppointmentDetails = await appointmentService.getAppointmentById(appointment_id);

      const appointmentApiData = await MAppointmentWrapper(updatedAppointmentDetails);

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
      return this.raiseSuccess(
        res,
        200,
        {
          appointments: {
            [appointmentApiData.getAppointmentId()]: {
              ...appointmentApiData.getBasicInfo(),
            },
          },
        },
        "Appointment updated successfully"
      );
    } catch (error) {
      Logger.debug("update 500 error", error);
      return raiseServerError(res);
    }
  };

  getAppointmentForPatient = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const { params: { id } = {}, userDetails: { userId } = {} } = req;


      console.log('PATIENT IDDD OF GET APPOINTMENT', id);
      const appointmentList = await appointmentService.getAppointmentForPatient(
        id
      );

      console.log('PATIENT IDDD OF GET APPOINTMENT11111111', appointmentList);
      // Logger.debug("appointmentList", appointmentList);

      // if (appointmentList.length > 0) {
      let appointmentApiData = {};

      for(const appointment of appointmentList) {
        const appointmentWrapper = await MAppointmentWrapper(appointment);

        console.log('DETAILSSSSS in API WRAPPER', appointmentWrapper.getBasicInfo());
        appointmentApiData[
            appointmentWrapper.getAppointmentId()
            ] = appointmentWrapper.getBasicInfo();
      }

      return raiseSuccess(
        res,
        200,
        {
          appointments: {
            ...appointmentApiData,
          },
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

  delete = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      Logger.debug("REQUEST ------> ", req.params);
      const { params: { appointment_id } = {}, userDetails: { userId } = {} } = req;


      const carePlanAppointmentDetails = await carePlanAppointmentService.deleteCarePlanAppointmentByAppointmentId(appointment_id);

      const appointmentDetails = await appointmentService.deleteAppointment(appointment_id);

      return raiseSuccess(
        res,
        200,
        {},
        `Appointment deleted successfully`
      );

    } catch (error) {
      Logger.debug("delete 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new AppointmentController();
