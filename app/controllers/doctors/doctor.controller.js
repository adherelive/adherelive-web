// import DoctorWrapper from "../../services/doctor/doctorHelper";

import Controller from "../index";
import Log from "../../../libs/log";
import moment from "moment";

import userService from "../../services/user/user.service";
import doctorService from "../../services/doctor/doctor.service";
import doctorQualificationService from "../../services/doctorQualifications/doctorQualification.service";
import doctorClinicService from "../../services/doctorClinics/doctorClinics.service";
import uploadDocumentService from "../../services/uploadDocuments/uploadDocuments.service";
import doctorRegistrationService from "../../services/doctorRegistration/doctorRegistration.service";

import UserWrapper from "../../ApiWrapper/web/user";
import DoctorWrapper from "../../ApiWrapper/web/doctor";
import DoctorQualificationWrapper from "../../ApiWrapper/web/doctorQualification";
import DoctorClinicWrapper from "../../ApiWrapper/web/doctorClinic";
import UploadDocumentWrapper from "../../ApiWrapper/web/uploadDocument";
import DoctorRegistrationWrapper from "../../ApiWrapper/web/doctorRegistration";
import {DOCUMENT_PARENT_TYPE, USER_CATEGORY} from "../../../constant";

const Logger = new Log("WEB > DOCTOR > CONTROLLER");

class DoctorController extends Controller {
  constructor() {
    super();
  }

  getAll = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const doctors = await doctorService.getAllDoctors();

      Logger.debug("getAll --> ", doctors);

      let doctorApiDetails = {};
      let userApiDetails = {};
      let userIds = [];
      let doctorIds = [];

      await doctors.forEach(async doctor => {
        const doctorWrapper = await DoctorWrapper(doctor);

        doctorApiDetails[
          doctorWrapper.getDoctorId()
        ] = doctorWrapper.getBasicInfo();
        doctorIds.push(doctorWrapper.getDoctorId());
        userIds.push(doctorWrapper.getUserId());
      });

      const userDetails = await userService.getUserByData({
        category: USER_CATEGORY.DOCTOR
      });

      await userDetails.forEach(async user => {
        const userWrapper = await UserWrapper(user.get());
        userApiDetails[userWrapper.getId()] = userWrapper.getBasicInfo();
      });

