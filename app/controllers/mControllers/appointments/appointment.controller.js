import Controller from "../../index";
import appointmentService from "../../../services/appointment/appointment.service";
import {EVENT_STATUS, FEATURE_TYPE, USER_CATEGORY} from "../../../../constant";
import moment from "moment";

import MAppointmentWrapper from "../../../ApiWrapper/mobile/appointments";
import DoctorWrapper from "../../../ApiWrapper/mobile/doctor";
import PatientWrapper from "../../../ApiWrapper/mobile/patient";
import CarePlanAppointmentWrapper from "../../../ApiWrapper/mobile/carePlanAppointment";

import carePlanAppointmentService from "../../../services/carePlanAppointment/carePlanAppointment.service";
import doctorService from "../../../services/doctor/doctor.service";
import patientService from "../../../services/patients/patients.service";

import Log from "../../../../libs/log";
import featureDetailService from "../../../services/featureDetails/featureDetails.service";
import FeatureDetailsWrapper from "../../../ApiWrapper/mobile/featureDetails";
import providerService from "../../../services/provider/provider.service";
import ProviderWrapper from "../../../ApiWrapper/mobile/provider";
import AppointmentJob from "../../../JobSdk/Appointments/observer";
import NotificationSdk from "../../../NotificationSdk";

const Logger = new Log("MOBILE APPOINTMENT CONTROLLER");

class MobileAppointmentController extends Controller {
  constructor() {
    super();
  }

  create = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
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
        care_plan_id = null,
        reason = "",
        type = null,
        type_description = null,
        provider_id = null,
        provider_name = null,
        critical = false
      } = body;
      const { userId, userData: { category } = {} } = userDetails || {};
      const { id: participant_two_id, category: participant_two_type } =
        participant_two || {};

      let userCategoryId = null;
      let userCategoryData = null;

      switch (category) {
        case USER_CATEGORY.DOCTOR:
          const doctor = await doctorService.getDoctorByData({
            user_id: userId
          });
          userCategoryData = await DoctorWrapper(doctor);
          userCategoryId = userCategoryData.getDoctorId();
          break;
        case USER_CATEGORY.PATIENT:
          const patient = await patientService.getPatientByUserId(userId);
          userCategoryData = await PatientWrapper(patient);
          userCategoryId = userCategoryData.getPatientId();
          break;
        default:
          break;
      }

      const previousAppointments = await appointmentService.checkTimeSlot(
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
        provider_id,
        provider_name,
        details: {
          treatment_id,
          reason,
          type,
          type_description,
          critical
        }
      };

      const appointment = await appointmentService.addAppointment(
        appointment_data
      );
      const appointmentData = await MAppointmentWrapper(appointment);

      let participantTwoId = null;

      switch (participant_two_type) {
        case USER_CATEGORY.DOCTOR:
          const doctor = await doctorService.getDoctorByData({
            id: participant_two_id
          });
          const doctorData = await DoctorWrapper(doctor);
          participantTwoId = doctorData.getUserId();
          break;
        case USER_CATEGORY.PATIENT:
          const patient = await patientService.getPatientById({id: participant_two_id});
          const patientData = await PatientWrapper(patient);
          participantTwoId = patientData.getUserId();
          break;
        default:
          break;
      }

      const eventScheduleData = {
        participants: [userId, participantTwoId],
        actor: {
          id: userId,
          details: {
            category,
            name: userCategoryData.getName()
          }
        },
        appointmentId: appointmentData.getAppointmentId()
      };

      const appointmentJob = AppointmentJob.execute(EVENT_STATUS.SCHEDULED, eventScheduleData);
      await NotificationSdk.execute(appointmentJob);

      Logger.debug("appointmentJob ---> ", appointmentJob.getInAppTemplate());

      // ADD CARE_PLAN APPOINTMENT
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
        `Appointment data for patient: ${id} fetched successfully`
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
      Logger.debug("REQUEST PARAM ---> ", req.params);
      Logger.debug("REQUEST DATA ---> ", req.body);
      const { params: { id } = {}, body, userDetails } = req;
      const {
        participant_two,
        description = "",
        date,
        organizer = {},
        start_time,
        end_time,
        treatment_id = "",
        reason = "",
        type = null,
        type_description = null,
        provider_id = null,
        provider_name = null,
        critical = false
      } = body;
        Logger.debug("CONDITION CHECK ---> ",  moment(date));
      const { userId, userData: { category } = {} } = userDetails || {};
      const { id: participant_two_id, category: participant_two_type } =
        participant_two || {};

      const oldAppointment = await appointmentService.getAppointmentById(id);

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

      Logger.debug("CONDITION CHECK ---> 1",  moment(start_time));
      Logger.debug("CONDITION CHECK ---> 2",  moment(oldAppointmentData.getStartTime()));

      if (
        moment(date).diff(moment(oldAppointmentData.getStartDate()), 'd') !== 0 ||
        moment(start_time).diff(moment(oldAppointmentData.getStartTime()), 'm') !==
          0 ||
        moment(end_time).diff(moment(oldAppointmentData.getEndTime()), 'm') !== 0
      ) {
          const previousAppointments = await appointmentService.checkTimeSlot(
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

        const filteredAppointments = previousAppointments.filter(appointment => {
          console.log("appointment id", typeof id,typeof appointment.get("id"));
          return `${appointment.get("id")}` !== id;
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
        organizer_id: Object.keys(organizer).length > 0 ? organizer.id : userId,
        description,
        start_date: moment(date),
        end_date: moment(date),
        start_time,
        end_time,
        provider_id,
        provider_name,
        details: {
          treatment_id,
          reason,
          type,
          type_description,
          critical,
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
      Logger.debug("REQUEST DATA ----> ", req.params);
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

      return raiseSuccess(res, 200, {}, `Appointment deleted successfully`);
    } catch (error) {
      // Logger.debug("500 error", error);
      return raiseServerError(res);
    }
  };

  getAppointmentDetails = async (req, res) => {
    const {raiseSuccess, raiseServerError} = this;
    try {
      const appointmentDetails = await featureDetailService.getDetailsByData({feature_type: FEATURE_TYPE.APPOINTMENT});

      const appointmentData = await FeatureDetailsWrapper(appointmentDetails);

      let providerData = {};

      const providerDetails = await providerService.getAll();

      Logger.debug("providerDetails ---->", providerDetails);

      for(const provider of providerDetails) {
        const providerDetail = await ProviderWrapper(provider);
        providerData[providerDetail.getProviderId()] = providerDetail.getBasicInfo();
      }


      return raiseSuccess(res, 200, {
            static_templates: {
              appointments: {...appointmentData.getFeatureDetails()},
            },
            providers: {
              ...providerData
            }
          },
          "Appointment details fetched successfully");

    } catch(error) {
      Logger.debug("getAppointmentDetails 500 error ", error);
      return raiseServerError(res);
    }
  };

  // getTypeDescription = async (req, res) => {
  //   const {raiseSuccess, raiseServerError} = this;
  //   try {
  //     const {id} = req.query || {};
  //     const appointmentDetails = await featureDetailService.getDetailsByData({feature_type: FEATURE_TYPE.APPOINTMENT});
  //
  //     const appointmentData = await FeatureDetailsWrapper(appointmentDetails);
  //
  //     return raiseSuccess(res, 200, {
  //           ...appointmentData.getAppointmentTypeDescription(id),
  //         },
  //         "Appointment type description details fetched successfully");
  //
  //   } catch(error) {
  //     Logger.debug("getTypeDescription 500 error ", error);
  //     return raiseServerError(res);
  //   }
  // };
}

export default new MobileAppointmentController();
