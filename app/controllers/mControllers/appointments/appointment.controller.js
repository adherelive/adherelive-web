import Controller from "../../index";
import appointmentService from "../../../services/appointment/appointment.service";
import {
  EVENT_STATUS,
  EVENT_TYPE,
  FEATURE_TYPE,
  USER_CATEGORY,
  DOCUMENT_PARENT_TYPE,
  S3_DOWNLOAD_FOLDER,
  NOTIFICATION_STAGES,
  RADIOLOGY,
  FAVOURITE_TYPE
} from "../../../../constant";
import moment from "moment";

import MAppointmentWrapper from "../../../ApiWrapper/mobile/appointments";
import DoctorWrapper from "../../../ApiWrapper/mobile/doctor";
import PatientWrapper from "../../../ApiWrapper/mobile/patient";
import CarePlanAppointmentWrapper from "../../../ApiWrapper/mobile/carePlanAppointment";
import EventWrapper from "../../../ApiWrapper/common/scheduleEvents";

import carePlanAppointmentService from "../../../services/carePlanAppointment/carePlanAppointment.service";
import doctorService from "../../../services/doctor/doctor.service";
import patientService from "../../../services/patients/patients.service";
import ScheduleEventService from "../../../services/scheduleEvents/scheduleEvent.service";

import Log from "../../../../libs/log";
import featureDetailService from "../../../services/featureDetails/featureDetails.service";
import FeatureDetailsWrapper from "../../../ApiWrapper/mobile/featureDetails";
import AppointmentJob from "../../../JobSdk/Appointments/observer";
import NotificationSdk from "../../../NotificationSdk";
import { uploadImageS3 } from "../user/userHelper";
import { getFilePath } from "../../../helper/filePath";
import { downloadFileFromS3 } from "../user/userHelper";
import { checkAndCreateDirectory } from "../../../helper/common";

const path = require("path");

// SERVICES...
import queueService from "../../../services/awsQueue/queue.service";
import documentService from "../../../services/uploadDocuments/uploadDocuments.service";

// WRAPPERS...
import ProviderWrapper from "../../../ApiWrapper/mobile/provider";
import UploadDocumentWrapper from "../../../ApiWrapper/mobile/uploadDocument";


