import Controller from "../../index";
import {
  APPOINTMENT_TYPE,
  DOCUMENT_PARENT_TYPE,
  EVENT_STATUS,
  EVENT_TYPE,
  FAVOURITE_TYPE,
  FEATURE_TYPE,
  NOTIFICATION_STAGES,
  RADIOLOGY,
  S3_DOWNLOAD_FOLDER,
  USER_CATEGORY,
} from "../../../../constant";
import moment from "moment";

import { createLogger } from "../../../../libs/logger";
import AppointmentJob from "../../../jobSdk/Appointments/observer";
import NotificationSdk from "../../../notificationSdk";
import { downloadFileFromS3, uploadImageS3 } from "../user/user.helper";
import { getFilePath } from "../../../helper/s3FilePath";
import { checkAndCreateDirectory } from "../../../helper/common";
// Services
import appointmentService from "../../../services/appointment/appointment.service";
import queueService from "../../../services/awsQueue/queue.service";
import documentService from "../../../services/uploadDocuments/uploadDocuments.service";
import carePlanAppointmentService from "../../../services/carePlanAppointment/carePlanAppointment.service";
import doctorService from "../../../services/doctor/doctor.service";
import patientService from "../../../services/patients/patients.service";
import ScheduleEventService from "../../../services/scheduleEvents/scheduleEvent.service";
import featureDetailService from "../../../services/featureDetails/featureDetails.service";

// Wrappers
import UploadDocumentWrapper from "../../../apiWrapper/mobile/uploadDocument";
import MAppointmentWrapper from "../../../apiWrapper/mobile/appointments";
import DoctorWrapper from "../../../apiWrapper/mobile/doctor";
import PatientWrapper from "../../../apiWrapper/mobile/patient";
import CarePlanAppointmentWrapper from "../../../apiWrapper/mobile/carePlanAppointment";
import CarePlanWrapper from "../../../apiWrapper/mobile/carePlan";

import FeatureDetailsWrapper from "../../../apiWrapper/mobile/featureDetails";

import * as AppointmentHelper from "./appointments.helper";

const path = require("path");

const logger = createLogger("MOBILE APPOINTMENT CONTROLLER");

class MobileAppointmentController extends Controller {
  constructor() {
    super();
  }

