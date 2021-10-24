import Controller from "../index";
import Log from "../../../libs/log";
import moment from "moment";

import userService from "../../services/user/user.service";
import doctorService from "../../services/doctor/doctor.service";
import doctorsService from "../../services/doctors/doctors.service";
import patientsService from "../../services/patients/patients.service";
import treatmentService from "../../services/treatment/treatment.service";
import specialityService from "../../services/speciality/speciality.service";
import patientService from "../../../app/services/patients/patients.service";

import qualificationService from "../../services/doctorQualifications/doctorQualification.service";
import clinicService from "../../services/doctorClinics/doctorClinics.service";
import documentService from "../../services/uploadDocuments/uploadDocuments.service";
import registrationService from "../../services/doctorRegistration/doctorRegistration.service";
import carePlanTemplateService from "../../services/carePlanTemplate/carePlanTemplate.service";
import carePlanService from "../../services/carePlan/carePlan.service";
import SymptomService from "../../services/symptom/symptom.service";
// import medicineService from "../../services/medicine/medicine.service";
// import templateMedicationService from "../../services/templateMedication/templateMedication.service";
// import templateAppointmentService from "../../services/templateAppointment/templateAppointment.service";
import degreeService from "../../services/degree/degree.service";
import collegeService from "../../services/college/college.service";
import councilService from "../../services/council/council.service";
import AccountDetailsService from "../../services/accountDetails/accountDetails.service";
import providerService from "../../services/provider/provider.service";
import doctorProviderMappingService from "../../services/doctorProviderMapping/doctorProviderMapping.service";
import featuresService from "../../services/features/features.service";
import doctorPatientFeatureMappingService from "../../services/doctorPatientFeatureMapping/doctorPatientFeatureMapping.service";
import careplanSecondaryDoctorMappingService from "../../services/careplanSecondaryDoctorMappings/careplanSecondaryDoctorMappings.service";
// import TemplateMedicationWrapper from "../../ApiWrapper/web/templateMedication";
// import TemplateAppointmentWrapper from "../../ApiWrapper/web/templateAppointment";
import DegreeWrapper from "../../ApiWrapper/mobile/degree";
import UserWrapper from "../../ApiWrapper/web/user";
import DoctorWrapper from "../../ApiWrapper/web/doctor";
import PatientWrapper from "../../ApiWrapper/web/patient";
import UploadDocumentWrapper from "../../ApiWrapper/web/uploadDocument";
import CarePlanWrapper from "../../ApiWrapper/web/carePlan";
import QualificationWrapper from "../../ApiWrapper/web/doctorQualification";
import RegistrationWrapper from "../../ApiWrapper/web/doctorRegistration";
import CarePlanTemplateWrapper from "../../ApiWrapper/web/carePlanTemplate";
import ClinicWrapper from "../../ApiWrapper/web/doctorClinic";
// import MedicineApiWrapper from "../../ApiWrapper/web/medicine";
// import DegreeWrapper from "../../ApiWrapper/web/degree";
import CollegeWrapper from "../../ApiWrapper/web/college";
import CouncilWrapper from "../../ApiWrapper/web/council";
import AccountDetailsWrapper from "../../ApiWrapper/web/accountsDetails";
import ProviderWrapper from "../../ApiWrapper/web/provider";
import FeatureMappingWrapper from "../../ApiWrapper/web/doctorPatientFeatureMapping";
import TreatmentWrapper from "../../ApiWrapper/web/treatments";
import UserRoleWrapper from "../../ApiWrapper/web/userRoles";
import SpecialityWrapper from "../../ApiWrapper/web/speciality";
import UserPreferenceWrapper from "../../ApiWrapper/web/userPreference";
import AuthJob from "../../JobSdk/Auth/observer";
import NotificationSdk from "../../NotificationSdk";
// import { createNewUser } from "../user/userHelper";
// import { generatePassword } from "../helper/passwordGenerator";
import DoctorPatientWatchlistWrapper from "../../ApiWrapper/web/doctorPatientWatchlist";

import { addProviderDoctor } from "./providerHelper";