import * as AppointmentHelper from "./helper";

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
        critical = false,
        radiology_type=""
      } = body;
      const {
        userId,
        userData: { category } = {},
        userCategoryId,
        userCategoryData: { basic_info: { full_name } = {} } = {}
      } = userDetails || {};
      const { id: participant_two_id, category: participant_two_type } =
        participant_two || {};

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
          critical,
          [type === RADIOLOGY && "radiology_type" ]:type === RADIOLOGY && radiology_type 
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
          const patient = await patientService.getPatientById({
            id: participant_two_id
          });
          const patientData = await PatientWrapper(patient);
          participantTwoId = patientData.getUserId();
          break;
        default:
          break;
      }

      const eventScheduleData = {
        type: EVENT_TYPE.APPOINTMENT,
        event_id: appointmentData.getAppointmentId(),
        event_type: EVENT_TYPE.APPOINTMENT,
        critical,
        start_time,
        end_time,
        details: appointmentData.getBasicInfo(),
        participants: [userId, participantTwoId],
        actor: {
          id: userId,
          details: { name: full_name, category }
        }
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
        critical = false,
        radiology_type="",
      } = body;
      const {
        userId,
        userData: { category } = {},
        userCategoryId,
        userCategoryData: { basic_info: { full_name } = {} } = {}
      } = userDetails || {};
      const { id: participant_two_id, category: participant_two_type } =
        participant_two || {};

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
            participant_one_type: category
          },
          {
            participant_two_id,
            participant_two_type
          }
        );

        const filteredAppointments = previousAppointments.filter(
          appointment => {
            console.log(
              "appointment id",
              typeof id,
              typeof appointment.get("id")
            );
            return `${appointment.get("id")}` !== id;
          }
        );

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
          [type === RADIOLOGY && "radiology_type" ]:type === RADIOLOGY && radiology_type
        }
      };

      const appointment = await appointmentService.updateAppointment(
        id,
        appointment_data
      );

      const updatedAppointmentDetails = await appointmentService.getAppointmentById(
        id
      );

      const appointmentApiData = await MAppointmentWrapper(
        updatedAppointmentDetails
      );

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
          const patient = await patientService.getPatientById({
            id: participant_two_id
          });
          const patientData = await PatientWrapper(patient);
          participantTwoId = patientData.getUserId();
          break;
        default:
          break;
      }

      // 1. delete
      const scheduleEventService = new ScheduleEventService();
      await scheduleEventService.deleteBatch({
        event_id: id,
        event_type: EVENT_TYPE.APPOINTMENT
      });

      // 2. new sqs for updated appointment
      const eventScheduleData = {
        type: EVENT_TYPE.APPOINTMENT,
        event_id: appointmentApiData.getAppointmentId(),
        event_type: EVENT_TYPE.APPOINTMENT,
        critical,
        start_time,
        end_time,
        details: appointmentApiData.getBasicInfo(),
        participants: [userId, participantTwoId],
        actor: {
          id: userId,
          details: { name: full_name, category }
        }
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
        params: { id: appointment_id } = {},
        userDetails: { userId } = {}
      } = req;

      const carePlanAppointmentDetails = await carePlanAppointmentService.deleteCarePlanAppointmentByAppointmentId(
        appointment_id
      );
      const appointmentDetails = await appointmentService.deleteAppointment(
        appointment_id
      );

      // 1. delete events
      const scheduleEventService = new ScheduleEventService();
      await scheduleEventService.deleteBatch({
        event_id: appointment_id,
        event_type: EVENT_TYPE.APPOINTMENT
      });

      return raiseSuccess(res, 200, {}, `Appointment deleted successfully`);
    } catch (error) {
      // Logger.debug("500 error", error);
      return raiseServerError(res);
    }
  };

  getAppointmentDetails = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {

      const {userDetails: {userData: {category}, userCategoryId} = {}} = req;
      const appointmentDetails = await featureDetailService.getDetailsByData({
        feature_type: FEATURE_TYPE.APPOINTMENT
      });

      const appointmentData = await FeatureDetailsWrapper(appointmentDetails);

      let featureDetails = appointmentData.getFeatureDetails();

      const {type_description, radiology_type_data} =  featureDetails || {};

      const userTypeData = {
        id: userCategoryId,
        category,
      };

      const updatedTypeDescriptionWithFavourites = await AppointmentHelper.getFavoriteInDetails(userTypeData, type_description, FAVOURITE_TYPE.MEDICAL_TESTS);

      featureDetails = {...featureDetails, ...{type_description: updatedTypeDescriptionWithFavourites}}

      const updatedRadiologyDataWithFavourites = await AppointmentHelper.getFavoriteInDetails(userTypeData, radiology_type_data, FAVOURITE_TYPE.RADIOLOGY);

      featureDetails = {...featureDetails, ...{radiology_type_data: updatedRadiologyDataWithFavourites}}



      return raiseSuccess(
        res,
        200,
        {
          static_templates: {
            appointments: { ...featureDetails }
          }
        },
        "Appointment details fetched successfully"
      );
    } catch (error) {
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

  uploadAppointmentDoc = async (req, res) => {
    try {
      const {
        userDetails: { userId = null, userData: { category } = {} } = {}
      } = req || {};
      const file = req.file;
      const { params: { appointment_id = null } = {} } = req || {};

      const { originalname: file_name = "" } = file;

      Logger.debug("file ----> ", file);

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

        const {
          participant_one_id,
          participant_two_id
        } = appointmentApiData.getParticipants();

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
            name: file_name
          });
        }

        let uploadDocumentsData = {};
        const uploadDocuments = await documentService.getDoctorQualificationDocuments(
          DOCUMENT_PARENT_TYPE.APPOINTMENT_DOC,
          appointment_id
        );

        for (const uploadDocument of uploadDocuments) {
          const uploadDocumentData = await UploadDocumentWrapper(
            uploadDocument
          );
          uploadDocumentsData[
            uploadDocumentData.getUploadDocumentId()
          ] = uploadDocumentData.getBasicInfo();
        }

        return this.raiseSuccess(
          res,
          200,
          {
            ...(await appointmentApiData.getAllInfo())
          },
          "Appointment documents uploaded successfully."
        );
      } catch (err) {
        Logger.debug("APPOINTMENT DOC UPLOAD CATCH ERROR ", err);
        return this.raiseServerError(res, 500, {}, `${err.message}`);
      }
    } catch (error) {
      Logger.debug("uploadAppointmentDoc 500 error: ", error);
      return this.raiseServerError(res);
    }
  };

  downloadAppointmentDoc = async (req, res) => {
    try {
      const {
        userDetails: { userId = null, userData: { category } = {} } = {},
        params: { document_id = null } = {}
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
      const {
        basic_info: { name, document, parent_id, parent_type } = {}
      } = uploadDocumentData.getBasicInfo();

      const appointmentDetails = await appointmentService.getAppointmentById(
        parent_id
      );
      let userIsParticipant = true;

      if (appointmentDetails) {
        const appointmentApiData = await MAppointmentWrapper(
          appointmentDetails
        );

        const {
          participant_one_id,
          participant_two_id
        } = appointmentApiData.getParticipants();

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

        userIsParticipant =
          participant_one_id === userCategoryId ||
          participant_two_id === userCategoryId
            ? true
            : false;
      }

      console.log("values are: ", appointmentDetails, userIsParticipant);

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
        root: path.join(__dirname, `../../../../${S3_DOWNLOAD_FOLDER}/`)
      };
      return res.sendFile(name, options);
    } catch (error) {
      Logger.debug("downloadAppointmentDoc 500 error: ", error);
      return this.raiseServerError(res);
    }
  };

  deleteAppointmentDoc = async (req, res) => {
    try {
      const {
        userDetails: { userId = null, userData: { category } = {} } = {}
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

      const {
        basic_info: { parent_id } = {}
      } = uploadDocumentData.getBasicInfo();

      const appointmentDetails = await appointmentService.getAppointmentById(
        parent_id
      );
      let userIsParticipant = true;

      if (appointmentDetails) {
        const appointmentApiData = await MAppointmentWrapper(
          appointmentDetails
        );
        const {
          participant_one_id,
          participant_two_id
        } = appointmentApiData.getParticipants();

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
          ...(await appointment.getAllInfo())
        },
        "Appointment documents deleted successfully."
      );
    } catch (error) {
      Logger.debug("deleteAppointmentDoc 500 error: ", error);
      return this.raiseServerError(res);
    }
  };
}

export default new MobileAppointmentController();
