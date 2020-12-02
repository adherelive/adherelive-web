import Controller from "../index";
import Log from "../../../libs/log";
import moment from "moment";

import userService from "../../services/user/user.service";
import doctorService from "../../services/doctor/doctor.service";
import providerService from "../../services/provider/provider.service";
import doctorProviderMappingService from "../../services/doctorProviderMapping/doctorProviderMapping.service";
import qualificationService from "../../services/doctorQualifications/doctorQualification.service";
import clinicService from "../../services/doctorClinics/doctorClinics.service";
import documentService from "../../services/uploadDocuments/uploadDocuments.service";
import registrationService from "../../services/doctorRegistration/doctorRegistration.service";
import degreeService from "../../services/degree/degree.service";
import collegeService from "../../services/college/college.service";
import councilService from "../../services/council/council.service";

import UserWrapper from "../../ApiWrapper/web/user";
import DoctorWrapper from "../../ApiWrapper/web/doctor";
import ProviderWrapper from "../../ApiWrapper/web/provider";
import DoctorProviderMappingWrapper from "../../ApiWrapper/web/doctorProviderMapping";
import QualificationWrapper from "../../ApiWrapper/web/doctorQualification";
import RegistrationWrapper from "../../ApiWrapper/web/doctorRegistration";
import ClinicWrapper from "../../ApiWrapper/web/doctorClinic";
import DegreeWrapper from "../../ApiWrapper/web/degree";
import CollegeWrapper from "../../ApiWrapper/web/college";
import CouncilWrapper from "../../ApiWrapper/web/council";
import UploadDocumentWrapper from "../../ApiWrapper/web/uploadDocument";

import bcrypt from "bcrypt";

import { DOCUMENT_PARENT_TYPE, EMAIL_TEMPLATE_NAME } from "../../../constant";

import { generatePassword } from "../helper/passwordGenerator";

import { USER_CATEGORY } from "../../../constant";

import { Proxy_Sdk, EVENTS } from "../../proxySdk";

import { v4 as uuidv4 } from "uuid";

const Logger = new Log("WEB > PROVIDERS > CONTROLLER");

class ProvidersController extends Controller {
  constructor() {
    super();
  }

  getAll = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const { userDetails: { userId } = {} } = req;

      const providerData = await providerService.getProviderByData({
        user_id: userId
      });
      const provider = await ProviderWrapper(providerData);
      const providerId = provider.getProviderId();

      let doctorIds = [];
      const doctorProviderMapping = await doctorProviderMappingService.getDoctorProviderMappingByData(
        { provider_id: providerId }
      );

      for (const mappingData of doctorProviderMapping) {
        const mappingWrapper = await DoctorProviderMappingWrapper(mappingData);
        const doctorId = mappingWrapper.getDoctorId();
        doctorIds.push(doctorId);
      }

      console.log("doctor ids got are: ", doctorIds);

      let doctorApiDetails = {};
      let userApiDetails = {};
      // let userIds = [];
      let specialityDetails = {};
      let doctorQualificationApiDetails = {};
      let doctorClinicApiDetails = {};
      let uploadDocumentApiDetails = {};
      let doctorRegistrationApiDetails = {};
      let degreeApiDetails = {};
      let councilApiDetails = {};
      let collegeApiDetails = {};
      let upload_document_ids = [];

      let registration_council_ids = [];
      let degree_ids = [];
      let college_ids = [];
      let userIds = [];