import {
  ALLOWED_DOC_TYPE_DOCTORS,
  DOCUMENT_PARENT_TYPE,
  EMAIL_TEMPLATE_NAME,
  EVENT_TYPE,
  ONBOARDING_STATUS,
  SIGN_IN_CATEGORY,
  USER_CATEGORY,
  VERIFICATION_TYPE,
  PATIENT_MEAL_TIMINGS,
  FEATURES,
  NOTIFICATION_VERB,
  NO_MEDICATION,
  NO_APPOINTMENT,
  NO_ACTION
} from "../../../constant";
import { getFilePath, completePath } from "../../helper/filePath";
import getReferenceId from "../../helper/referenceIdGenerator";
import getUniversalLink from "../../helper/universalLink";
import getAge from "../../helper/getAge";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { uploadImageS3 } from "../user/userHelper";
import { EVENTS, Proxy_Sdk } from "../../proxySdk";
import UserVerificationServices from "../../services/userVerifications/userVerifications.services";
import UserPreferenceService from "../../services/userPreferences/userPreference.service";
import userRolesService from "../../services/userRoles/userRoles.service";
import doctorPatientWatchlistService from "../../services/doctorPatientWatchlist/doctorPatientWatchlist.service";
import { getRoomId, getSeparateName } from "../../helper/common";
import userPreferenceService from "../../services/userPreferences/userPreference.service";
import { raiseClientError } from "../../../routes/api/helper";
import { raiseClientError } from "../../../routes/helper";
// import doctor from "../../ApiWrapper/web/doctor";
// import college from "../../ApiWrapper/web/college";

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
      let specialityDetails = {};

      for (const doctor of doctors) {
        const doctorWrapper = await DoctorWrapper(doctor);

        doctorApiDetails[
          doctorWrapper.getDoctorId()
        ] = await doctorWrapper.getAllInfo();
        const { specialities } = await doctorWrapper.getReferenceInfo();
        specialityDetails = { ...specialityDetails, ...specialities };
        doctorIds.push(doctorWrapper.getDoctorId());
        userIds.push(doctorWrapper.getUserId());
      }

      const userDetails = await userService.getUserByData({
        category: [USER_CATEGORY.DOCTOR, USER_CATEGORY.HSP]
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

  getAllAdminDoctorDetails = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const { params: { id } = {} } = req;
      const doctors = await doctorService.getDoctorByData({ id }, false);

      let doctorQualificationApiDetails = {};
      let doctorClinicApiDetails = {};
      let uploadDocumentApiDetails = {};
      let doctorRegistrationApiDetails = {};
      let doctor_qualification_ids = [];
      let doctor_registration_ids = [];
      let doctor_clinic_ids = [];
      let upload_document_ids = [];

      let registration_council_ids = [];
      let degree_ids = [];
      let college_ids = [];

      Logger.debug("Doctors --> ", doctors);

      const doctorWrapper = await DoctorWrapper(doctors);

      const doctorQualifications = await qualificationService.getQualificationsByDoctorId(
        doctorWrapper.getDoctorId()
      );

      const userDetails = await userService.getUserById(
        doctorWrapper.getUserId()
      );
      const userWrapper = await UserWrapper(userDetails.get());

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

        registration_council_ids.push(doctorRegistrationWrapper.getCouncilId());

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

      let councilApiDetails = {};
      for (const doctorCouncil of doctorCouncils) {
        const council = await CouncilWrapper(doctorCouncil);
        councilApiDetails[council.getCouncilId()] = council.getBasicInfo();
      }

      const doctorDegrees = await degreeService.getDegreeByData({
        id: degree_ids
      });

      let degreeApiDetails = {};
      for (const doctorDegree of doctorDegrees) {
        const degree = await DegreeWrapper(doctorDegree);
        degreeApiDetails[degree.getDegreeId()] = degree.getBasicInfo();
      }

      const doctorColleges = await collegeService.getCollegeByData({
        id: college_ids
      });

      let collegeApiDetails = {};
      for (const doctorCollege of doctorColleges) {
        const college = await CollegeWrapper(doctorCollege);
        collegeApiDetails[college.getCollegeId()] = college.getBasicInfo();
      }

      return raiseSuccess(
        res,
        200,
        {
          users: {
            [userWrapper.getId()]: userWrapper.getBasicInfo()
          },
          ...(await doctorWrapper.getReferenceInfo()),
          doctors: {
            [doctorWrapper.getDoctorId()]: {
              ...doctorWrapper.getBasicInfo(),
              doctor_qualification_ids,
              doctor_clinic_ids,
              doctor_registration_ids
            }
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

      const doctorQualifications = await qualificationService.getQualificationsByDoctorId(
        doctorWrapper.getDoctorId()
      );
      const doctorRegistrations = await registrationService.getRegistrationByDoctorId(
        doctorWrapper.getDoctorId()
      );
      // const doctorClinics = await clinicService.getClinicForDoctor(
      //   doctorWrapper.getDoctorId()
      // );

      if (doctorQualifications.length === 0) {
        return this.raiseClientError(
          res,
          422,
          {},
          "Doctor has not updated any qualification details yet. Cannot be verified"
        );
      } else if (doctorRegistrations.length === 0) {
        return this.raiseClientError(
          res,
          422,
          {},
          "Doctor has not updated any registration details yet. Cannot be verified"
        );
      }
      // else if (doctorClinics.length === 0) {
      //   return this.raiseClientError(
      //     res,
      //     422,
      //     {},
      //     "Doctor has not updated any clinic details yet. Cannot be verified"
      //   );
      // }

      const {
        basic_info: { first_name, middle_name, last_name } = {}
      } = doctorWrapper.getBasicInfo();

      let verifyData = {
        activated_on: moment(),
        verified: true
      };

      const userDetails = await userService.updateUser(
        verifyData,
        doctorWrapper.getUserId()
      );

      const userDetailsUpdated = await userService.getUserById(
        doctorWrapper.getUserId()
      );

      const userWrapper = await UserWrapper(userDetailsUpdated.get());

      const emailPayload = {
        title: "Doctor Account Verification Update",
        toAddress: userWrapper.getEmail(),
        templateName: EMAIL_TEMPLATE_NAME.VERIFIED_DOCTOR,
        templateData: {
          title: "Doctor",
          link: process.config.WEB_URL,
          inviteCard: "",
          mainBodyText: `Greetings from AdhereLive! We are happy to inform you that your account has been verified.`,
          subBodyText:
            "To enable Add Patient option on your Dashboard, please click on verify and login via the Email and password for the account",
          buttonText: "Welcome",
          host: process.config.WEB_URL,
          contactTo: "customersupport@adhere.live"
        }
      };
      Proxy_Sdk.execute(EVENTS.SEND_EMAIL, emailPayload);

      return raiseSuccess(
        res,
        200,
        {
          users: {
            [userWrapper.getId()]: userWrapper.getBasicInfo()
          }
        },
        "Doctor verified successfully"
      );
    } catch (error) {
      Logger.debug("Verify Doctor - 500 Error", error);
      return raiseServerError(res);
    }
  };

  deactivateDoctor = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const {
        userDetails: { userId = null, userData: { category } = {} } = {},
        params: { doctor_id } = {}
      } = req;

      if (
        category !== USER_CATEGORY.ADMIN &&
        category !== USER_CATEGORY.PROVIDER
      ) {
        return this.raiseClientError(
          res,
          422,
          {},
          `User is not authorized to deactivate Doctor.`
        );
      }

      const doctorDetails = await doctorService.getDoctorByData({
        id: doctor_id
      });

      const doctorWrapper = await DoctorWrapper(doctorDetails);

      const userDetails = await userService.deleteUser({
        id: doctorWrapper.getUserId()
      });

      // get all patients for the doctor to notify
      const allPatients =
        (await carePlanService.getAllPatients({
          doctor_id: doctorWrapper.getDoctorId()
        })) || [];

      Logger.debug("allPatients", allPatients);

      let patientUserIds = [];

      if (allPatients.length > 0) {
        for (let index = 0; index < allPatients.length; index++) {
          const { patient_id } = allPatients[index] || {};
          const patient = await PatientWrapper(null, patient_id);
          patientUserIds.push(patient.getUserId());
        }
      }

      // notify
      const deactivateJob = AuthJob.execute(
        NOTIFICATION_VERB.DEACTIVATE_DOCTOR,
        {
          actor: {
            id: doctorWrapper.getUserId(),
            details: {
              name: doctorWrapper.getFullName()
            }
          },
          participants: patientUserIds
        }
      );

      await NotificationSdk.execute(deactivateJob);

      const updatedUser = await UserWrapper(null, doctorWrapper.getUserId());

      return raiseSuccess(
        res,
        200,
        {
          ...(await updatedUser.getReferenceInfo())
        },
        "Doctor deactivated successfully"
      );
    } catch (error) {
      Logger.debug("DELETE DOCTOR 500 error", error);
      return raiseServerError(res);
    }
  };

  activateDoctor = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const {
        userDetails: { userId = null, userData: { category } = {} } = {},
        params: { user_id } = {}
      } = req;

      if (
        category !== USER_CATEGORY.ADMIN &&
        category !== USER_CATEGORY.PROVIDER
      ) {
        return this.raiseClientError(
          res,
          422,
          {},
          `User is not authorized to activate Doctor.`
        );
      }

      const userDetails = await userService.activateUser({ id: user_id });

      const updatedUser = await UserWrapper(null, user_id);

      const { doctor_id, ...rest } = await updatedUser.getReferenceInfo();

      const {
        doctors: { [doctor_id]: { basic_info: { full_name } = {} } = {} } = {}
      } = rest || {};

      // get all patients for the doctor to notify
      const allPatients =
        (await carePlanService.getAllPatients({ doctor_id })) || [];

      Logger.debug("allPatients", allPatients);

      let patientUserIds = [];

      if (allPatients.length > 0) {
        for (let index = 0; index < allPatients.length; index++) {
          const { patient_id } = allPatients[index] || {};
          const patient = await PatientWrapper(null, patient_id);
          patientUserIds.push(patient.getUserId());
        }
      }

      // notify
      const deactivateJob = AuthJob.execute(NOTIFICATION_VERB.ACTIVATE_DOCTOR, {
        actor: {
          id: user_id,
          details: {
            name: full_name
          }
        },
        participants: patientUserIds
      });

      await NotificationSdk.execute(deactivateJob);

      return raiseSuccess(
        res,
        200,
        {
          ...rest,
          doctor_id
        },
        "Doctor activated successfully"
      );
    } catch (error) {
      Logger.debug("ACTIVATE DOCTOR 500 error", error);
      return raiseServerError(res);
    }
  };

  addDoctor = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { userDetails: { userId, userRoleId } = {} } = req;

      const {
        name,
        city,
        category,
        mobile_number,
        prefix,
        profile_pic,
        signature_pic,
        is_provider,
        email,
        existing = false,
        existingDoctorId = null
      } = req.body;

      if (is_provider && existing) {
        const user = await userService.getUserByEmail({ email });

        if (user) {
          const userData = await UserWrapper(user);
          const docUserId = await userData.getId();

          const provider = await providerService.getProviderByData({
            user_id: userId
          });

          if (provider) {
            const providerData = await ProviderWrapper(provider);
            const provider_id = (await providerData.getProviderId()) || null;
            const userRole = await userRolesService.getSingleUserRoleByData({
              user_identity: docUserId,
              linked_id: provider_id,
              linked_with: USER_CATEGORY.PROVIDER
            });

            if (userRole) {
              return this.raiseClientError(
                res,
                422,
                {},
                "This email id is already linked with this provider."
              );
            } else {
              // -- create new user role
              const newUserRole = await userRolesService.create({
                user_identity: docUserId,
                linked_id: provider_id,
                linked_with: USER_CATEGORY.PROVIDER
              });

              const existingUserCategory = await userData.getCategory();
              const roleData = await UserRoleWrapper(newUserRole);
              let user_roles = {};
              user_roles[roleData.getId()] = await roleData.getAllInfo();
              const doctor = await doctorService.getDoctorByUserId(docUserId);
              const doctorData = await DoctorWrapper(doctor);
              // -- create new user ref
              const userPreference = await userPreferenceService.addUserPreference(
                {
                  user_id: docUserId,
                  details: {
                    charts:
                      // existingUserCategory === USER_CATEGORY.DOCTOR
                      // ?
                      [NO_MEDICATION, NO_APPOINTMENT, NO_ACTION]
                    // :
                    // [NO_APPOINTMENT , NO_ACTION]
                  },
                  user_role_id: roleData.getId()
                }
              );

              // -- create new doc provider mapping
              const mappingData = {
                doctor_id: doctorData.getDoctorId(),
                provider_id: provider_id
              };
              const response = await doctorProviderMappingService.createDoctorProviderMapping(
                mappingData
              );

              return raiseSuccess(
                res,
                200,
                {
                  user_roles,
                  users: {
                    [userData.getId()]: userData.getBasicInfo()
                  },
                  doctors: {
                    [doctorData.getDoctorId()]: doctorData.getBasicInfo()
                  }
                },
                "Doctor liked with provider successfully."
              );
            }
          }
        }
      }

      if (is_provider) {
        const resp = await addProviderDoctor(
          req,
          res,
          raiseSuccess,
          raiseClientError
        );

        return resp;
      }

      // const doctorName = name.split(" ");
      const user_data_to_update = {
        category,
        mobile_number,
        prefix,
        onboarding_status: ONBOARDING_STATUS.PROFILE_REGISTERED
      };

      const mobileNumberExist =
        (await userService.getUserByData({
          mobile_number
        })) || [];
      if (mobileNumberExist && mobileNumberExist.length) {
        const prevUser = await UserWrapper(mobileNumberExist[0].get());
        const prevUserId = prevUser.getId();
        if (prevUserId !== userId) {
          return this.raiseClientError(
            res,
            422,
            {},
            "This mobile number is already registered."
          );
        }
      }

      let doctorUserId = userId;

      let doctor = {};
      let doctorExist = await doctorService.getDoctorByData({
        user_id: doctorUserId
      });
      // let first_name = doctorName[0];
      // let middle_name = doctorName.length === 3 ? doctorName[1] : "";
      // let last_name =
      //   doctorName.length === 3
      //     ? doctorName[2]
      //     : doctorName.length === 2
      //     ? doctorName[1]
      //     : "";

      const { first_name, middle_name, last_name } = getSeparateName(name);

      if (doctorExist) {
        let doctor_data = {
          city,
          profile_pic: getFilePath(profile_pic),
          signature_pic: getFilePath(profile_pic),
          first_name,
          middle_name,
          last_name
        };
        let doctor_id = doctorExist.get("id");
        doctor = await doctorService.updateDoctor(doctor_data, doctor_id);
      } else {
        let doctor_data = {
          user_id: doctorUserId,
          city,
          profile_pic: getFilePath(profile_pic),
          signature_pic: getFilePath(signature_pic),
          first_name,
          middle_name,
          last_name
        };
        doctor = await doctorService.addDoctor(doctor_data);
      }
      const userUpdate = await userService.updateUser(
        user_data_to_update,
        doctorUserId
      );

      const updatedUser = await userService.getUserById(doctorUserId);

      const userData = await UserWrapper(updatedUser.get());
      const userPreference = await userPreferenceService.getPreferenceByData({
        user_id: doctorUserId
      });
      if (userPreference) {
        const userPreferenceWrapper =
          (await UserPreferenceWrapper(userPreference)) || null;
        const userPreferenceId = userPreferenceWrapper.getUserPreferenceId();
        // if(category === USER_CATEGORY.HSP ){
        //   const updatedUserPreference = await userPreferenceService.updateUserPreferenceData({
        //     details:{"charts": [NO_APPOINTMENT , NO_ACTION]}
        //   },
        //   userPreferenceId
        //   );
        // }else if (category === USER_CATEGORY.DOCTOR){
        // const updatedUserPreference = await userPreferenceService.updateUserPreferenceData({
        //   details:{"charts": [NO_MEDICATION, NO_APPOINTMENT , NO_ACTION]}
        // },
        // userPreferenceId
        // );
        // }
      }

      const updatedDoctor = await doctorService.getDoctorByData({
        user_id: doctorUserId
      });
      const doctorData = await DoctorWrapper(updatedDoctor);

      return raiseSuccess(
        res,
        200,
        {
          users: {
            [userData.getId()]: userData.getBasicInfo()
          },
          doctors: {
            [doctorData.getDoctorId()]: doctorData.getBasicInfo()
          }
        },
        "doctor profile updated successfully"
      );
    } catch (error) {
      Logger.debug("add doctor 500 error", error);
      return raiseServerError(res);
    }
  };

  updateDoctorDetails = async (req, res) => {
    //todoJ
    // console.log("add patient controller ---> ");
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { id = 0 } = req.params;
      const {
        userDetails: { userId, userData: { category: userCategory } = {} } = {}
      } = req;

      let degreeData = {},
        councilData = {},
        specialityData = {};

      const {
        name = null,
        city = null,
        gender = null,
        profile_pic = null,
        speciality_id: specialityId = null,
        qualification_details = null,
        registration_details = null,
        clinic_details = null,
        doctor_id = null
      } = req.body;

      let speciality_id = null;

      Logger.debug("ererer", req.body);

      let doctorUserId = id;

      if (doctor_id) {
        if (userCategory !== USER_CATEGORY.PROVIDER) {
          return raiseClientError(res, 401, {}, "UNAUTHORIZED");
        }

        const doctorData = await DoctorWrapper(null, doctor_id);
        doctorUserId = doctorData.getUserId();
      }

      let doctorExist = await doctorService.getDoctorByData({
        user_id: doctorUserId
      });
      let doctor_data = {};
      if (name) {
        const doctorName = name.split(" ");
        let first_name = doctorName[0];
        let middle_name = doctorName.length === 3 ? doctorName[1] : "";
        let last_name =
          doctorName.length === 3
            ? doctorName[2]
            : doctorName.length === 2
            ? doctorName[1]
            : "";

        doctor_data["first_name"] = first_name;
        doctor_data["middle_name"] = middle_name;
        doctor_data["last_name"] = last_name;
      }

      // -- add speciality

      const isNotANumber = isNaN(specialityId);
      if (isNotANumber) {
        const speciality = await specialityService.getSpecialityByData({
          name: specialityId
        });

        if (speciality) {
          const specialityData = await SpecialityWrapper(speciality);
          speciality_id = specialityData.getSpecialityId();
        } else {
          const newSpeciality = await specialityService.create({
            name: specialityId,
            user_created: userId
          });
          const newSpecialityData = await SpecialityWrapper(newSpeciality);
          speciality_id = newSpecialityData.getSpecialityId();
        }
      } else {
        speciality_id = specialityId;
      }

      const speciality = await specialityService.getSpecialityByData({
        id: speciality_id
      });
      if (speciality) {
        const speWrapper = await SpecialityWrapper(speciality);
        specialityData[
          speWrapper.getSpecialityId()
        ] = speWrapper.getBasicInfo();
      }

      if (profile_pic) {
        doctor_data["profile_pic"] = getFilePath(profile_pic);
      }
      if (gender) {
        doctor_data["gender"] = gender;
      }
      if (city) {
        doctor_data["city"] = city;
      }
      if (speciality_id) {
        doctor_data["speciality_id"] = speciality_id;
      }

      if (doctorExist) {
        let doctor = {};
        let doctor_id = doctorExist.get("id");
        doctor = await doctorService.updateDoctor(doctor_data, doctor_id);

        const updatedDoctor = await doctorService.getDoctorByData({
          user_id: doctorUserId
        });

        // basic information
        const doctorData = await DoctorWrapper(updatedDoctor);

        // qualification

        if (qualification_details) {
          const qualificationsOfDoctor = await qualificationService.getQualificationsByDoctorId(
            doctorData.getDoctorId()
          );

          let newQualifications = [];
          for (const item of qualification_details) {
            const {
              councilData,
              degree_id: degreeId = null,
              year = null,
              college_name = "",
              college_id = "",
              photos = [],
              id = 0,
              doctor_id = 0
            } = item;

            let degree_id = null;

            // -- add degree

            const isDegreeNotANumber = isNaN(degreeId);
            if (isDegreeNotANumber) {
              const degree = await degreeService.getByData({ name: degreeId });

              if (degree) {
                const degreeData = await DegreeWrapper(degree);
                degree_id = degreeData.getDegreeId();
              } else {
                const newDegree = await degreeService.create({
                  name: degreeId,
                  user_created: userId
                });
                const newDegreeData = await DegreeWrapper(newDegree);
                degree_id = newDegreeData.getDegreeId();
              }
            } else {
              degree_id = degreeId;
            }

            let degree = null;
            if (degree_id) {
              degree = await degreeService.getByData({ id: degree_id });
              const degreeWrapper = await DegreeWrapper(degree);
              degreeData[
                degreeWrapper.getDegreeId()
              ] = degreeWrapper.getBasicInfo();
            }

            let collegeId = college_id;
            if (college_name !== "") {
              const college = await collegeService.create({
                name: college_name,
                user_created: true
              });

              const collegeWrapper = await CollegeWrapper(college);
              collegeId = collegeWrapper.getCollegeId();
            }

            if (id && id !== "0") {
              let qualification_data = {};
              if (degree_id) {
                qualification_data["degree_id"] = degree_id;
              }

              if (collegeId) {
                qualification_data["college_id"] = collegeId;
              }

              if (year) {
                qualification_data["year"] = year;
              }
              qualification_data["doctor_id"] = doctor_id;
              const qualification = await qualificationService.updateQualification(
                qualification_data,
                id
              );
              if (photos.length > 3) {
                return this.raiseServerError(
                  res,
                  422,
                  {},
                  "Cannot add more than 3 documents"
                );
              }
              for (const photo of photos) {
                const docExist = await documentService.getDocumentByData(
                  DOCUMENT_PARENT_TYPE.DOCTOR_QUALIFICATION,
                  id,
                  getFilePath(photo)
                );

                if (!docExist) {
                  const qualificationDoc = await documentService.addDocument({
                    doctor_id: doctorData.getDoctorId(),
                    parent_type: DOCUMENT_PARENT_TYPE.DOCTOR_QUALIFICATION,
                    parent_id: id,
                    document: getFilePath(photo)
                  });
                }
              }
            }
          }
        }

        // registration information

        if (registration_details) {
          const registrationsOfDoctor = await registrationService.getRegistrationByDoctorId(
            doctorData.getDoctorId()
          );

          for (const item of registration_details) {
            const {
              number = null,
              registration_council_id: regCouncilId = null,
              year = null,
              expiryDate = null,
              id = 0,
              photos: registration_photos = []
            } = item;
            let updateDataRegistration = {};

            let registration_council_id = null;

            // -- add council

            const isCouncilNotANumber = isNaN(regCouncilId);
            if (isCouncilNotANumber) {
              const council = await councilService.getByData({
                name: regCouncilId
              });

              if (council) {
                const councilData = await CouncilWrapper(council);
                registration_council_id = councilData.getCouncilId();
              } else {
                const newCouncil = await councilService.create({
                  name: regCouncilId,
                  user_created: userId
                });
                const newCouncilData = await CouncilWrapper(newCouncil);
                registration_council_id = newCouncilData.getCouncilId();
              }
            } else {
              registration_council_id = regCouncilId;
            }

            let council = null;
            if (registration_council_id) {
              council = await councilService.getByData({
                id: registration_council_id
              });
              const councilWrapper = await CouncilWrapper(council);
              councilData[
                councilWrapper.getCouncilId()
              ] = councilWrapper.getBasicInfo();
            }

            if (number) {
              updateDataRegistration["number"] = number;
            }
            if (registration_council_id) {
              updateDataRegistration[
                "registration_council_id"
              ] = registration_council_id;
            }
            if (year) {
              updateDataRegistration["year"] = year;
            }
            if (expiryDate) {
              updateDataRegistration["expiry_date"] = moment(expiryDate);
            }
            updateDataRegistration["doctor_id"] = doctorData.getDoctorId();
            if (id && id !== "0") {
              const registration = await registrationService.updateRegistration(
                updateDataRegistration,
                id
              );
            }
            for (const registration_photo of registration_photos) {
              let docExist = await documentService.getDocumentByData(
                DOCUMENT_PARENT_TYPE.DOCTOR_REGISTRATION,
                id,
                getFilePath(registration_photo)
              );

              if (!docExist) {
                let qualificationDoc = await documentService.addDocument({
                  doctor_id: doctorData.getDoctorId(),
                  parent_type: DOCUMENT_PARENT_TYPE.DOCTOR_REGISTRATION,
                  parent_id: id,
                  document: getFilePath(registration_photo)
                });
              }
            }
          }
        }

        if (clinic_details) {
          for (const clinic of clinic_details) {
            let clinicDetails = {};
            const {
              name = null,
              location = null,
              time_slots = null,
              id = 0,
              doctor_id = null
            } = clinic;
            if (name) {
              clinicDetails["name"] = name;
            }
            if (location) {
              clinicDetails["location"] = location;
            }
            if (time_slots) {
              clinicDetails["details"] = { time_slots: time_slots };
            }
            clinicDetails["doctor_id"] = doctor_id;
            Logger.debug("datatata", clinicDetails);
            if (id && id !== "0") {
              const newClinic = await clinicService.updateClinic(
                clinicDetails,
                id
              );
            }
          }
        }

        // }

        return raiseSuccess(
          res,
          200,
          {
            doctors: {
              [doctorData.getDoctorId()]: doctorData.getBasicInfo()
            },
            specialities: {
              ...specialityData
            },
            degrees: {
              ...degreeData
            },
            councils: {
              ...councilData
            }
          },
          "Doctor profile updated successfully."
        );
      } else {
        return raiseClientError(res, 422, {}, "Doctor Not Found.");
      }
    } catch (error) {
      Logger.debug("932647583246723908478783246", { error });
      Logger.debug("update doctor 500 error", error);
      return raiseServerError(res);
    }
  };

  addPatient = async (req, res) => {
    try {
      const {
        mobile_number = "",
        name = "",
        patient_uid = "",
        gender = "",
        date_of_birth = "",
        prefix = "",
        comorbidities = "",
        allergies = "",
        clinical_notes = "",
        diagnosis_type = "1",
        diagnosis_description = "",
        treatment_id,
        severity_id,
        condition_id,
        height = "",
        weight = "",
        symptoms = "",
        address = ""
      } = req.body;

      const {
        userDetails: {
          userRoleId = null,
          userId,
          userData: { category } = {}
        } = {}
      } = req;

      const userExists =
        (await userService.getPatientByMobile(mobile_number)) || [];

      let userData = null;
      let patientData = null;
      let patientOtherDetails = {};
      let carePlanOtherDetails = {};
      let patientFeatureIds = [];

      if (comorbidities) {
        patientOtherDetails["comorbidities"] = comorbidities;
      }
      if (allergies) {
        patientOtherDetails["allergies"] = allergies;
      }
      if (clinical_notes) {
        carePlanOtherDetails["clinical_notes"] = clinical_notes;
      }
      if (symptoms) {
        carePlanOtherDetails["symptoms"] = symptoms;
      }

      const doctor = await doctorService.getDoctorByData({ user_id: userId });

      let patientName = "";
      if (name) {
        patientName = name.trim().split(" ");
      }

      const { first_name, middle_name, last_name } = getSeparateName(name);

      // let first_name = patientName[0] || null;
      // let middle_name = patientName.length > 1 ? patientName[1] : null;
      // let last_name = patientName.length > 2 ? patientName.slice(2, patientName.length - 1).join(" ") : null;

      if (userExists.length > 0) {
        // todo: find alternative to userExists[0]
        userData = await UserWrapper(userExists[0].get());

        // if(userData.getCategory() !== USER_CATEGORY.PATIENT) {
        //   return this.raiseClientError(res, 422, {}, "Number already registered with other user")
        // }
        const { patient_id } = await userData.getReferenceInfo();
        patientData = await PatientWrapper(null, patient_id);

        const previousDetails = patientData.getDetails();
        const updateResponse = await patientsService.update(
          {
            height,
            weight,
            address,
            first_name,
            middle_name,
            last_name,
            gender,
            dob: date_of_birth,
            age: getAge(moment(date_of_birth)),
            details: { ...previousDetails, ...patientOtherDetails }
          },
          patient_id
        );

        patientData = await PatientWrapper(null, patient_id);
      } else {
        const password = process.config.DEFAULT_PASSWORD;
        const salt = await bcrypt.genSalt(Number(process.config.saltRounds));
        const hash = await bcrypt.hash(password, salt);
        let user = await userService.addUser({
          prefix,
          mobile_number,
          password: hash,
          sign_in_type: SIGN_IN_CATEGORY.BASIC,
          category: USER_CATEGORY.PATIENT,
          onboarded: false,
          onboarding_status: ONBOARDING_STATUS.PATIENT.PROFILE_REGISTERED,
          verified: true,
          activated_on: moment().format()
        });
        userData = await UserWrapper(user.get());

        if (clinical_notes) {
          carePlanOtherDetails["clinical_notes"] = clinical_notes;
        }
        if (symptoms) {
          carePlanOtherDetails["symptoms"] = symptoms;
        }

        let newUserId = userData.getId();

        // const uid = uuidv4();
        const birth_date = moment(date_of_birth);
        const age = getAge(date_of_birth);
        const patient = await patientsService.addPatient({
          first_name,
          gender,
          middle_name,
          last_name,
          user_id: newUserId,
          birth_date,
          age,
          dob: date_of_birth,
          details: {
            ...patientOtherDetails
          },
          height,
          weight,
          address
        });

        const patientWrapper = await PatientWrapper(patient);
        const patientUserId = await patientWrapper.getUserId();
        const userRole = await userRolesService.create({
          user_identity: patientUserId
        });
        const userRoleWrapper = await UserRoleWrapper(userRole);
        const newUserRoleId = await userRoleWrapper.getId();

        await UserPreferenceService.addUserPreference({
          user_id: newUserId,
          details: {
            timings: PATIENT_MEAL_TIMINGS
          },
          user_role_id: newUserRoleId
        });

        const uid = patient_uid
          ? patient_uid
          : getReferenceId(patient.get("id"));

        await patientsService.update({ uid }, patient.get("id"));
        patientData = await PatientWrapper(null, patient.get("id"));

        const features = await featuresService.getAllFeatures();

        for (const feature of features) {
          const { id: featureId } = feature;
          const featureMappingData = await doctorPatientFeatureMappingService.create(
            {
              feature_id: featureId,
              patient_id: patientData.getPatientId(),
              doctor_id: doctor.get("id")
            }
          );
          if (featureMappingData) {
            patientFeatureIds.push(featureId);
          }
        }
      }

      const carePlanTemplate = await carePlanTemplateService.getCarePlanTemplateData(
        {
          treatment_id,
          severity_id,
          condition_id,
          user_id: userId
        }
      );

      const patient_id = patientData.getPatientId();
      const care_plan_template_id = null;

      const details = {
        treatment_id,
        severity_id,
        condition_id,
        diagnosis: {
          type: diagnosis_type,
          description: diagnosis_description
        },
        ...carePlanOtherDetails
      };

      const carePlan = await carePlanService.addCarePlan({
        patient_id,
        doctor_id: doctor.get("id"),
        care_plan_template_id,
        details,
        user_role_id: userRoleId,
        // channel_id: getRoomId(userRoleId, patient_id),
        created_at: moment()
      });

      const { id: carePlanId } = carePlan || {};

      const { user_role_id: patientRoleId } = await patientData.getAllInfo();

      await carePlanService.updateCarePlan(
        {
          channel_id: getRoomId(userRoleId, patientRoleId)
        },
        carePlanId
      );

      const carePlanData = await CarePlanWrapper(null, carePlanId);
      // const care_plan_id = await carePlanData.getCarePlanId();

      let templateMedicationData = {};
      let templateAppointmentData = {};

      let carePlanTemplateData = null;

      let medicineApiData = {};

      const link = uuidv4();

      const userVerification = UserVerificationServices.addRequest({
        user_id: patientData.getUserId(),
        request_id: link,
        status: "pending",
        type: VERIFICATION_TYPE.PATIENT_SIGN_UP
      });

      const universalLink = await getUniversalLink({
        event_type: VERIFICATION_TYPE.PATIENT_SIGN_UP,
        link
      });

      const mobileUrl = `${process.config.WEB_URL}/${process.config.app.mobile_verify_link}/${link}`;

      Logger.debug("109312983912 universalLink", universalLink);

      const smsPayload = {
        // countryCode: prefix,
        phoneNumber: `+${prefix}${mobile_number}`, // mobile_number
        message: `Hello from AdhereLive! Please click the link to verify your number. ${universalLink}`
      };

      // if(process.config.app.env === "development") {
      const emailPayload = {
        title: "Mobile Patient Verification mail",
        toAddress: process.config.app.developer_email,
        templateName: EMAIL_TEMPLATE_NAME.INVITATION,
        templateData: {
          title: "Patient",
          link: universalLink,
          inviteCard: "",
          mainBodyText: "We are happy to welcome you onboard.",
          subBodyText: "Please verify your account",
          buttonText: "Verify",
          host: process.config.WEB_URL,
          contactTo: "customersupport@adhere.live"
        }
      };
      Proxy_Sdk.execute(EVENTS.SEND_EMAIL, emailPayload);
      // } else {
      //   Proxy_Sdk.execute(EVENTS.SEND_SMS, smsPayload);
      // }

      let otherCarePlanTemplates = {};

      let carePlanTemplateIds = [];

      if (carePlanTemplate.length > 0) {
        for (const template of carePlanTemplate) {
          carePlanTemplateData = await CarePlanTemplateWrapper(template);
          const {
            care_plan_templates,
            template_appointments,
            template_medications,
            medicines
          } = await carePlanTemplateData.getReferenceInfo();
          carePlanTemplateIds.push(...Object.keys(care_plan_templates));
          otherCarePlanTemplates = {
            ...otherCarePlanTemplates,
            ...care_plan_templates
          };
          templateAppointmentData = {
            ...templateAppointmentData,
            ...template_appointments
          };
          templateMedicationData = {
            ...templateMedicationData,
            ...template_medications
          };
          medicineApiData = { ...medicineApiData, ...medicines };
        }
      } else {
        carePlanTemplateIds.push("1");
        otherCarePlanTemplates["1"] = {
          basic_info: {
            id: "1",
            name: "Blank Template"
          }
        };
      }

      return this.raiseSuccess(
        res,
        200,
        {
          patient_ids: [patient_id],
          // carePlanId,
          care_plan_ids: [carePlanData.getCarePlanId()],
          care_plan_template_ids: carePlanTemplateIds,
          users: {
            [userData.getId()]: userData.getBasicInfo()
          },
          patients: {
            [patientData.getPatientId()]: {
              ...(await patientData.getAllInfo())
            }
          },
          care_plans: {
            [carePlanData.getCarePlanId()]: carePlanData.getBasicInfo()
          },
          care_plan_templates: {
            ...otherCarePlanTemplates
          },
          template_appointments: {
            ...templateAppointmentData
          },
          template_medications: {
            ...templateMedicationData
          },
          medicines: {
            ...medicineApiData
          },
          features_mappings: {
            [patientData.getPatientId()]: patientFeatureIds
          }
        },
        "Patient added successfully"
      );
    } catch (error) {
      Logger.debug("ADD DOCTOR PATIENT 500 ERROR", error);
      return this.raiseServerError(res);
    }
  };

  updateDoctorQualificationRegistration = async (req, res) => {
    const { raiseServerError, raiseSuccess, raiseClientError } = this;
    try {
      const {
        speciality_id: specialityId = "",
        gender = "",
        qualification_details = [],
        registration_details = [],
        doctor_id = null
      } = req.body;

      console.log("4867236812937127362187312 ======>>>>>>>>>", {
        specialityId
      });

      let degreeData = {},
        specialityData = {},
        councilData = {};

      let speciality_id = null;

      const {
        userDetails: {
          userId: user_id,
          userData: { category = null } = {}
        } = {}
      } = req;

      let doctorUserId = user_id;
      let doctorData = null;

      if (doctor_id) {
        if (category !== USER_CATEGORY.PROVIDER) {
          return raiseClientError(res, 401, {}, "UNAUTHORIZED");
        }

        doctorData = await DoctorWrapper(null, doctor_id);
        doctorUserId = doctorData.getUserId();
      } else {
        const doctor = await doctorService.getDoctorByData({
          user_id: doctorUserId
        });
        doctorData = await DoctorWrapper(doctor);
      }

      // let doctor_id = doctor.get("id");

      // -- add speciality
      const isNotANumber = isNaN(specialityId);
      if (isNotANumber) {
        const speciality = await specialityService.getSpecialityByData({
          name: specialityId
        });

        if (speciality) {
          const specialityData = await SpecialityWrapper(speciality);
          speciality_id = specialityData.getSpecialityId();
        } else {
          const newSpeciality = await specialityService.create({
            name: specialityId,
            user_created: user_id
          });
          const newSpecialityData = await SpecialityWrapper(newSpeciality);
          speciality_id = newSpecialityData.getSpecialityId();
        }
      } else {
        speciality_id = specialityId;
      }

      const speciality = await specialityService.getSpecialityByData({
        id: speciality_id
      });
      const speWrapper = await SpecialityWrapper(speciality);
      specialityData[speWrapper.getSpecialityId()] = speWrapper.getBasicInfo();

      const doctorUpdate = await doctorService.updateDoctor(
        {
          gender,
          speciality_id
        },
        doctorData.getDoctorId()
      );
      const qualificationsOfDoctor = await qualificationService.getQualificationsByDoctorId(
        doctorData.getDoctorId()
      );

      let newQualifications = [];
      for (const item of qualification_details) {
        const {
          degree_id: degreeId = "",
          year = "",
          college_name = "",
          college_id = "",
          photos = [],
          id = 0
        } = item;

        // -- add degree
        let degree_id = null;

        const isDegreeNotANumber = isNaN(degreeId);
        if (isDegreeNotANumber) {
          const degree = await degreeService.getByData({ name: degreeId });

          if (degree) {
            const degreeData = await DegreeWrapper(degree);
            degree_id = degreeData.getDegreeId();
          } else {
            const newDegree = await degreeService.create({
              name: degreeId,
              user_created: user_id
            });
            const newDegreeData = await DegreeWrapper(newDegree);
            degree_id = newDegreeData.getDegreeId();
          }
        } else {
          degree_id = degreeId;
        }

        let degree = await degreeService.getByData({ id: degree_id });
        const degreeWrapper = await DegreeWrapper(degree);
        degreeData[degreeWrapper.getDegreeId()] = degreeWrapper.getBasicInfo();

        if (id && id !== "0") {
          let collegeId = college_id;
          if (college_name !== "") {
            const existingCollege = await collegeService.getByData({
              name: college_name
            });

            // Logger.debug("876546789653456789876789",existingCollege);

            if (!existingCollege) {
              const college = await collegeService.create({
                name: college_name,
                user_created: true
              });

              const collegeWrapper = await CollegeWrapper(college);
              collegeId = collegeWrapper.getCollegeId();
            } else {
              const existingCollegeWrapper = await CollegeWrapper(
                existingCollege
              );
              collegeId = existingCollegeWrapper.getCollegeId();
            }
          }

          const qualification = await qualificationService.updateQualification(
            {
              doctor_id: doctorData.getDoctorId(),
              degree_id,
              year,
              college_id: collegeId
            },
            id
          );
          newQualifications.push(parseInt(id));
        } else {
          let collegeId = college_id;
          if (college_name !== "") {
            const college = await collegeService.create({
              name: college_name,
              user_created: true
            });

            const collegeWrapper = await CollegeWrapper(college);
            collegeId = collegeWrapper.getCollegeId();
          }

          const qualification = await qualificationService.addQualification({
            doctor_id: doctorData.getDoctorId(),
            degree_id,
            year,
            college_id: collegeId
          });
        }
      }

      for (let qualification of qualificationsOfDoctor) {
        let qId = qualification.get("id");
        if (newQualifications.includes(qId)) {
          continue;
        } else {
          let deleteDocs = await documentService.deleteDocumentsOfQualification(
            DOCUMENT_PARENT_TYPE.DOCTOR_QUALIFICATION,
            qId
          );
          let quali = await qualificationService.getQualificationById(qId);
          quali.destroy();
        }
      }

      // REGISTRATION FOR DOCTOR
      const registrationsOfDoctor = await registrationService.getRegistrationByDoctorId(
        doctorData.getDoctorId()
      );

      let newRegistrations = [];
      for (const item of registration_details) {
        const {
          number,
          registration_council_id: regCouncilId,
          year,
          expiryDate: expiry_date,
          id = 0
        } = item;

        // -- add council

        let registration_council_id = null;

        const isCouncilNotANumber = isNaN(regCouncilId);
        if (isCouncilNotANumber) {
          const council = await councilService.getByData({
            name: regCouncilId
          });

          if (council) {
            const councilData = await CouncilWrapper(council);
            registration_council_id = councilData.getCouncilId();
          } else {
            const newCouncil = await councilService.create({
              name: regCouncilId,
              user_created: user_id
            });
            const newCouncilData = await CouncilWrapper(newCouncil);
            registration_council_id = newCouncilData.getCouncilId();
          }
        } else {
          registration_council_id = regCouncilId;
        }

        const council = await councilService.getByData({
          id: registration_council_id
        });
        const councilWrapper = await CouncilWrapper(council);
        councilData[
          councilWrapper.getCouncilId()
        ] = councilWrapper.getBasicInfo();

        if (id && id !== "0") {
          const registration = await registrationService.updateRegistration(
            {
              doctor_id: doctorData.getDoctorId(),
              number,
              year,
              registration_council_id,
              expiry_date
            },
            id
          );
          newRegistrations.push(parseInt(id));
        } else {
          const registration = await registrationService.addRegistration({
            doctor_id: doctorData.getDoctorId(),
            number,
            year,
            registration_council_id,
            expiry_date
          });
        }
      }

      for (const registration of registrationsOfDoctor) {
        const rId = registration.get("id");
        if (newRegistrations.includes(rId)) {
          continue;
        } else {
          const deleteDocs = await documentService.deleteDocumentsOfQualification(
            DOCUMENT_PARENT_TYPE.DOCTOR_REGISTRATION,
            rId
          );
          const register = await registrationService.getRegistrationById(rId);
          register.destroy();
        }
      }

      const userUpdate = await userService.updateUser(
        {
          onboarding_status: ONBOARDING_STATUS.QUALIFICATION_REGISTERED
        },
        doctorUserId
      );

      const updatedUser = await userService.getUserById(doctorUserId);
      const updatedUserData = await UserWrapper(updatedUser.get());

      const updatedDoctor = await doctorService.getDoctorByData({
        user_id: doctorUserId
      });
      const updatedDoctorData = await DoctorWrapper(updatedDoctor);

      let uploadDocumentsData = {};

      let qualificationsData = {};
      let doctor_qualification_ids = [];
      const doctorQualifications = await qualificationService.getQualificationsByDoctorId(
        updatedDoctorData.getDoctorId()
      );
      for (const doctorQualification of doctorQualifications) {
        let upload_document_ids = [];
        const qualificationData = await QualificationWrapper(
          doctorQualification
        );
        doctor_qualification_ids.push(
          qualificationData.getDoctorQualificationId()
        );

        const uploadDocuments = await documentService.getDoctorQualificationDocuments(
          DOCUMENT_PARENT_TYPE.DOCTOR_QUALIFICATION,
          qualificationData.getDoctorQualificationId()
        );

        for (const uploadDocument of uploadDocuments) {
          const uploadDocumentData = await UploadDocumentWrapper(
            uploadDocument
          );
          upload_document_ids.push(uploadDocumentData.getUploadDocumentId());
          uploadDocumentsData[
            uploadDocumentData.getUploadDocumentId()
          ] = uploadDocumentData.getBasicInfo();
        }
        qualificationsData[qualificationData.getDoctorQualificationId()] = {
          ...qualificationData.getBasicInfo(),
          upload_document_ids
        };
      }

      let registrationsData = {};
      let doctor_registration_ids = [];
      const doctorRegistrations = await registrationService.getRegistrationByDoctorId(
        updatedDoctorData.getDoctorId()
      );
      for (const doctorRegistration of doctorRegistrations) {
        let upload_document_ids = [];
        const registrationData = await RegistrationWrapper(doctorRegistration);

        const uploadDocuments = await documentService.getDoctorQualificationDocuments(
          DOCUMENT_PARENT_TYPE.DOCTOR_REGISTRATION,
          registrationData.getDoctorRegistrationId()
        );
        doctor_registration_ids.push(
          registrationData.getDoctorRegistrationId()
        );

        for (const uploadDocument of uploadDocuments) {
          const uploadDocumentData = await UploadDocumentWrapper(
            uploadDocument
          );
          upload_document_ids.push(uploadDocumentData.getUploadDocumentId());
          uploadDocumentsData[
            uploadDocumentData.getUploadDocumentId()
          ] = uploadDocumentData.getBasicInfo();
        }
        registrationsData[registrationData.getDoctorRegistrationId()] = {
          ...registrationData.getBasicInfo(),
          upload_document_ids
        };
      }

      return this.raiseSuccess(
        res,
        200,
        {
          users: {
            [updatedUserData.getId()]: updatedUserData.getBasicInfo()
          },
          doctors: {
            [updatedDoctorData.getDoctorId()]: updatedDoctorData.getBasicInfo()
          },
          doctor_qualifications: {
            ...qualificationsData
          },
          doctor_registrations: {
            ...registrationsData
          },
          upload_documents: {
            ...uploadDocumentsData
          },
          doctor_qualification_ids,
          doctor_registration_ids,
          degrees: {
            ...degreeData
          },
          specialities: {
            ...specialityData
          },
          councils: {
            ...councilData
          }
        },
        "qualifications updated successfully"
      );
    } catch (error) {
      Logger.debug("addDoctorQualification 500 error", error);
      return raiseServerError(res);
    }
  };

  updateQualificationDocs = async (req, res) => {
    const { raiseServerError, raiseSuccess, raiseClientError } = this;
    try {
      const {
        userDetails: { userId, userData: { category = null } = {} } = {},
        body: { doctor_id = null } = {}
      } = req;
      const file = req.file;

      let doctorUserId = userId;
      if (doctor_id) {
        if (category !== USER_CATEGORY.PROVIDER) {
          return raiseClientError(res, 401, {}, "UNAUTHORIZED");
        }

        const doctorData = await DoctorWrapper(null, doctor_id);
        doctorUserId = doctorData.getUserId();
      }

      const { mimetype } = file || {};
      const fileType = mimetype.split("/");
      Logger.debug("mimetype ------> ", mimetype);
      if (!ALLOWED_DOC_TYPE_DOCTORS.includes(fileType[1])) {
        return this.raiseClientError(
          res,
          422,
          {},
          "Only images and pdf documents are allowed"
        );
      }

      let files = await uploadImageS3(doctorUserId, file, "qualification");
      let qualification_id = 0;
      // let doctor = await doctorService.getDoctorByUserId(userId);

      return raiseSuccess(
        res,
        200,
        {
          files: files
          // qualification_id
        },
        "Doctor qualification document uploaded successfully"
      );
    } catch (error) {
      return raiseServerError(res);
    }
  };

  updateRegistrationDocs = async (req, res) => {
    const { raiseServerError, raiseClientError } = this;
    try {
      const file = req.file;
      const {
        userDetails: { userId, userData: { category = null } = {} } = {},
        body: { doctor_id = null } = {}
      } = req;

      Logger.debug("updateRegistrationDocs file", file);

      let doctorUserId = userId;
      if (doctor_id) {
        if (category !== USER_CATEGORY.PROVIDER) {
          return raiseClientError(res, 401, {}, "UNAUTHORIZED");
        }

        const doctorData = await DoctorWrapper(null, doctor_id);
        doctorUserId = doctorData.getUserId();
      }

      const { mimetype } = file || {};
      const fileType = mimetype.split("/");
      Logger.debug("456786754676798675645546789 mimetype ------> ", mimetype);
      if (!ALLOWED_DOC_TYPE_DOCTORS.includes(fileType[1])) {
        return this.raiseClientError(
          res,
          422,
          {},
          "Only images and pdf documents are allowed"
        );
      }

      let files = await uploadImageS3(doctorUserId, file);

      Logger.debug("files --->", files);

      return this.raiseSuccess(
        res,
        200,
        {
          files: files
        },
        "doctor registration document uploaded successfully"
      );
    } catch (error) {
      return raiseServerError(res);
    }
  };

  updateQualificationStep = async (req, res) => {
    const { raiseServerError, raiseSuccess, raiseClientError } = this;
    try {
      const {
        gender = "",
        speciality_id: specialityId = "",
        qualification = {},
        doctor_id = null
      } = req.body;

      let speciality_id = null;

      const {
        userDetails: { userId, userData: { category = null } = {} } = {}
      } = req;

      let degreeData = {},
        specialityData = {};

      let doctorUserId = userId;
      let doctorData = null;
      if (doctor_id) {
        if (category !== USER_CATEGORY.PROVIDER) {
          return raiseClientError(res, 401, {}, "UNAUTHORIZED");
        }

        doctorData = await DoctorWrapper(null, doctor_id);
        doctorUserId = doctorData.getUserId();
      } else {
        let doctor = await doctorService.getDoctorByData({
          user_id: doctorUserId
        });
        doctorData = await DoctorWrapper(doctor);
      }

      // -- add speciality
      const isNotANumber = isNaN(specialityId);
      if (isNotANumber) {
        console.log("72354671523786213162371283", { isNotANumber });
        const speciality = await specialityService.getSpecialityByData({
          name: specialityId
        });

        if (speciality) {
          const specialityData = await SpecialityWrapper(speciality);
          speciality_id = specialityData.getSpecialityId();
        } else {
          const newSpeciality = await specialityService.create({
            name: specialityId,
            user_created: userId
          });
          const newSpecialityData = await SpecialityWrapper(newSpeciality);
          speciality_id = newSpecialityData.getSpecialityId();
        }
      } else {
        speciality_id = specialityId;
      }

      const speciality = await specialityService.getSpecialityByData({
        id: speciality_id
      });
      const speWrapper = await SpecialityWrapper(speciality);
      specialityData[speWrapper.getSpecialityId()] = speWrapper.getBasicInfo();

      if (gender && speciality_id) {
        const updatedDoctor = await doctorService.updateDoctor(
          {
            gender,
            speciality_id
          },
          doctorData.getDoctorId()
        );
      }
      const {
        degree_id: degreeId = "",
        year = "",
        college_name = "",
        college_id = "",
        id,
        photos = []
      } = qualification || {};

      let degree_id = null;

      // -- add degree

      const isDegreeNotANumber = isNaN(degreeId);
      if (isDegreeNotANumber) {
        const degree = await degreeService.getByData({ name: degreeId });

        if (degree) {
          const degreeData = await DegreeWrapper(degree);
          degree_id = degreeData.getDegreeId();
        } else {
          const newDegree = await degreeService.create({
            name: degreeId,
            user_created: userId
          });
          const newDegreeData = await DegreeWrapper(newDegree);
          degree_id = newDegreeData.getDegreeId();
        }
      } else {
        degree_id = degreeId;
      }

      let degree = await degreeService.getByData({ id: degree_id });
      const degreeWrapper = await DegreeWrapper(degree);
      degreeData[degreeWrapper.getDegreeId()] = degreeWrapper.getBasicInfo();

      let docQualification = {};

      if (photos.length > 3) {
        return this.raiseServerError(
          res,
          422,
          {},
          "Cannot add more than 3 documents"
        );
      }

      if (id === "0") {
        let collegeId = college_id;
        if (college_name !== "") {
          const college = await collegeService.create({
            name: college_name,
            user_created: true
          });

          const collegeWrapper = await CollegeWrapper(college);
          collegeId = collegeWrapper.getCollegeId();
        }

        docQualification = await qualificationService.addQualification({
          doctor_id: doctorData.getDoctorId(),
          degree_id,
          year,
          college_id: collegeId
        });

        for (const photo of photos) {
          const docExist = await documentService.getDocumentByData(
            DOCUMENT_PARENT_TYPE.DOCTOR_QUALIFICATION,
            id,
            getFilePath(photo)
          );

          Logger.debug("docExists --> ", docExist);
          Logger.debug("docQualification --> ", docQualification.get("id"));

          if (!docExist) {
            const qualificationDoc = await documentService.addDocument({
              doctor_id: doctorData.getDoctorId(),
              parent_type: DOCUMENT_PARENT_TYPE.DOCTOR_QUALIFICATION,
              parent_id: docQualification.get("id"),
              document: getFilePath(photo)
            });
          }
        }
      } else {
        let collegeId = college_id;
        if (college_name !== "") {
          const college = await collegeService.create({
            name: college_name,
            user_created: true
          });

          const collegeWrapper = await CollegeWrapper(college);
          collegeId = collegeWrapper.getCollegeId();
        }

        const docQualificationUpdate = await qualificationService.updateQualification(
          {
            doctor_id: doctorData.getDoctorId(),
            degree_id,
            year,
            college_id: collegeId
          },
          id
        );

        docQualification = await qualificationService.getQualificationById(id);
        for (const photo of photos) {
          const docExist = await documentService.getDocumentByData(
            DOCUMENT_PARENT_TYPE.DOCTOR_QUALIFICATION,
            id,
            getFilePath(photo)
          );

          if (!docExist) {
            const qualificationDoc = await documentService.addDocument({
              doctor_id: doctorData.getDoctorId(),
              parent_type: DOCUMENT_PARENT_TYPE.DOCTOR_QUALIFICATION,
              parent_id: id,
              document: getFilePath(photo)
            });
          }
        }
      }

      const docQualificationDetails = await QualificationWrapper(
        docQualification
      );

      const updatedDoctor = await doctorService.getDoctorByData({
        user_id: doctorUserId
      });
      const updatedDoctorData = await DoctorWrapper(updatedDoctor);

      let uploadDocumentsData = {};

      let qualificationsData = {};
      let doctor_qualification_ids = [];
      const doctorQualifications = await qualificationService.getQualificationsByDoctorId(
        updatedDoctorData.getDoctorId()
      );

      Logger.debug(
        "1893712983 doctorQualifications --> ",
        doctorQualifications
      );
      for (const doctorQualification of doctorQualifications) {
        let upload_document_ids = [];
        const qualificationData = await QualificationWrapper(
          doctorQualification
        );
        doctor_qualification_ids.push(
          qualificationData.getDoctorQualificationId()
        );

        const uploadDocuments = await documentService.getDoctorQualificationDocuments(
          DOCUMENT_PARENT_TYPE.DOCTOR_QUALIFICATION,
          qualificationData.getDoctorQualificationId()
        );

        for (const uploadDocument of uploadDocuments) {
          const uploadDocumentData = await UploadDocumentWrapper(
            uploadDocument
          );
          upload_document_ids.push(uploadDocumentData.getUploadDocumentId());
          uploadDocumentsData[
            uploadDocumentData.getUploadDocumentId()
          ] = uploadDocumentData.getBasicInfo();
        }
        qualificationsData[qualificationData.getDoctorQualificationId()] = {
          ...qualificationData.getBasicInfo(),
          upload_document_ids
        };
      }

      return raiseSuccess(
        res,
        200,
        {
          doctors: {
            [updatedDoctorData.getDoctorId()]: {
              ...updatedDoctorData.getBasicInfo(),
              doctor_qualification_ids
            }
          },
          ...(await updatedDoctorData.getReferenceInfo()),
          doctor_qualifications: {
            ...qualificationsData
          },
          upload_documents: {
            ...uploadDocumentsData
          },
          qualification_id: docQualificationDetails.getDoctorQualificationId(),
          degrees: {
            ...degreeData
          },
          specialities: {
            ...specialityData
          }
        },
        "qualification details updated successfully"
      );
    } catch (error) {
      Logger.debug("qualificationStep 500 error", error);
      return raiseServerError(res);
    }
  };

  updateRegistrationStep = async (req, res) => {
    const { raiseServerError, raiseSuccess } = this;
    try {
      const {
        body,
        userDetails: { userId, userData: { category = null } = {} } = {}
      } = req;

      let doctorUserId = userId;

      const {
        gender = "",
        speciality_id: specialityId = "",
        qualification_details: qualifications = [],
        registration = {},
        doctor_id = null
      } = body || {};

      let specialityData = {},
        degreeData = {};
      let councilData = {};

      let speciality_id = null;
      // -- add speciality

      const isNotANumber = isNaN(specialityId);
      if (isNotANumber) {
        const speciality = await specialityService.getSpecialityByData({
          name: specialityId
        });

        if (speciality) {
          const specialityData = await SpecialityWrapper(speciality);
          speciality_id = specialityData.getSpecialityId();
        } else {
          const newSpeciality = await specialityService.create({
            name: specialityId,
            user_created: userId
          });
          const newSpecialityData = await SpecialityWrapper(newSpeciality);
          speciality_id = newSpecialityData.getSpecialityId();
        }
      } else {
        speciality_id = specialityId;
      }

      const speciality = await specialityService.getSpecialityByData({
        id: speciality_id
      });
      const speWrapper = await SpecialityWrapper(speciality);
      specialityData[speWrapper.getSpecialityId()] = speWrapper.getBasicInfo();

      Logger.debug("3456754321345643", doctor_id);

      let doctorData = null;

      if (doctor_id) {
        if (category !== USER_CATEGORY.PROVIDER) {
          return raiseClientError(res, 401, {}, "UNAUTHORIZED");
        }

        doctorData = await DoctorWrapper(null, doctor_id);
        doctorUserId = doctorData.getUserId();
      } else {
        const doctor = await doctorService.getDoctorByData({
          user_id: doctorUserId
        });
        doctorData = await DoctorWrapper(doctor);
      }

      if (gender && speciality_id) {
        const updatedDoctor = await doctorService.updateDoctor(
          { gender, speciality_id },
          doctorData.getDoctorId()
        );
      }

      if (qualifications.length > 0) {
        for (const qualification of qualifications) {
          const {
            degree_id: degreeId = "",
            year = "",
            college_id = "",
            college_name = "",
            id,
            photos = []
          } = qualification || {};

          if (photos.length > 3) {
            return this.raiseServerError(
              res,
              422,
              {},
              "Cannot add more than 3 documents"
            );
          }

          let degree_id = null;

          // -- add degree

          const isDegreeNotANumber = isNaN(degreeId);
          if (isDegreeNotANumber) {
            const degree = await degreeService.getByData({ name: degreeId });

            if (degree) {
              const degreeData = await DegreeWrapper(degree);
              degree_id = degreeData.getDegreeId();
            } else {
              const newDegree = await degreeService.create({
                name: degreeId,
                user_created: userId
              });
              const newDegreeData = await DegreeWrapper(newDegree);
              degree_id = newDegreeData.getDegreeId();
            }
          } else {
            degree_id = degreeId;
          }

          let degree = await degreeService.getByData({ id: degree_id });
          const degreeWrapper = await DegreeWrapper(degree);
          degreeData[
            degreeWrapper.getDegreeId()
          ] = degreeWrapper.getBasicInfo();

          if (id === "0") {
            let collegeId = college_id;
            if (college_name !== "") {
              const college = await collegeService.create({
                name: college_name,
                user_created: true
              });

              const collegeWrapper = await CollegeWrapper(college);
              collegeId = collegeWrapper.getCollegeId();
            }

            const docQualification = await qualificationService.addQualification(
              {
                doctor_id: doctorData.getDoctorId(),
                degree_id,
                year,
                college_id: collegeId
              }
            );

            for (const photo of photos) {
              const docExist = await documentService.getDocumentByData(
                DOCUMENT_PARENT_TYPE.DOCTOR_QUALIFICATION,
                id,
                getFilePath(photo)
              );

              if (!docExist) {
                const qualificationDoc = await documentService.addDocument({
                  doctor_id: doctorData.getDoctorId(),
                  parent_type: DOCUMENT_PARENT_TYPE.DOCTOR_QUALIFICATION,
                  parent_id: docQualification.get("id"),
                  document: getFilePath(photo)
                });
              }
            }
          } else {
            let collegeId = college_id;

            if (college_name !== "") {
              let college = null;
              college = await collegeService.getByData({ name: college_name });

              if (!college) {
                college = await collegeService.create({
                  name: college_name,
                  user_created: true
                });
              }

              const collegeWrapper = await CollegeWrapper(college);
              collegeId = collegeWrapper.getCollegeId();
            }

            const existingdocQualification = await qualificationService.updateQualification(
              {
                doctor_id: doctorData.getDoctorId(),
                degree_id,
                year,
                college_id: collegeId
              },
              id
            );
            for (const photo of photos) {
              const docExist = await documentService.getDocumentByData(
                DOCUMENT_PARENT_TYPE.DOCTOR_QUALIFICATION,
                id,
                getFilePath(photo)
              );

              if (!docExist) {
                const qualificationDoc = await documentService.addDocument({
                  doctor_id: doctorData.getDoctorId(),
                  parent_type: DOCUMENT_PARENT_TYPE.DOCTOR_QUALIFICATION,
                  parent_id: id,
                  document: getFilePath(photo)
                });
              }
            }
          }
        }
      }

      // REGISTRATION
      const {
        number = "",
        registration_council_id: regCouncilId = "",
        year: registration_year = "",
        expiry_date = "",
        id,
        photos: registration_photos = []
      } = registration || {};

      let docRegistrationDetails = null;

      if (registration_photos.length > 3) {
        return this.raiseServerError(
          res,
          422,
          {},
          "Cannot add more than 3 documents"
        );
      }
      let registration_council_id = null;

      // -- add council

      const isCouncilNotANumber = isNaN(regCouncilId);
      if (isCouncilNotANumber) {
        const council = await councilService.getByData({ name: regCouncilId });

        if (council) {
          const councilData = await CouncilWrapper(council);
          registration_council_id = councilData.getCouncilId();
        } else {
          const newCouncil = await councilService.create({
            name: regCouncilId,
            user_created: userId
          });
          const newCouncilData = await CouncilWrapper(newCouncil);
          registration_council_id = newCouncilData.getCouncilId();
        }
      } else {
        registration_council_id = regCouncilId;
      }

      const council = await councilService.getByData({
        id: registration_council_id
      });
      const councilWrapper = await CouncilWrapper(council);
      councilData[
        councilWrapper.getCouncilId()
      ] = councilWrapper.getBasicInfo();

      if (id === "0") {
        const doctorRegistration = await registrationService.addRegistration({
          doctor_id: doctorData.getDoctorId(),
          number,
          registration_council_id,
          year: registration_year,
          expiry_date: moment(expiry_date)
        });

        for (const photo of registration_photos) {
          const docExist = await documentService.getDocumentByData(
            DOCUMENT_PARENT_TYPE.DOCTOR_REGISTRATION,
            id,
            getFilePath(photo)
          );

          if (!docExist) {
            const qualificationDoc = await documentService.addDocument({
              doctor_id: doctorData.getDoctorId(),
              parent_type: DOCUMENT_PARENT_TYPE.DOCTOR_REGISTRATION,
              parent_id: doctorRegistration.get("id"),
              document: getFilePath(photo)
            });
          }
        }

        docRegistrationDetails = await RegistrationWrapper(doctorRegistration);
      } else {
        const docRegistration = await registrationService.updateRegistration(
          {
            doctor_id: doctorData.getDoctorId(),
            number,
            registration_council_id,
            year: registration_year,
            expiry_date: moment(expiry_date)
          },
          id
        );

        docRegistrationDetails = await RegistrationWrapper(null, id);

        for (const photo of registration_photos) {
          const docExist = await documentService.getDocumentByData(
            DOCUMENT_PARENT_TYPE.DOCTOR_REGISTRATION,
            id,
            getFilePath(photo)
          );

          if (!docExist) {
            const registrationDoc = await documentService.addDocument({
              doctor_id: doctorData.getDoctorId(),
              parent_type: DOCUMENT_PARENT_TYPE.DOCTOR_REGISTRATION,
              parent_id: id,
              document: getFilePath(photo)
            });
          }
        }
      }

      const updatedDoctor = await doctorService.getDoctorByData({
        user_id: doctorUserId
      });
      const updatedDoctorData = await DoctorWrapper(updatedDoctor);

      let uploadDocumentsData = {};

      let qualificationsData = {};
      let doctor_qualification_ids = [];
      const doctorQualifications = await qualificationService.getQualificationsByDoctorId(
        updatedDoctorData.getDoctorId()
      );
      for (const doctorQualification of doctorQualifications) {
        let upload_document_ids = [];
        const qualificationData = await QualificationWrapper(
          doctorQualification
        );
        doctor_qualification_ids.push(
          qualificationData.getDoctorQualificationId()
        );

        const uploadDocuments = await documentService.getDoctorQualificationDocuments(
          DOCUMENT_PARENT_TYPE.DOCTOR_QUALIFICATION,
          qualificationData.getDoctorQualificationId()
        );

        for (const uploadDocument of uploadDocuments) {
          const uploadDocumentData = await UploadDocumentWrapper(
            uploadDocument
          );
          upload_document_ids.push(uploadDocumentData.getUploadDocumentId());
          uploadDocumentsData[
            uploadDocumentData.getUploadDocumentId()
          ] = uploadDocumentData.getBasicInfo();
        }
        qualificationsData[qualificationData.getDoctorQualificationId()] = {
          ...qualificationData.getBasicInfo(),
          upload_document_ids
        };
      }

      let registrationsData = {};
      let doctor_registration_ids = [];
      const doctorRegistrations = await registrationService.getRegistrationByDoctorId(
        updatedDoctorData.getDoctorId()
      );
      for (const doctorRegistration of doctorRegistrations) {
        let upload_document_ids = [];
        const registrationData = await RegistrationWrapper(doctorRegistration);

        const uploadDocuments = await documentService.getDoctorQualificationDocuments(
          DOCUMENT_PARENT_TYPE.DOCTOR_REGISTRATION,
          registrationData.getDoctorRegistrationId()
        );
        doctor_registration_ids.push(
          registrationData.getDoctorRegistrationId()
        );

        for (const uploadDocument of uploadDocuments) {
          const uploadDocumentData = await UploadDocumentWrapper(
            uploadDocument
          );
          upload_document_ids.push(uploadDocumentData.getUploadDocumentId());
          uploadDocumentsData[
            uploadDocumentData.getUploadDocumentId()
          ] = uploadDocumentData.getBasicInfo();
        }
        registrationsData[registrationData.getDoctorRegistrationId()] = {
          ...registrationData.getBasicInfo(),
          upload_document_ids
        };
      }

      return raiseSuccess(
        res,
        200,
        {
          registration_id: docRegistrationDetails.getDoctorRegistrationId(),
          doctors: {
            [updatedDoctorData.getDoctorId()]: updatedDoctorData.getBasicInfo(),
            doctor_qualification_ids,
            doctor_registration_ids
          },
          ...(await updatedDoctorData.getReferenceInfo()),
          doctor_qualifications: {
            ...qualificationsData
          },
          doctor_registrations: {
            ...registrationsData
          },
          upload_documents: {
            ...uploadDocumentsData
          },
          councils: {
            ...councilData
          },
          degrees: {
            ...degreeData
          },
          specialities: {
            ...specialityData
          }
        },
        "registration details updated successfully"
      );
    } catch (error) {
      Logger.debug("registrationStep 500 error", error);
      return raiseServerError(res);
    }
  };

  getAllDoctorDetails = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const {
        userDetails: { userId } = {},
        params: { doctor_id = null } = {}
      } = req;

      const doctors = await doctorService.getDoctorByData({ user_id: userId });

      Logger.debug("76578937476238497923847238492342", userId);

      let doctorQualificationApiDetails = {};
      let doctorClinicApiDetails = {};
      let uploadDocumentApiDetails = {};
      let doctorRegistrationApiDetails = {};
      let doctor_qualification_ids = [];
      let doctor_registration_ids = [];
      let doctor_clinic_ids = [];
      let upload_document_ids = [];

      let doctorWrapper = null;

      if (parseInt(doctor_id) > 0) {
        doctorWrapper = await DoctorWrapper(null, doctor_id);
      } else {
        Logger.debug("76578937476238497923847238492342 ----> doctors", doctors);

        if (!doctors) {
          return raiseClientError(res, 422, {}, "Doctor details not updated");
        }

        doctorWrapper = await DoctorWrapper(doctors);
      }

      const doctorQualifications = await qualificationService.getQualificationsByDoctorId(
        doctorWrapper.getDoctorId()
      );

      const userDetails = await userService.getUserById(
        doctorWrapper.getUserId()
      );
      const userWrapper = await UserWrapper(userDetails.get());

      for (const doctorQualification of doctorQualifications) {
        const doctorQualificationWrapper = await QualificationWrapper(
          doctorQualification
        );

        const qualificationDocuments = await documentService.getDoctorQualificationDocuments(
          DOCUMENT_PARENT_TYPE.DOCTOR_QUALIFICATION,
          doctorQualificationWrapper.getDoctorQualificationId()
        );

        for (const document of qualificationDocuments) {
          const uploadDocumentWrapper = await UploadDocumentWrapper(document);
          uploadDocumentApiDetails[
            uploadDocumentWrapper.getUploadDocumentId()
          ] = uploadDocumentWrapper.getBasicInfo();
          upload_document_ids.push(uploadDocumentWrapper.getUploadDocumentId());
        }

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
      }

      // REGISTRATION DETAILS
      const doctorRegistrations = await registrationService.getRegistrationByDoctorId(
        doctorWrapper.getDoctorId()
      );

      Logger.debug("198361283 ---====> ", doctorRegistrations);

      for (const doctorRegistration of doctorRegistrations) {
        const doctorRegistrationWrapper = await RegistrationWrapper(
          doctorRegistration
        );

        const registrationDocuments = await documentService.getDoctorQualificationDocuments(
          DOCUMENT_PARENT_TYPE.DOCTOR_REGISTRATION,
          doctorRegistrationWrapper.getDoctorRegistrationId()
        );

        for (const document of registrationDocuments) {
          const uploadDocumentWrapper = await UploadDocumentWrapper(document);
          uploadDocumentApiDetails[
            uploadDocumentWrapper.getUploadDocumentId()
          ] = uploadDocumentWrapper.getBasicInfo();
          upload_document_ids.push(uploadDocumentWrapper.getUploadDocumentId());
        }

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
      }

      const doctorClinics = await clinicService.getClinicForDoctor(
        doctorWrapper.getDoctorId()
      );

      for (const doctorClinic of doctorClinics) {
        const doctorClinicWrapper = await ClinicWrapper(doctorClinic);
        doctorClinicApiDetails[
          doctorClinicWrapper.getDoctorClinicId()
        ] = doctorClinicWrapper.getBasicInfo();
        doctor_clinic_ids.push(doctorClinicWrapper.getDoctorClinicId());
      }

      const degrees = await degreeService.getAll();
      let degreeData = {};
      for (const degree of degrees) {
        const degreeWrapper = await DegreeWrapper(degree);
        degreeData[degreeWrapper.getDegreeId()] = degreeWrapper.getBasicInfo();
      }

      // const courses = await courseService.getAll();
      // let courseData = {};
      // for(const course of courses) {
      //   const courseWrapper = await CourseWrapper(course);
      //   courseData[courseWrapper.getDegreeId()] = courseWrapper.getBasicInfo();
      // }

      const colleges = await collegeService.getAll();
      let collegeData = {};
      for (const college of colleges) {
        const collegeWrapper = await CollegeWrapper(college);
        collegeData[
          collegeWrapper.getCollegeId()
        ] = collegeWrapper.getBasicInfo();
      }

      const councils = await councilService.getAll();
      let councilData = {};
      for (const council of councils) {
        const councilWrapper = await CouncilWrapper(council);
        councilData[
          councilWrapper.getCouncilId()
        ] = councilWrapper.getBasicInfo();
      }

      const refInfo = await doctorWrapper.getReferenceInfo();
      const { doctors: docss = {}, users: userss = {} } = refInfo;
      Logger.debug("2864235427654723867432648327", {
        refInfo,
        doctors: docss,
        users: userss
      });

      return raiseSuccess(
        res,
        200,
        {
          ...(await doctorWrapper.getReferenceInfo()),
          doctors: {
            [doctorWrapper.getDoctorId()]: {
              ...(await doctorWrapper.getAllInfo()),
              doctor_qualification_ids,
              doctor_clinic_ids,
              doctor_registration_ids
            }
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
            ...collegeData
          },
          degrees: {
            ...degreeData
          },
          registration_councils: {
            ...councilData
          },
          users: {
            [userWrapper.getId()]: userWrapper.getBasicInfo()
          }
        },
        "Doctor details fetched successfully"
      );
    } catch (error) {
      Logger.debug(" get all details 500 error", error);
      return raiseServerError(res);
    }
  };

  updateDoctorClinics = async (req, res) => {
    const { raiseServerError, raiseSuccess, raiseClientError } = this;
    try {
      const { clinics = [], doctor_id = null } = req.body;
      const {
        userDetails: { userId, userData: { category = null } = {} } = {}
      } = req;

      let doctorUserId = userId;
      let doctorData = null;
      if (doctor_id) {
        if (category !== USER_CATEGORY.PROVIDER) {
          return raiseClientError(res, 401, {}, "UNAUTHORIZED");
        }

        doctorData = await DoctorWrapper(null, doctor_id);
        doctorUserId = doctorData.getUserId();
      } else {
        const doctor = await doctorService.getDoctorByData({
          user_id: doctorUserId
        });
        doctorData = await DoctorWrapper(doctor);
      }

      let clinicDetails = {};
      let doctor_clinic_ids = [];

      for (const clinic of clinics) {
        const {
          name = "",
          location = "",
          time_slots = {},
          clinic_id = ""
        } = clinic;

        const details = {
          time_slots
        };

        let newClinic = "";

        if (clinic_id) {
          Logger.debug("76578976546786546789", clinic_id);
          if (name) {
            clinicDetails["name"] = name;
          }
          if (location) {
            clinicDetails["location"] = location;
          }
          if (time_slots) {
            clinicDetails["details"] = { time_slots: time_slots };
          }

          let id = clinic_id;
          let clinic = await clinicService.updateClinic(clinicDetails, id);

          newClinic = await clinicService.getClinicById(clinic_id);

          Logger.debug("76578976546786546789 --->", newClinic);
        } else {
          if (name && location) {
            newClinic = await clinicService.addClinic({
              doctor_id: doctorData.getDoctorId(),
              name,
              location,
              details
            });
          }
        }

        if (newClinic) {
          const clinicData = await ClinicWrapper(newClinic);
          clinicDetails[
            clinicData.getDoctorClinicId()
          ] = clinicData.getBasicInfo();
          doctor_clinic_ids.push(clinicData.getDoctorClinicId());
        }
      }

      const userUpdate = await userService.updateUser(
        {
          onboarded: true,
          onboarding_status: ONBOARDING_STATUS.CLINIC_REGISTERED
        },
        doctorUserId
      );
      const updateUser = await userService.getUserById(doctorUserId);

      const userData = await UserWrapper(updateUser.get());

      return raiseSuccess(
        res,
        200,
        {
          users: {
            [userData.getId()]: userData.getBasicInfo()
          },
          doctor_clinics: {
            ...clinicDetails
          },
          doctor_clinic_ids
        },
        "Doctor clinics added successfully"
      );
    } catch (error) {
      Logger.debug("updateDoctorClinics 500 error", error);
      return raiseServerError(res);
    }
  };

  deleteQualificationDocument = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;

    try {
      const { id = 0 } = req.params;
      const { document = "" } = req.body;
      const documentToCheck = getFilePath(document);
      let documentToDelete = await documentService.getDocumentByData(
        DOCUMENT_PARENT_TYPE.DOCTOR_QUALIFICATION,
        id,
        documentToCheck
      );

      await documentToDelete.destroy();
      return raiseSuccess(
        res,
        200,
        {},
        "doctor qualification document deleted successfully"
      );
    } catch (error) {
      Logger.debug(
        "DOCTOR QUALIFICATION DOCUMENT DELETE 500 ERROR ---->",
        error
      );
      return raiseServerError(res);
    }
  };

  deleteRegistrationDocument = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;

    try {
      const { id = 0 } = req.params;
      const { document = "" } = req.body;
      const documentToCheck = getFilePath(document);
      let documentToDelete = await documentService.getDocumentByData(
        DOCUMENT_PARENT_TYPE.DOCTOR_REGISTRATION,
        id,
        documentToCheck
      );

      await documentToDelete.destroy();
      return raiseSuccess(
        res,
        200,
        {},
        "doctor registration document deleted successfully"
      );
    } catch (error) {
      Logger.debug(
        "DOCTOR REGISTRATION DOCUMENT DELETE 500 ERROR ---->",
        error
      );
      return raiseServerError(res);
    }
  };

  uploadImage = async (req, res) => {
    const { userDetails, body } = req;
    const { userId = "3", userData: { category = null } = {} } =
      userDetails || {};

    const { doctor_id = null } = body;

    const file = req.file;
    Logger.debug("file ----> ", file);
    // const fileExt= file.originalname.replace(/\s+/g, '');
    try {
      let doctorUserId = userId;
      if (doctor_id) {
        if (category !== USER_CATEGORY.PROVIDER) {
          return this.raiseClientError(res, 401, {}, "UNAUTHORIZED");
        }

        const doctorData = await DoctorWrapper(null, doctor_id);
        doctorUserId = doctorData.getUserId();
      }

      //   await minioService.createBucket();

      //   const imageName = md5(`${userId}-education-pics`);

      //   let hash = md5.create();

      //   hash.hex();
      //   hash = String(hash);

      //   const folder = "adhere";
      //   // const file_name = hash.substring(4) + "_Education_"+fileExt;
      //   const file_name = hash.substring(4) + "/" + imageName + "." + fileExt;

      //   const metaData = {
      //     "Content-Type":
      //         "application/	application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      // };
      // const fileUrl = folder+ "/" +file_name;
      // await minioService.saveBufferObject(file.buffer, file_name, metaData);

      // // console.log("file urlll: ", process.config.minio.MINI);
      // const file_link = process.config.minio.MINIO_S3_HOST +"/" + fileUrl;
      // let files = [file_link];
      // console.log("Uplaoded File Url ---------------------->  ", file_link);
      // console.log("User Controllers =------------------->   ", files);
      //const resume_link = process.config.BASE_DOC_URL + files[0]
      let files = await uploadImageS3(doctorUserId, file);
      return this.raiseSuccess(
        res,
        200,
        {
          files
        },
        "Profile pic uploaded successfully"
      );
    } catch (error) {
      console.log("FILE UPLOAD CATCH ERROR ", error);
      return this.raiseServerError(res, 500, {}, `${error.message}`);
    }
  };

  addPatientToWatchlist = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { patient_id = 0 } = req.params;
      const { userDetails: { userRoleId = null, userId } = {} } = req;

      const patient = await PatientWrapper(null, patient_id);
      const doctor = await doctorsService.getDoctorByUserId(parseInt(userId));

      if (patient && doctor) {
        const newWatchlistRecord = await doctorService.createNewWatchlistRecord(
          {
            patient_id: parseInt(patient_id),
            doctor_id: doctor.get("id"),
            user_role_id: userRoleId
          }
        );

        let doctorData = {};

        if (newWatchlistRecord) {
          const doctorDetails = await DoctorWrapper(doctor);
          doctorData[
            doctorDetails.getDoctorId()
          ] = await doctorDetails.getAllInfo();
        }

        return raiseSuccess(
          res,
          200,
          {
            doctors: {
              ...doctorData
            }
          },
          "watchlist record created"
        );
      } else {
        return raiseClientError(res, 422, {}, "Doctor/patient do not exist");
      }
    } catch (error) {
      Logger.debug("83901283091298 add patient to watchlist error", error);
      return raiseServerError(res);
    }
  };

  removePatientFromWatchlist = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { patient_id = 0 } = req.params;
      const { userDetails: { userId, userRoleId = null } = {} } = req;

      const patient = await PatientWrapper(null, patient_id);
      const doctor = await doctorsService.getDoctorByUserId(parseInt(userId));
      if (patient && doctor) {
        const deletedWatchlistRecord = await doctorService.deleteWatchlistRecord(
          {
            patient_id: parseInt(patient_id),
            doctor_id: doctor.get("id"),
            user_role_id: userRoleId
          }
        );

        let doctorData = {};

        if (deletedWatchlistRecord) {
          const doctorDetails = await DoctorWrapper(doctor);
          doctorData[
            doctorDetails.getDoctorId()
          ] = await doctorDetails.getAllInfo();
        }

        return raiseSuccess(
          res,
          200,
          {
            doctors: {
              ...doctorData
            }
          },
          "watchlist record destroyed"
        );
      } else {
        return raiseClientError(res, 422, {}, "Doctor/patient do not exist");
      }
    } catch (error) {
      Logger.debug("83901283091298 add patient to watchlist error", error);
      return raiseServerError(res);
    }
  };

  updateRazorpayAccount = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const {
        params: { id } = {},
        body: { account_id, account_name } = {}
      } = req;

      const doctor = await DoctorWrapper(null, id);

      const accountDetails = await AccountDetailsService.getCurrentAccountByUserId(
        doctor.getUserId()
      );

      const account = await AccountDetailsWrapper(accountDetails);

      const updateAccount = await AccountDetailsService.update(
        {
          razorpay_account_id: account_id,
          razorpay_account_name: account_name
        },
        account.getId()
      );

      const updatedAccount = await AccountDetailsWrapper(null, account.getId());

      return raiseSuccess(
        res,
        200,
        {
          account_details: {
            [updatedAccount.getId()]: updatedAccount.getBasicInfo()
          }
        },
        "Account updated successfully"
      );
      // if(account_id && id) {
      //   const updateDoctor = await doctorService.updateDoctor({razorpay_account_id: account_id}, id);
      //
      //   const doctor = await DoctorWrapper(null, id);
      //
      //   return raiseSuccess(
      //       res,
      //       200,
      //       {
      //         doctors: {
      //           [doctor.getDoctorId()]: await doctor.getAllInfo(),
      //         }
      //       },
      //       "Acount ID updated successfully"
      //   );
      // } else {
      //   return raiseClientError(res, 422, {}, "Please check filled details");
      // }
    } catch (error) {
      Logger.debug("updateRazorpayAccount 500 error", error);
      return raiseServerError(res);
    }
  };

  updatePatientAndCareplan = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const {
        // mobile_number = "",
        name = "",
        patient_uid = "",
        gender = "",
        date_of_birth = "",
        // prefix = "",
        comorbidities = "",
        allergies = "",
        clinical_notes = "",
        diagnosis_type = "1",
        diagnosis_description = "",
        treatment_id,
        severity_id,
        condition_id,
        height = "",
        weight = "",
        symptoms = "",
        address = ""
      } = req.body;

      const {
        params: { careplan_id } = {},
        userDetails: { userId } = {}
      } = req;
      const carePlanData = await CarePlanWrapper(null, careplan_id);
      const patient_id = await carePlanData.getPatientId();
      const initialPatientData = await PatientWrapper(null, patient_id);

      const previousDetails = (await initialPatientData.getDetails()) || {};
      const { basic_info: prevBasicInfo } =
        initialPatientData.getBasicInfo() || {};

      // split names of patient
      let patientName = "";
      if (name) {
        patientName = name.trim().split(" ");
      }

      const { first_name, middle_name, last_name } = getSeparateName(name);
      // let first_name = patientName[0] || null;
      // let middle_name = patientName.length === 3 ? patientName[1] : null;
      // let last_name =
      //     patientName.length === 3
      //         ? patientName[2]
      //         : patientName.length === 2
      //         ? patientName[1]
      //         : null;

      const patientUpdateData = {
        ...prevBasicInfo,
        details: {
          ...previousDetails,
          allergies,
          comorbidities
        },
        uid: patient_uid,
        first_name,
        middle_name,
        last_name,
        gender,
        height,
        weight,
        address,
        dob: date_of_birth,
        age: getAge(moment(date_of_birth))
      };

      const updatedPatient = await patientService.update(
        patientUpdateData,
        patient_id
      );

      const updatedpatientDetails = await PatientWrapper(null, patient_id);

      const initialCarePlanData = await CarePlanWrapper(null, careplan_id);
      const previousCareplanDetails =
        (await initialCarePlanData.getCarePlanDetails()) || {};
      const { basic_info: prevCareplanBasicInfo } =
        initialCarePlanData.getBasicInfo() || {};

      const carePlanUpdateData = {
        ...prevCareplanBasicInfo,
        details: {
          ...previousCareplanDetails,
          clinical_notes,
          treatment_id,
          severity_id,
          condition_id,
          symptoms,
          diagnosis: {
            type: diagnosis_type,
            description: diagnosis_description
          }
        }
      };

      const updatedCareplanId = await carePlanService.updateCarePlan(
        carePlanUpdateData,
        careplan_id
      );

      const updatedCareplanDetails = await CarePlanWrapper(null, careplan_id);

      return raiseSuccess(
        res,
        200,
        {
          care_plan_ids: [initialCarePlanData.getCarePlanId()],
          care_plans: {
            [initialCarePlanData.getCarePlanId()]: await updatedCareplanDetails.getAllInfo()
          },
          patients: {
            [initialPatientData.getPatientId()]: updatedpatientDetails.getBasicInfo()
          }
        },
        "Careplan added successfully"
      );
    } catch (error) {
      Logger.debug("UPDATE  PATIENT AND CAREPLAN 500 ERROR", error);
      return raiseServerError(res);
    }
  };

  toggleChatMessagePermission = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const {
        params: { patient_id = null } = {},
        userDetails: { userId } = {},
        body = {}
      } = req;

      const { mute = false } = body;

      const patient = await PatientWrapper(null, patient_id);
      const doctor = await doctorsService.getDoctorByUserId(parseInt(userId));

      const featureData = await featuresService.getFeatureByName(FEATURES.CHAT);

      if (featureData) {
        const feature_id = featureData.get("id");

        if (mute) {
          const deleteFeatureMapping = await doctorPatientFeatureMappingService.deleteMapping(
            {
              doctor_id: doctor.get("id"),
              patient_id,
              feature_id
            }
          );
        } else {
          const patientFeature = await doctorPatientFeatureMappingService.create(
            {
              doctor_id: doctor.get("id"),
              patient_id: patient.getPatientId(),
              feature_id
            }
          );
        }
      }

      const patientFeatures = await doctorPatientFeatureMappingService.getByData(
        {
          patient_id,
          doctor_id: doctor.get("id")
        }
      );

      let patientFeatureIds = [];

      for (const feature of patientFeatures) {
        const featureWrapper = await FeatureMappingWrapper(feature);
        const feature_id = featureWrapper.getFeatureId();
        patientFeatureIds.push(feature_id);
      }

      return raiseSuccess(
        res,
        200,
        {
          feature_mappings: {
            [patient_id]: patientFeatureIds
          }
        },
        "Chat permission updated successfully."
      );
    } catch (error) {
      Logger.debug("toggleChatMessagePermission 500 ERROR", error);
      return raiseServerError(res);
    }
  };

  toggleVideoCallPermission = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const {
        params: { patient_id = null } = {},
        userDetails: { userId } = {},
        body = {}
      } = req;

      const { block = false } = body;

      const patient = await PatientWrapper(null, patient_id);
      const doctor = await doctorsService.getDoctorByUserId(parseInt(userId));

      const featureData = await featuresService.getFeatureByName(
        FEATURES.VIDEO_CALL
      );

      if (featureData) {
        const feature_id = featureData.get("id");

        if (block) {
          const deleteFeatureMapping = await doctorPatientFeatureMappingService.deleteMapping(
            {
              doctor_id: doctor.get("id"),
              patient_id,
              feature_id
            }
          );
        } else {
          const patientFeature = await doctorPatientFeatureMappingService.create(
            {
              doctor_id: doctor.get("id"),
              patient_id: patient.getPatientId(),
              feature_id
            }
          );
        }
      }

      const patientFeatures = await doctorPatientFeatureMappingService.getByData(
        {
          patient_id,
          doctor_id: doctor.get("id")
        }
      );

      let patientFeatureIds = [];

      for (const feature of patientFeatures) {
        const featureWrapper = await FeatureMappingWrapper(feature);
        const feature_id = featureWrapper.getFeatureId();
        patientFeatureIds.push(feature_id);
      }

      return raiseSuccess(
        res,
        200,
        {
          feature_mappings: {
            [patient_id]: patientFeatureIds
          }
        },
        "Video call permission updated successfully."
      );
    } catch (error) {
      Logger.debug("toggleVideoCallPermission 500 ERROR", error);
      return raiseServerError(res);
    }
  };

  getPaginatedDataForPatients = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const {
        userDetails: { userId, userRoleId = null } = {},
        query = {}
      } = req;

      const {
        offset = 0,
        watchlist = 0,
        sort_by_name = 1,
        name_order = 1,
        created_at_order = 1,
        searchTreatmentText = "",
        searchDisagnosisType = "",
        seachDiagnosisText = ""
      } = query || {};

      Logger.debug("783425462354725436211", { query });

      const limit = process.config.PATIENT_LIST_SIZE_LIMIT;

      const offsetLimit = parseInt(limit, 10) * parseInt(offset, 10);
      const endLimit = parseInt(limit, 10);

      const doctor = await doctorService.getDoctorByData({
        user_id: userId
      });

      const getWatchListPatients = parseInt(watchlist, 10) === 0 ? 0 : 1;
      const sortByName = parseInt(sort_by_name, 10) === 0 ? 0 : 1;
      const createdAtOrder = parseInt(created_at_order, 10) === 0 ? 0 : 1;
      const nameOrder = parseInt(name_order, 10) === 0 ? 0 : 1;

      let doctorId = null,
        patients = {},
        paginatedPatientData = {},
        watchlistPatientIds = [],
        count = 0,
        patientIds = [];

      if (doctor) {
        const doctorData = await DoctorWrapper(doctor);
        doctorId = doctorData.getDoctorId();

        const doctorAllInfo = await doctorData.getAllInfo();
        const watchlistRecords = await doctorPatientWatchlistService.getAllByData(
          { user_role_id: userRoleId }
        );
        if (watchlistRecords && watchlistRecords.length) {
          for (let i = 0; i < watchlistRecords.length; i++) {
            const watchlistWrapper = await DoctorPatientWatchlistWrapper(
              watchlistRecords[i]
            );
            const patientId = await watchlistWrapper.getPatientId();
            watchlistPatientIds.push(patientId);
          }
        }
      }

      const {
        count: careplansCount = 0,
        rows: careplanAsSecondaryDoctor = []
      } = await careplanSecondaryDoctorMappingService.findAndCountAll({
        where: {
          secondary_doctor_role_id: userRoleId
        }
      });

      let careplanIdsAsSecondaryDoctor = [];

      if (careplansCount) {
        for (let each of careplanAsSecondaryDoctor) {
          const { care_plan: { id = null } = {} } = each || {};
          careplanIdsAsSecondaryDoctor.push(id);
        }
      }

      const secondary_careplan_ids = careplanIdsAsSecondaryDoctor.toString();

      if (getWatchListPatients) {
        count = await carePlanService.getWatchlistedDistinctPatientCounts(
          watchlistPatientIds,
          userRoleId,
          careplanIdsAsSecondaryDoctor
        );
      } else {
        count = await carePlanService.getDistinctPatientCounts(
          userRoleId,
          careplanIdsAsSecondaryDoctor
        );
      }

      if (count > 0) {
        const data = {
          offset: offsetLimit,
          limit: endLimit,
          doctorId,
          watchlistPatientIds,
          watchlist: getWatchListPatients,
          sortByName,
          createdAtOrder,
          nameOrder
        };

        let matchingTreatmentIds = [];
        let treatmentIds = "";
        if (searchTreatmentText) {
          const treatments = await treatmentService.searchByName(
            searchTreatmentText
          );
          for (let each in treatments) {
            const treatment = treatments[each];
            const treatmentData = await TreatmentWrapper(treatment);
            let treatmentId = treatmentData.getTreatmentId();
            matchingTreatmentIds.push(treatmentId);
          }
          treatmentIds = matchingTreatmentIds.toString();
        }

        let careplansForDiagnosisType = {};
        let careplansForDiagnosisDesc = {};
        let careplansForTreatmentType = {};
        let crIdsForMatchingDiagnosisType = [];
        let crIdsForMatchingDiagnosisDesc = [];
        let crIdsForMatchingTreatmentType = [];

        if (searchDisagnosisType) {
          careplansForDiagnosisType = await carePlanService.searchDiagnosisType(
            searchDisagnosisType
          );
        }

        if (seachDiagnosisText) {
          careplansForDiagnosisDesc = await carePlanService.searchDiagnosisDescription(
            seachDiagnosisText
          );
        }

        if (treatmentIds.length > 0) {
          careplansForTreatmentType = await carePlanService.searchtreatmentIds(
            treatmentIds
          );
        }

        for (const each in careplansForDiagnosisType) {
          const formattedCareplanData = careplansForDiagnosisType[each];
          const { careplan_id } = formattedCareplanData;
          crIdsForMatchingDiagnosisType.push(careplan_id);
        }

        for (const each in careplansForDiagnosisDesc) {
          const formattedCareplanData = careplansForDiagnosisDesc[each];
          const { careplan_id } = formattedCareplanData;
          crIdsForMatchingDiagnosisDesc.push(careplan_id);
        }

        for (const each in careplansForTreatmentType) {
          const formattedCareplanData = careplansForTreatmentType[each];
          const { careplan_id } = formattedCareplanData;
          crIdsForMatchingTreatmentType.push(careplan_id);
        }

        const allPatients = await carePlanService.getPaginatedDataOfPatients({
          ...data,
          secondary_careplan_ids
        });

        console.log("35732432542730078783246722223 ======>>>>> ", {
          allPatients,
          crIdsForMatchingTreatmentType
        });

        for (const patient of allPatients) {
          const formattedPatientData = patient;

          const { id, details = {}, care_plan_id } = formattedPatientData;

          if (
            (crIdsForMatchingDiagnosisType.length &&
              crIdsForMatchingDiagnosisType.length > 0) ||
            (crIdsForMatchingDiagnosisDesc.length &&
              crIdsForMatchingDiagnosisDesc.length > 0) ||
            (crIdsForMatchingTreatmentType.length &&
              crIdsForMatchingTreatmentType.length > 0)
          ) {
            if (
              crIdsForMatchingDiagnosisType.length &&
              crIdsForMatchingDiagnosisType.length > 0
            ) {
              if (!crIdsForMatchingDiagnosisType.includes(care_plan_id)) {
                continue;
              }
            } else if (
              crIdsForMatchingDiagnosisDesc.length &&
              crIdsForMatchingDiagnosisDesc.length > 0
            ) {
              if (!crIdsForMatchingDiagnosisDesc.includes(care_plan_id)) {
                continue;
              }
            } else if (
              crIdsForMatchingTreatmentType.length &&
              crIdsForMatchingTreatmentType.length > 0
            ) {
              if (!crIdsForMatchingTreatmentType.includes(care_plan_id)) {
                continue;
              }
            }
          }

          if (patientIds.includes(id)) {
            continue;
          }

          patientIds.push(id);
          let watchlist = false;

          const { profile_pic } = details;
          const updatedDetails = {
            ...details,
            profile_pic: profile_pic ? completePath(profile_pic) : null
          };

          if (watchlistPatientIds.indexOf(id) !== -1) {
            watchlist = true;
          }

          paginatedPatientData[id] = {
            ...formattedPatientData,
            watchlist,
            details: updatedDetails
          };
          const patientWrapper = await PatientWrapper(null, id);
          patients[id] = await patientWrapper.getAllInfo();
        }
      }

      return raiseSuccess(
        res,
        200,
        {
          total: patientIds.length,
          page_size: limit,
          patient_ids: patientIds,
          paginated_patients_data: paginatedPatientData,
          patients
        },
        "Patients data fetched successfully."
      );
    } catch (error) {
      Logger.debug("getPaginatedDataForPatients 500 ERROR", error);
      return raiseServerError(res);
    }
  };

  searchDoctor = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const {
        query: { email = null } = {},
        userDetails: { userId: user_id, userRoleId } = {},
        body = {}
      } = req;

      const matchingUsers = await userService.searchMail(email);
      let users = {},
        doctors = {},
        user_roles = {},
        emails = {};

      if (matchingUsers && matchingUsers.length) {
        for (let i = 0; i < matchingUsers.length; i++) {
          const each = matchingUsers[i];
          const userData = await UserWrapper(each);
          const userId = await userData.getId();
          const matchingDoctor =
            (await doctorService.findOne({
              where: { user_id: userId },
              attributes: ["id"]
            })) || null;

          if (matchingDoctor) {
            const { id: docId } = matchingDoctor || {};
            const doctorData = await DoctorWrapper(null, docId);
            users[userId] = await userData.getBasicInfo();
            const doctorId = await doctorData.getDoctorId();
            doctors[doctorId] = await doctorData.getAllInfo();
            const userRole = await userRolesService.getFirstUserRole(userId);
            const userRoleData = await UserRoleWrapper(userRole);
            user_roles[
              userRoleData.getId()
            ] = await userRoleData.getBasicInfo();
            emails[doctorId] = await userData.getEmail();
          }
        }

        return raiseSuccess(
          res,
          200,
          {
            users,
            doctors,
            user_roles,
            emails
          },
          "Matching Users found  successfully."
        );
      } else {
        return raiseClientError(res, 422, {}, "No Matching Doctors found.");
      }
    } catch (error) {
      Logger.debug("searchEmail 500 ERROR", error);
      return raiseServerError(res);
    }
  };

  searchDoctorName = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const {
        query: { name: value = null } = {},
        userDetails: { userRoleId } = {}
      } = req;

      const limit = process.config.DOCTOR_NAME_SEARCH_LIST_SIZE_LIMIT;
      const endLimit = parseInt(limit, 10);
      const matchingDoctors =
        (await doctorService.searchByName({ value, limit: endLimit })) || [];
      let userRoles = {},
        providers = {},
        doctors = {},
        users = {};
      let rowData = [];
      if (matchingDoctors && matchingDoctors.length) {
        for (let each in matchingDoctors) {
          const eachDoctor = matchingDoctors[each] || {};
          const doctorWrapper = await DoctorWrapper(eachDoctor);
          const userId = (await doctorWrapper.getUserId()) || null;
          const userWrapper = await UserWrapper(null, userId);
          const allUserRolesForDoctor = await userRolesService.getAllByData({
            user_identity: userId
          });
          for (let eachRole in allUserRolesForDoctor) {
            const userRole = allUserRolesForDoctor[eachRole] || {};
            const userRoleWrapper = await UserRoleWrapper(userRole);
            const linked_id = userRoleWrapper.getLinkedId();
            const linked_with = userRoleWrapper.getLinkedWith();

            if (userRoleWrapper.getId() === userRoleId) continue;

            if (linked_id && linked_with === USER_CATEGORY.PROVIDER) {
              const providerWrapper = await ProviderWrapper(null, linked_id);
              providers = {
                [providerWrapper.getProviderId()]: {
                  ...providerWrapper.getBasicInfo()
                }
              };
            }
            // userRoles={ ...userRoles, [userRoleWrapper.getId()]:{...userRoleWrapper.getBasicInfo()} };

            rowData.push({
              doctor_id: doctorWrapper.getDoctorId(),
              user_id: userWrapper.getId(),
              user_role_id: userRoleWrapper.getId(),
              provider_id: linked_id
            });

            doctors = {
              ...doctors,
              [doctorWrapper.getDoctorId()]: {
                ...(await doctorWrapper.getAllInfo())
              }
            };

            users = {
              ...users,
              [userWrapper.getId()]: { ...userWrapper.getBasicInfo() }
            };

            userRoles = {
              ...userRoles,
              [userRoleWrapper.getId()]: { ...userRoleWrapper.getBasicInfo() }
            };
          }

          // rowData.push({
          //   doctors:{
          //     ...doctorWrapper.getBasicInfo()
          //   },
          //   users:{
          //     ...userWrapper.getBasicInfo()
          //   },
          //   user_roles:{
          //     ...userRoles
          //   },
          //   providers:{
          //     ...providers
          //   }
          //  });
        }

        return raiseSuccess(
          res,
          200,
          {
            rowData,
            doctors,
            users,
            user_roles: userRoles,
            providers
          },
          "Matching Doctors found  successfully."
        );
      } else {
        return raiseClientError(
          res,
          422,
          {},
          "No Matching Doctors with name found."
        );
      }
    } catch (error) {
      Logger.debug("searchDoctorName 500 ERROR", error);
      return raiseServerError(res);
    }
  };

  // addProfile = async (req, res) => {
  //   const { raiseSuccess, raiseClientError, raiseServerError } = this;
  //   try {
  //       const {body: {user_role_id, care_plan_id} = {}} = req;

  //       const dataToAdd = {
  //         care_plan_id,
  //         secondary_doctor_role_id: user_role_id
  //       };
  //       const existingMapping = await carePlanSecondaryDoctorMappingService.getByData(dataToAdd) || null;

  //       if(!existingMapping) {
  //         const createdMapping = await carePlanSecondaryDoctorMappingService.create(dataToAdd) || null;

  //         if(createdMapping) {
  //           return raiseSuccess(res, 200, {}, "Profile added successfully");
  //         }
  //       } else {
  //         return raiseClientError(res, 422, {}, "Profile already added in the treatment");
  //       }
  //   } catch(error) {
  //     Logger.debug("addProfile 500 ERROR", error);
  //     return raiseServerError(res);
  //   }
  // };
}

export default new DoctorController();