  create = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      logger.debug("REQUEST DATA ---> ", req.body);
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
        critical = false,
        radiology_type = "",
      } = body;
      const {
        userId,
        userRoleId,
        userData: { category } = {},
        userCategoryId,
        userCategoryData: { basic_info: { full_name } = {} } = {},
      } = userDetails || {};
      const { id: participant_two_id, category: participant_two_type } =
        participant_two || {};

      const previousAppointments = await appointmentService.checkTimeSlot(
        start_time,
        end_time,
        {
          participant_one_id: userCategoryId,
          participant_one_type: category,
        },
        {
          participant_two_id,
          participant_two_type,
        }
      );

      if (previousAppointments.length > 0) {
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
        organizer_type: category,
        organizer_id: userCategoryId,
        description,
        start_date: moment(date),
        end_date: moment(date),
        start_time,
        end_time,
        provider_id,
        provider_name,
        details: {
          care_plan_id,
          treatment_id,
          reason,
          type,
          type_description,
          critical,
          radiology_type,
        },
      };

      const appointment = await appointmentService.addAppointment(
        appointment_data
      );
      const appointmentData = await MAppointmentWrapper(appointment);

      let participantTwoId = null;

      switch (participant_two_type) {
        // case USER_CATEGORY.DOCTOR:
        //   const doctor = await doctorService.getDoctorByData({
        //     id: participant_two_id
        //   });
        //   const doctorData = await DoctorWrapper(doctor);
        //   participantTwoId = doctorData.getUserId();
        //   break;
        case USER_CATEGORY.PATIENT:
          const patient = await patientService.getPatientById({
            id: participant_two_id,
          });
          const patientData = await PatientWrapper(patient);
          const { user_role_id } = await patientData.getAllInfo();
          participantTwoId = user_role_id;
          break;
        default:
          break;
      }

      const carePlan = await CarePlanWrapper(null, care_plan_id);

      const eventScheduleData = {
        type: EVENT_TYPE.APPOINTMENT,
        event_id: appointmentData.getAppointmentId(),
        event_type: EVENT_TYPE.APPOINTMENT,
        critical,
        start_time,
        end_time,
        details: appointmentData.getBasicInfo(),
        participants: [
          userRoleId,
          participantTwoId,
          ...carePlan.getCareplnSecondaryProfiles(),
        ],
        actor: {
          id: userId,
          user_role_id: userRoleId,
          details: { name: full_name, category },
        },
      };

      const QueueService = new queueService();

      await QueueService.sendMessage(eventScheduleData);

      const appointmentJob = AppointmentJob.execute(
        EVENT_STATUS.SCHEDULED,
        eventScheduleData
      );
      await NotificationSdk.execute(appointmentJob);

      // ADD CARE_PLAN APPOINTMENT
      if (care_plan_id) {
        const carePlanAppointment =
          await carePlanAppointmentService.addCarePlanAppointment({
            care_plan_id,
            appointment_id: appointmentData.getAppointmentId(),
          });

        const careplanAppointmentData = await CarePlanAppointmentWrapper(
          carePlanAppointment
        );

        return raiseSuccess(
          res,
          200,
          {
            ...(await careplanAppointmentData.getReferenceInfo()),
          },
          `appointment created for careplan id : ${care_plan_id}`
        );
      }

      return raiseSuccess(
        res,
        200,
        {
          appointments: {
            [appointmentData.getAppointmentId()]:
              appointmentData.getBasicInfo(),
          },
        },
        "appointment created successfully"
      );
    } catch (error) {
      logger.error("500 error --> ", error);
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
      // logger.debug("appointmentList", appointmentList);

      // if (appointmentList.length > 0) {
      let appointmentApiData = {};

      for (const appointment of appointmentList) {
        const appointmentWrapper = await MAppointmentWrapper(appointment);
        appointmentApiData[appointmentWrapper.getAppointmentId()] =
          appointmentWrapper.getBasicInfo();
      }

      return raiseSuccess(
        res,
        200,
        {
          appointments: {
            ...appointmentApiData,
          },
        },
        `Appointment data for patient: ${id} fetched successfully`
      );
      // } else {
      // }
    } catch (error) {
      // logger.error("500 error", error);
      return raiseServerError(res);
    }
  };

  update = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      logger.debug("REQUEST PARAM ---> ", req.params);
      logger.debug("REQUEST DATA ---> ", req.body);
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
        critical = false,
        radiology_type = "",
      } = body;
      const {
        userId,
        userRoleId,
        userData: { category } = {},
        userCategoryId,
        userCategoryData: { basic_info: { full_name } = {} } = {},
      } = userDetails || {};
      const { id: participant_two_id, category: participant_two_type } =
        participant_two || {};

      // careplan id for appointment
      const { care_plan_id = null } =
        (await carePlanAppointmentService.getSingleCarePlanAppointmentByData({
          appointment_id: id,
        })) || {};

      const oldAppointment = await appointmentService.getAppointmentById(id);

      const oldAppointmentData = await MAppointmentWrapper(oldAppointment);

      if (
        moment(date).diff(moment(oldAppointmentData.getStartDate()), "d") !==
          0 ||
        moment(start_time).diff(
          moment(oldAppointmentData.getStartTime()),
          "m"
        ) !== 0 ||
        moment(end_time).diff(moment(oldAppointmentData.getEndTime()), "m") !==
          0
      ) {
        const previousAppointments = await appointmentService.checkTimeSlot(
          start_time,
          end_time,
          {
            participant_one_id: userCategoryId,
            participant_one_type: category,
          },
          {
            participant_two_id,
            participant_two_type,
          }
        );

        const filteredAppointments = previousAppointments.filter(
          (appointment) => {
            return `${appointment.get("id")}` !== id;
          }
        );

        if (filteredAppointments.length > 0) {
          return raiseClientError(
            res,
            422,
            {
              error_type: "slot_present",
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
        organizer_type: category,
        organizer_id: userCategoryId,
        description,
        start_date: moment(date),
        end_date: moment(date),
        start_time,
        end_time,
        provider_id,
        provider_name,
        details: {
          care_plan_id,
          treatment_id,
          reason,
          type,
          type_description,
          critical,
          radiology_type,
        },
      };

      const appointment = await appointmentService.updateAppointment(
        id,
        appointment_data
      );

      const updatedAppointmentDetails =
        await appointmentService.getAppointmentById(id);

      const appointmentApiData = await MAppointmentWrapper(
        updatedAppointmentDetails
      );

      let participantTwoId = null;

      switch (participant_two_type) {
        // case USER_CATEGORY.DOCTOR:
        //   const doctor = await doctorService.getDoctorByData({
        //     id: participant_two_id
        //   });
        //   const doctorData = await DoctorWrapper(doctor);
        //   participantTwoId = doctorData.getUserId();
        //   break;
        case USER_CATEGORY.PATIENT:
          const patient = await patientService.getPatientById({
            id: participant_two_id,
          });
          const patientData = await PatientWrapper(patient);
          const { user_role_id } = await patientData.getAllInfo();
          participantTwoId = user_role_id;
          break;
        default:
          break;
      }

      // 1. delete
      const scheduleEventService = new ScheduleEventService();
      await scheduleEventService.deleteBatch({
        event_id: id,
        event_type: EVENT_TYPE.APPOINTMENT,
      });

      const carePlan = await CarePlanWrapper(null, care_plan_id);

      // 2. new sqs for updated appointment
      const eventScheduleData = {
        type: EVENT_TYPE.APPOINTMENT,
        event_id: appointmentApiData.getAppointmentId(),
        event_type: EVENT_TYPE.APPOINTMENT,
        critical,
        start_time,
        end_time,
        details: appointmentApiData.getBasicInfo(),
        participants: [
          userRoleId,
          participantTwoId,
          ...carePlan.getCareplnSecondaryProfiles(),
        ],
        actor: {
          id: userId,
          user_role_id: userRoleId,
          details: { name: full_name, category },
        },
      };

      const QueueService = new queueService();
      await QueueService.sendMessage(eventScheduleData);

      const appointmentJob = AppointmentJob.execute(
        NOTIFICATION_STAGES.UPDATE,
        eventScheduleData
      );
      await NotificationSdk.execute(appointmentJob);

      return raiseSuccess(
        res,
        200,
        {
          appointments: {
            [appointmentApiData.getAppointmentId()]: {
              ...appointmentApiData.getBasicInfo(),
            },
          },
        },
        "appointment updated successfully"
      );
    } catch (error) {
      logger.error("update 500 error", error);
      return raiseServerError(res);
    }
  };

  delete = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      logger.debug("APPOINTMENT REQUEST DATA ---> ", req.params);
      const {
        params: { id: appointment_id } = {},
        userDetails: { userId } = {},
      } = req;

      const carePlanAppointmentDetails =
        await carePlanAppointmentService.deleteCarePlanAppointmentByAppointmentId(
          appointment_id
        );
      const appointmentDetails = await appointmentService.deleteAppointment(
        appointment_id
      );

      // 1. delete events
      const scheduleEventService = new ScheduleEventService();
      await scheduleEventService.deleteBatch({
        event_id: appointment_id,
        event_type: EVENT_TYPE.APPOINTMENT,
      });

      return raiseSuccess(res, 200, {}, `Appointment deleted successfully`);
    } catch (error) {
      // logger.error("500 error", error);
      return raiseServerError(res);
    }
  };

  getAppointmentDetails = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const {
        userDetails: { userData: { category }, userCategoryId } = {},
        headers: { version = null } = {},
        headers = {},
      } = req;

      let featureDetails = {};

      if (version) {
        const appointmentDetails = await featureDetailService.getDetailsByData({
          feature_type: FEATURE_TYPE.APPOINTMENT,
        });

        const appointmentData = await FeatureDetailsWrapper(appointmentDetails);
        featureDetails = appointmentData.getFeatureDetails();
        const { type_description, radiology_type_data } = featureDetails || {};

        const userTypeData = {
          id: userCategoryId,
          category,
        };

        const updatedTypeDescriptionWithFavourites =
          await AppointmentHelper.getFavoriteInDetails(
            userTypeData,
            type_description,
            FAVOURITE_TYPE.MEDICAL_TESTS
          );
        featureDetails = {
          ...featureDetails,
          ...{ type_description: updatedTypeDescriptionWithFavourites },
        };
        const updatedRadiologyDataWithFavourites =
          await AppointmentHelper.getFavoriteInDetails(
            userTypeData,
            radiology_type_data,
            FAVOURITE_TYPE.RADIOLOGY
          );
        featureDetails = {
          ...featureDetails,
          ...{ radiology_type_data: updatedRadiologyDataWithFavourites },
        };
      } else {
        const prevVersionsAppointmentDetails =
          await featureDetailService.getDetailsByData({
            feature_type: FEATURE_TYPE.PREV_VERSION_APPOINTMENT,
          });

        const prevVersionsAppointmentData = await FeatureDetailsWrapper(
          prevVersionsAppointmentDetails
        );
        featureDetails = prevVersionsAppointmentData.getFeatureDetails();
      }

      const { appointment_type = {} } = featureDetails;
      if (category === USER_CATEGORY.HSP) {
        let hspAppointmentType = {};
        for (let each in appointment_type) {
          const { title = "" } = appointment_type[each];
          const { title: radiologyTitle } = APPOINTMENT_TYPE[RADIOLOGY];
          if (title === radiologyTitle) {
            continue;
          }
          hspAppointmentType[each] = appointment_type[each];
        }
        featureDetails["appointment_type"] = { ...hspAppointmentType };
      }

      return raiseSuccess(
        res,
        200,
        {
          static_templates: {
            appointments: { ...featureDetails },
          },
        },
        "Appointment details fetched successfully"
      );
    } catch (error) {
      logger.error("getAppointmentDetails 500 error ", error);
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
  //     logger.error("getTypeDescription 500 error ", error);
  //     return raiseServerError(res);
  //   }
  // };

  uploadAppointmentDoc = async (req, res) => {
    try {
      const {
        userDetails: { userId = null, userData: { category } = {} } = {},
      } = req || {};
      const file = req.file;
      const { params: { appointment_id = null } = {} } = req || {};

      const { originalname: file_name = "" } = file;

      logger.debug("uploadAppointmentDoc file ---> ", file);

      // const scheduleEventService = new ScheduleEventService();

      // const eventForAppointment = await scheduleEventService.getEventByData({
      //   event_id: appointment_id,
      //   event_type: EVENT_TYPE.APPOINTMENT
      // });

      // const scheduleData = await EventWrapper(eventForAppointment);

      // if (scheduleData.getStatus() !== EVENT_STATUS.COMPLETED) {
      //   return this.raiseClientError(
      //     res,
      //     422,
      //     {},
      //     "Cannot upload documents before appointment is complete"
      //   );
      // }
      let appointmentApiData = {};
      const appointmentDetails = await appointmentService.getAppointmentById(
        appointment_id
      );
      let userIsParticipant = true;

      if (appointmentDetails) {
        appointmentApiData = await MAppointmentWrapper(appointmentDetails);

        const { participant_one_id, participant_two_id } =
          appointmentApiData.getParticipants();

        let userCategoryId = null;
        let userCategoryData = null;

        switch (category) {
          case USER_CATEGORY.DOCTOR:
            const doctor = await doctorService.getDoctorByData({
              user_id: userId,
            });
            userCategoryData = await DoctorWrapper(doctor);
            userCategoryId = userCategoryData.getDoctorId();
            break;
          case USER_CATEGORY.HSP:
            const hspDoctor = await doctorService.getDoctorByData({
              user_id: userId,
            });
            userCategoryData = await DoctorWrapper(hspDoctor);
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

        userIsParticipant =
          participant_one_id === userCategoryId ||
          participant_two_id === userCategoryId
            ? true
            : false;
      }

      if (!appointmentDetails || !userIsParticipant) {
        return this.raiseClientError(
          res,
          422,
          {},
          `User is not authorized to upload document.`
        );
      }

      try {
        let files = await uploadImageS3(userId, file);

        const fileUrl = files && files.length ? getFilePath(files[0]) : files;

        const docExist = await documentService.getDocumentByData(
          DOCUMENT_PARENT_TYPE.APPOINTMENT_DOC,
          appointment_id,
          fileUrl
        );

        if (!docExist) {
          const appointmentDoc = await documentService.addDocument({
            parent_type: DOCUMENT_PARENT_TYPE.APPOINTMENT_DOC,
            parent_id: appointment_id,
            document: fileUrl,
            name: file_name,
          });
        }

        let uploadDocumentsData = {};
        const uploadDocuments =
          await documentService.getDoctorQualificationDocuments(
            DOCUMENT_PARENT_TYPE.APPOINTMENT_DOC,
            appointment_id
          );

        for (const uploadDocument of uploadDocuments) {
          const uploadDocumentData = await UploadDocumentWrapper(
            uploadDocument
          );
          uploadDocumentsData[uploadDocumentData.getUploadDocumentId()] =
            uploadDocumentData.getBasicInfo();
        }

        return this.raiseSuccess(
          res,
          200,
          {
            ...(await appointmentApiData.getAllInfo()),
          },
          "Appointment documents uploaded successfully."
        );
      } catch (err) {
        logger.error("Appointment document has an error while uploading for Mobile: ", err);
        return this.raiseServerError(res, 500, {}, `${err.message}`);
      }
    } catch (error) {
      logger.error("Uploading Appointment document has an error in Mobile: ", error);
      return this.raiseServerError(res);
    }
  };

  downloadAppointmentDoc = async (req, res) => {
    try {
      const {
        userDetails: { userId = null, userData: { category } = {} } = {},
        params: { document_id = null } = {},
      } = req || {};

      const uploadDocuments = await documentService.getDocumentById(
        document_id
      );

      if (!uploadDocuments) {
        return this.raiseClientError(
          res,
          422,
          {},
          `No such document available.`
        );
      }

      const uploadDocumentData = await UploadDocumentWrapper(uploadDocuments);
      const { basic_info: { name, document, parent_id, parent_type } = {} } =
        uploadDocumentData.getBasicInfo();

      const appointmentDetails = await appointmentService.getAppointmentById(
        parent_id
      );
      let userIsParticipant = true;

      if (appointmentDetails) {
        const appointmentApiData = await MAppointmentWrapper(
          appointmentDetails
        );

        const { participant_one_id, participant_two_id } =
          appointmentApiData.getParticipants();

        let userCategoryId = null;
        let userCategoryData = null;

        switch (category) {
          case USER_CATEGORY.DOCTOR:
            const doctor = await doctorService.getDoctorByData({
              user_id: userId,
            });
            userCategoryData = await DoctorWrapper(doctor);
            userCategoryId = userCategoryData.getDoctorId();
            break;
          case USER_CATEGORY.HSP:
            const hspDoctor = await doctorService.getDoctorByData({
              user_id: userId,
            });
            userCategoryData = await DoctorWrapper(hspDoctor);
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

        userIsParticipant =
          participant_one_id === userCategoryId ||
          participant_two_id === userCategoryId
            ? true
            : false;
      }

      if (!appointmentDetails || !userIsParticipant) {
        return this.raiseClientError(
          res,
          422,
          {},
          `User is not authorized to download document.`
        );
      }

      checkAndCreateDirectory(S3_DOWNLOAD_FOLDER);

      const appointmentDocPath = `${S3_DOWNLOAD_FOLDER}/${name}`;

      const downloadDoc = await downloadFileFromS3(
        getFilePath(document),
        appointmentDocPath
      );

      const options = {
        root: path.join(__dirname, `../../../../${S3_DOWNLOAD_FOLDER}/`),
      };
      return res.sendFile(name, options);
    } catch (error) {
      logger.error("downloadAppointmentDoc 500 error: ", error);
      return this.raiseServerError(res);
    }
  };

  deleteAppointmentDoc = async (req, res) => {
    try {
      const {
        userDetails: { userId = null, userData: { category } = {} } = {},
      } = req || {};
      const { params: { document_id = null } = {} } = req || {};

      const documentData = await documentService.getDocumentById(document_id);

      if (!documentData) {
        return this.raiseClientError(
          res,
          422,
          {},
          `No such document available.`
        );
      }

      const uploadDocumentData = await UploadDocumentWrapper(documentData);

      const { basic_info: { parent_id } = {} } =
        uploadDocumentData.getBasicInfo();

      const appointmentDetails = await appointmentService.getAppointmentById(
        parent_id
      );
      let userIsParticipant = true;

      if (appointmentDetails) {
        const appointmentApiData = await MAppointmentWrapper(
          appointmentDetails
        );
        const { participant_one_id, participant_two_id } =
          appointmentApiData.getParticipants();

        let userCategoryId = null;
        let userCategoryData = null;

        switch (category) {
          case USER_CATEGORY.DOCTOR:
            const doctor = await doctorService.getDoctorByData({
              user_id: userId,
            });
            userCategoryData = await DoctorWrapper(doctor);
            userCategoryId = userCategoryData.getDoctorId();
            break;
          case USER_CATEGORY.HSP:
            const hspDoctor = await doctorService.getDoctorByData({
              user_id: userId,
            });
            userCategoryData = await DoctorWrapper(hspDoctor);
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

        userIsParticipant =
          participant_one_id === userCategoryId ||
          participant_two_id === userCategoryId
            ? true
            : false;
      }

      if (!appointmentDetails || !userIsParticipant) {
        return this.raiseClientError(
          res,
          422,
          {},
          `User is not authorized to delete document.`
        );
      }

      const deleteDocs = await documentService.deleteDocumentsOfAppointment(
        document_id
      );

      const appointment = await MAppointmentWrapper(appointmentDetails);

      return this.raiseSuccess(
        res,
        200,
        {
          ...(await appointment.getAllInfo()),
        },
        "Appointment documents deleted successfully."
      );
    } catch (error) {
      logger.error("deleteAppointmentDoc 500 error: ", error);
      return this.raiseServerError(res);
    }
  };
}

export default new MobileAppointmentController();