      for (const doctor of doctorIds) {
        let doctor_qualification_ids = [];
        let doctor_registration_ids = [];
        let doctor_clinic_ids = [];
        const doctorWrapper = await DoctorWrapper(null, doctor);
        const { specialities } = await doctorWrapper.getReferenceInfo();
        specialityDetails = { ...specialityDetails, ...specialities };
        userIds.push(doctorWrapper.getUserId());


        const doctorQualifications = await qualificationService.getQualificationsByDoctorId(
          doctorWrapper.getDoctorId()
        );

        const userDetails = await userService.getUserById(
          doctorWrapper.getUserId()
        );
        const userWrapper = await UserWrapper(userDetails.get());

        userApiDetails[userWrapper.getId()] = { ...userWrapper.getBasicInfo() };

        await doctorQualifications.forEach(async doctorQualification => {
          const doctorQualificationWrapper = await QualificationWrapper(
            doctorQualification
          );

          const qualificationDocuments = await documentService.getDoctorQualificationDocuments(
            "doctor_qualification",
            doctorQualificationWrapper.getDoctorQualificationId()
          );

          await qualificationDocuments.forEach(async document => {
            const uploadDocumentWrapper = await UploadDocumentWrapper(document);
            uploadDocumentApiDetails[
              uploadDocumentWrapper.getUploadDocumentId()
            ] = uploadDocumentWrapper.getBasicInfo();
            upload_document_ids.push(
              uploadDocumentWrapper.getUploadDocumentId()
            );
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

          degree_ids.push(doctorQualificationWrapper.getDegreeId());

          college_ids.push(doctorQualificationWrapper.getCollegeId());

          upload_document_ids = [];
        });

        // REGISTRATION DETAILS
        const doctorRegistrations = await registrationService.getRegistrationByDoctorId(
          doctorWrapper.getDoctorId()
        );

        Logger.debug("198361283 ---====> ", doctorRegistrations);

        await doctorRegistrations.forEach(async doctorRegistration => {
          const doctorRegistrationWrapper = await RegistrationWrapper(
            doctorRegistration
          );

          const registrationDocuments = await documentService.getDoctorQualificationDocuments(
            DOCUMENT_PARENT_TYPE.DOCTOR_REGISTRATION,
            doctorRegistrationWrapper.getDoctorRegistrationId()
          );

          await registrationDocuments.forEach(async document => {
            const uploadDocumentWrapper = await UploadDocumentWrapper(document);
            uploadDocumentApiDetails[
              uploadDocumentWrapper.getUploadDocumentId()
            ] = uploadDocumentWrapper.getBasicInfo();
            upload_document_ids.push(
              uploadDocumentWrapper.getUploadDocumentId()
            );
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

          registration_council_ids.push(
            doctorRegistrationWrapper.getCouncilId()
          );

          upload_document_ids = [];
        });

        const doctorClinics = await clinicService.getClinicForDoctor(
          doctorWrapper.getDoctorId()
        );

        await doctorClinics.forEach(async doctorClinic => {
          const doctorClinicWrapper = await ClinicWrapper(doctorClinic);
          doctorClinicApiDetails[
            doctorClinicWrapper.getDoctorClinicId()
          ] = doctorClinicWrapper.getBasicInfo();
          doctor_clinic_ids.push(doctorClinicWrapper.getDoctorClinicId());
        });

        const doctorCouncils = await councilService.getCouncilByData({
          id: registration_council_ids
        });

        for (const doctorCouncil of doctorCouncils) {
          const council = await CouncilWrapper(doctorCouncil);
          councilApiDetails[council.getCouncilId()] = council.getBasicInfo();
        }

        const doctorDegrees = await degreeService.getDegreeByData({
          id: degree_ids
        });

        for (const doctorDegree of doctorDegrees) {
          const degree = await DegreeWrapper(doctorDegree);
          degreeApiDetails[degree.getDegreeId()] = degree.getBasicInfo();
        }

        const doctorColleges = await collegeService.getCollegeByData({
          id: college_ids
        });

        for (const doctorCollege of doctorColleges) {
          const college = await CollegeWrapper(doctorCollege);
          collegeApiDetails[college.getCollegeId()] = college.getBasicInfo();
        }

        doctorApiDetails[doctorWrapper.getDoctorId()] = {
          ...doctorWrapper.getBasicInfo(),
          doctor_qualification_ids,
          doctor_clinic_ids,
          doctor_registration_ids
        };
      }

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
          doctor_qualifications: {
            ...doctorQualificationApiDetails
          },
          doctor_clinics: {
            ...doctorClinicApiDetails
          },
          doctor_registrations: {
            ...doctorRegistrationApiDetails
          },
          upload_documents: {
            ...uploadDocumentApiDetails
          },
          colleges: {
            ...collegeApiDetails
          },
          degrees: {
            ...degreeApiDetails
          },
          registration_councils: {
            ...councilApiDetails
          },
          specialities: {
            ...specialityDetails
          },
          user_ids: userIds,
          doctor_ids: doctorIds
        },
        "doctor details fetched successfully"
      );
    } catch (error) {
      Logger.debug("getall 500 error ", error);
      return raiseServerError(res);
    }
  };

  mailPassword = async (req, res) => {
    const { raiseSuccess, raiseServerError, raiseClientError } = this;
    try {
      const {
        userDetails: { userId } = {},
        body: { doctor_id = null } = {}
      } = req;

      const providerData = await providerService.getProviderByData({
        user_id: userId
      });
      const provider = await ProviderWrapper(providerData);
      const providerId = provider.getProviderId();

      if (!doctor_id) {
        return raiseClientError(res, 401, {}, "Invalid doctor.");
      }

      const doctorWrapper = await DoctorWrapper(null, doctor_id);
      const doctorUserId = doctorWrapper.getUserId();

      const link = uuidv4();

      const newPassword = generatePassword();
      const salt = await bcrypt.genSalt(Number(process.config.saltRounds));
      const hash = await bcrypt.hash(newPassword, salt);

      const updateUser = await userService.updateUser(
        { password: hash },
        doctorUserId
      );

      const userDetails = await userService.getUserById(doctorUserId);
      const userWrapper = await UserWrapper(userDetails.get());

      // todo: update password for new user.

      const userEmail = userWrapper.getEmail();

      const emailPayload = {
        title: "Verification mail",
        toAddress: userEmail,
        templateName: EMAIL_TEMPLATE_NAME.WELCOME,
        templateData: {
          title: "Doctor",
          link: process.config.WEB_URL + process.config.app.invite_link + link,
          inviteCard: "",
          mainBodyText: `We are really happy that you chose us. Your temporary password is ${newPassword}.`,
          subBodyText: "Please verify your account",
          buttonText: "Verify",
          host: process.config.WEB_URL,
          contactTo: "patientEngagement@adhere.com"
        }
      };

      Proxy_Sdk.execute(EVENTS.SEND_EMAIL, emailPayload);

      return raiseSuccess(res, 200, {}, "Password mailed successfully.");
    } catch (error) {
      Logger.debug("mailPassword 500 error ", error);
      return raiseServerError(res);
    }
  };
}

export default new ProvidersController();