      return raiseSuccess(
        res,
        200,
        {
          users: {
            ...userApiDetails
          },
          doctors: {
            ...doctorApiDetails
          },
          user_ids: userIds,
          doctor_ids: doctorIds
        },
        "doctor details fetched successfully"
      );
    } catch (error) {
      return raiseServerError(res);
    }
  };

  getAllDoctorDetails = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const { params: { id } = {} } = req;
      const doctors = await doctorService.getDoctorByData({ id });

      let doctorQualificationApiDetails = {};
      let doctorClinicApiDetails = {};
      let uploadDocumentApiDetails = {};
      let doctorRegistrationApiDetails = {};
      let doctor_qualification_ids = [];
      let doctor_registration_ids = [];
      let doctor_clinic_ids = [];
      let upload_document_ids = [];

      const doctorWrapper = await DoctorWrapper(doctors);

      const doctorQualifications = await doctorQualificationService.getQualificationsByDoctorId(
        doctorWrapper.getDoctorId()
      );

      const userDetails = await userService.getUserById(
        doctorWrapper.getUserId()
      );
      const userWrapper = await UserWrapper(userDetails.get());

      await doctorQualifications.forEach(async doctorQualification => {
        const doctorQualificationWrapper = await DoctorQualificationWrapper(
          doctorQualification
        );

        const qualificationDocuments = await uploadDocumentService.getDoctorQualificationDocuments(
            "doctor_qualification",
            doctorQualificationWrapper.getDoctorQualificationId()
        );

        await qualificationDocuments.forEach(async document => {
          const uploadDocumentWrapper = await UploadDocumentWrapper(document);
          uploadDocumentApiDetails[
              uploadDocumentWrapper.getUploadDocumentId()
              ] = uploadDocumentWrapper.getBasicInfo();
          upload_document_ids.push(uploadDocumentWrapper.getUploadDocumentId());
        });


        doctorQualificationApiDetails[
          doctorQualificationWrapper.getDoctorQualificationId()
        ] = {
          ...doctorQualificationWrapper.getBasicInfo(),
          upload_document_ids
        };

        doctor_qualification_ids.push(
          doctorQualificationWrapper.getDoctorQualificationId()
        );

        upload_document_ids = [];
      });

      // REGISTRATION DETAILS
      const doctorRegistrations = await doctorRegistrationService.getRegistrationByDoctorId(
          doctorWrapper.getDoctorId()
      );

      Logger.debug("198361283 ---====> ", doctorRegistrations);

      await doctorRegistrations.forEach(async doctorRegistration => {
        const doctorRegistrationWrapper = await DoctorRegistrationWrapper(
            doctorRegistration
        );

        const registrationDocuments = await uploadDocumentService.getDoctorQualificationDocuments(
            DOCUMENT_PARENT_TYPE.DOCTOR_REGISTRATION,
            doctorRegistrationWrapper.getDoctorRegistrationId()
        );

        await registrationDocuments.forEach(async document => {
          const uploadDocumentWrapper = await UploadDocumentWrapper(document);
          uploadDocumentApiDetails[
              uploadDocumentWrapper.getUploadDocumentId()
              ] = uploadDocumentWrapper.getBasicInfo();
          upload_document_ids.push(uploadDocumentWrapper.getUploadDocumentId());
        });


        doctorRegistrationApiDetails[
            doctorRegistrationWrapper.getDoctorRegistrationId()
            ] = {
          ...doctorRegistrationWrapper.getBasicInfo(),
          upload_document_ids
        };

        doctor_registration_ids.push(
            doctorRegistrationWrapper.getDoctorRegistrationId()
        );

        upload_document_ids = [];
      });


      const doctorClinics = await doctorClinicService.getClinicForDoctor(
        doctorWrapper.getDoctorId()
      );

      await doctorClinics.forEach(async doctorClinic => {
        const doctorClinicWrapper = await DoctorClinicWrapper(doctorClinic);
        doctorClinicApiDetails[
          doctorClinicWrapper.getDoctorClinicId()
        ] = doctorClinicWrapper.getBasicInfo();
        doctor_clinic_ids.push(doctorClinicWrapper.getDoctorClinicId());
      });

      return raiseSuccess(
        res,
        200,
        {
          users: {
            [userWrapper.getId()]: userWrapper.getBasicInfo()
          },
          doctors: {
            [doctorWrapper.getDoctorId()]: {
              ...doctorWrapper.getAllInfo(),
              doctor_qualification_ids,
              doctor_clinic_ids,
              doctor_registration_ids,
            }
          },
          doctor_qualifications: {
            ...doctorQualificationApiDetails,
          },
          doctor_clinics: {
            ...doctorClinicApiDetails,
          },
          doctor_registrations: {
            ...doctorRegistrationApiDetails,
          },
          upload_documents: {
            ...uploadDocumentApiDetails,
          }
        },
        "doctor details fetched successfully"
      );
    } catch (error) {
      Logger.debug("500 error", error);
      return raiseServerError(res);
    }
  };

  verifyDoctors = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const { params: { id } = {} } = req;
      const doctorDetails = await doctorService.getDoctorByData({ id });

      const doctorWrapper = await DoctorWrapper(doctorDetails);

      let verifyData = {
        activated_on: moment()
      };

      const userDetails = await userService.updateUser(
        verifyData,
        doctorWrapper.getUserId()
      );

      const userDetailsUpdated = await userService.getUserById(
        doctorWrapper.getUserId()
      );

      const userWrapper = await UserWrapper(userDetailsUpdated.get());

      return raiseSuccess(
        res,
        200,
        {
          users: {
            [userWrapper.getId()]: userWrapper.getBasicInfo()
          },
        },
        "doctor verified successfully"
      );
    } catch (error) {
      Logger.debug("VERIFY DOCTOR 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new DoctorController();
