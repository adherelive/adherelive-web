import Controller from "../../";
import bcrypt from "bcrypt";
import userService from "../../../services/user/user.service";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

// services
import patientService from "../../../services/patients/patients.service";

import patientsService from "../../../services/patients/patients.service";
import doctorService from "../../../services/doctor/doctor.service";
import carePlanTemplateService from "../../../services/carePlanTemplate/carePlanTemplate.service";
import carePlanService from "../../../services/carePlan/carePlan.service";
import doctorQualificationService from "../../../services/doctorQualifications/doctorQualification.service";
import doctorRegistrationService from "../../../services/doctorRegistration/doctorRegistration.service";
import uploadDocumentService from "../../../services/uploadDocuments/uploadDocuments.service";
import featuresService from "../../../services/features/features.service";
import doctorPatientFeatureMappingService from "../../../services/doctorPatientFeatureMapping/doctorPatientFeatureMapping.service";

// m-api wrappers
import PatientWrapper from "../../../ApiWrapper/mobile/patient";
import CarePlanTemplateWrapper from "../../../ApiWrapper/mobile/carePlanTemplate";
import CarePlanWrapper from "../../../ApiWrapper/mobile/carePlan";
import UserWrapper from "../../../ApiWrapper/mobile/user";
import DoctorWrapper from "../../../ApiWrapper/mobile/doctor";
import ClinicWrapper from "../../../ApiWrapper/mobile/doctorClinic";
import QualificationWrapper from "../../../ApiWrapper/mobile/doctorQualification";
import RegistrationWrapper from "../../../ApiWrapper/mobile/doctorRegistration";
import UploadDocumentWrapper from "../../../ApiWrapper/mobile/uploadDocument";
import FeatureMappingWrapper from "../../../ApiWrapper/mobile/doctorPatientFeatureMapping";
import UserRoleWrapper from "../../../ApiWrapper/mobile/userRoles";

import Log from "../../../../libs/log";
import {
  ALLOWED_DOC_TYPE_DOCTORS,
  DOCUMENT_PARENT_TYPE,
  EMAIL_TEMPLATE_NAME,
  ONBOARDING_STATUS,
  PATIENT_MEAL_TIMINGS,
  SIGN_IN_CATEGORY,
  USER_CATEGORY,
  VERIFICATION_TYPE,
  FEATURES
} from "../../../../constant";

import { getFilePath, completePath } from "../../../helper/filePath";
import qualificationService from "../../../services/doctorQualifications/doctorQualification.service";
import documentService from "../../../services/uploadDocuments/uploadDocuments.service";
import registrationService from "../../../services/doctorRegistration/doctorRegistration.service";
import { uploadImageS3 } from "../user/userHelper";
import clinicService from "../../../services/doctorClinics/doctorClinics.service";
import DoctorQualificationWrapper from "../../../ApiWrapper/mobile/doctorQualification";
import DoctorRegistrationWrapper from "../../../ApiWrapper/mobile/doctorRegistration";
import doctorClinicService from "../../../services/doctorClinics/doctorClinics.service";
import DoctorClinicWrapper from "../../../ApiWrapper/mobile/doctorClinic";
import degreeService from "../../../services/degree/degree.service";
import DegreeWrapper from "../../../ApiWrapper/mobile/degree";
import courseService from "../../../services/course/course.service";
import CourseWrapper from "../../../ApiWrapper/mobile/course";
import getReferenceId from "../../../helper/referenceIdGenerator";
import collegeService from "../../../services/college/college.service";
import CollegeWrapper from "../../../ApiWrapper/mobile/college";
import councilService from "../../../services/council/council.service";
import CouncilWrapper from "../../../ApiWrapper/mobile/council";
import templateMedicationService from "../../../services/templateMedication/templateMedication.service";
import TemplateMedicationWrapper from "../../../ApiWrapper/mobile/templateMedication";
import templateAppointmentService from "../../../services/templateAppointment/templateAppointment.service";
import TemplateAppointmentWrapper from "../../../ApiWrapper/mobile/templateAppointment";
import medicineService from "../../../services/medicine/medicine.service";
import MedicineApiWrapper from "../../../ApiWrapper/mobile/medicine";
import UserVerificationServices from "../../../services/userVerifications/userVerifications.services";
import getUniversalLink from "../../../helper/universalLink";
import getAge from "../../../helper/getAge";
import { getSeparateName } from "../../../helper/common";
import { EVENTS, Proxy_Sdk } from "../../../proxySdk";
import UserPreferenceService from "../../../services/userPreferences/userPreference.service";
import doctorsService from "../../../services/doctors/doctors.service";

const Logger = new Log("M-API DOCTOR CONTROLLER");

class MobileDoctorController extends Controller {
  constructor() {
    super();
  }

  updateDoctor = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { userDetails: { userId } = {} } = req;
      const {
        name,
        city,
        category,
        mobile_number,
        prefix,
        profile_pic,
        signature_pic
      } = req.body;

      const doctorName = name.split(" ");
      const user_data_to_update = {
        category,
        mobile_number,
        prefix,
        onboarding_status: ONBOARDING_STATUS.PROFILE_REGISTERED
      };

      const mobileNumberExist = await userService.getUserByData({
        mobile_number
      });
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

      let doctor = {};
      let doctorExist = await doctorService.getDoctorByData({
        user_id: userId
      });
      const { first_name, middle_name, last_name } = getSeparateName(name);

      if (doctorExist) {
        let doctor_data = {
          city,
          profile_pic: profile_pic
            ? getFilePath(profile_pic)
            : null,
          signature_pic: signature_pic
            ? getFilePath(signature_pic)
            : null,
          first_name,
          middle_name,
          last_name
        };
        let doctor_id = doctorExist.get("id");
        doctor = await doctorService.updateDoctor(doctor_data, doctor_id);
      } else {
        let doctor_data = {
          user_id: userId,
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
        userId
      );

      const updatedUser = await userService.getUserById(userId);

      const userData = await UserWrapper(updatedUser.get());

      const updatedDoctor = await doctorService.getDoctorByData({
        user_id: userId
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

  addPatient = async (req, res) => {
    try {
      Logger.request(req.body);
      const {
        mobile_number = "",
        name = "",
        gender = "",
        date_of_birth = "",
        prefix = "",
        treatment_id = "1",
        severity_id = "1",
        condition_id = "1",
        comorbidities = "",
        allergies = "",
        clinical_notes = "",
        diagnosis_type = "1",
        diagnosis_description = "",
        height = "",
        weight = "",
        symptoms = "",
        address = ""
      } = req.body;
      const { userDetails: { userRoleId = null ,  userId, userData: { category } = {} } = {} } = req;

      const userExists = await userService.getPatientByMobile(mobile_number);

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

      // name split
      let patientName = name.trim().split(" ");
      let first_name = patientName[0] || null;
      let middle_name = patientName.length == 3 ? patientName[1] : null;
      let last_name =
          patientName.length == 3
              ? patientName[2]
              : patientName.length == 2
              ? patientName[1]
              : null;

      if (userExists.length > 0) {
        // todo: find alternative to userExists[0]
        userData = await UserWrapper(userExists[0].get());
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
        Logger.debug("Patient updateResponse ", updateResponse);

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

        await UserPreferenceService.addUserPreference({
          user_id: newUserId,
          details: {
            timings: PATIENT_MEAL_TIMINGS
          }
        });

        const uid = getReferenceId(patient.get("id"));

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
        user_role_id:userRoleId,
        created_at: moment()
      });

      const carePlanData = await CarePlanWrapper(carePlan);

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

      const smsPayload = {
        // countryCode: prefix,
        phoneNumber: `+${prefix}${mobile_number}`, // mobile_number
        message: `Hello from Adhere! Please click the link to verify your number. ${universalLink}`
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
          mainBodyText: "We are really happy to welcome you onboard.",
          subBodyText: "Please verify your account",
          buttonText: "Verify",
          host: process.config.WEB_URL,
          contactTo: "patientEngagement@adhere.com"
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
            [patientData.getPatientId()]: patientData.getBasicInfo()
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
      Logger.debug("ADD DOCTOR PATIENT 500 ERROR ", error);
      return this.raiseServerError(res);
    }
  };

  updateDoctorQualificationRegistration = async (req, res) => {
    const { raiseServerError, raiseSuccess } = this;
    try {
      const {
        speciality_id = "",
        gender = "",
        qualification_details = [],
        registration_details = []
      } = req.body;

      const { userDetails: { userId: user_id } = {} } = req;

      // let user_data_to_update = {
      //   onboarding_status: ONBOARDING_STATUS.QUALIFICATION_REGISTERED
      // };
      const doctor = await doctorService.getDoctorByData({ user_id });
      const doctorData = await DoctorWrapper(doctor);
      // let doctor_id = doctor.get("id");

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
          degree_id = "",
          year = "",
          college_name = "",
          college_id = "",
          photos = [],
          id = 0
        } = item;
        if (id && id !== "0") {
          let collegeId = college_id;
          if (college_name) {
            const college = await collegeService.create({
              name: college_name,
              user_created: true
            });

            const collegeWrapper = await CollegeWrapper(college);
            collegeId = collegeWrapper.getCollegeId();
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
          if (college_name) {
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
          registration_council_id,
          year,
          expiry_date,
          id = 0
        } = item;
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
        user_id
      );

      const updatedUser = await userService.getUserById(user_id);
      const updatedUserData = await UserWrapper(updatedUser.get());

      const updatedDoctor = await doctorService.getDoctorByData({ user_id });
      const updatedDoctorData = await DoctorWrapper(updatedDoctor);

      let uploadDocumentsData = {};

      let qualificationsData = {};
      let doctor_qualification_ids = [];
      const doctorQualifications = await doctorQualificationService.getQualificationsByDoctorId(
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

        const uploadDocuments = await uploadDocumentService.getDoctorQualificationDocuments(
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
      const doctorRegistrations = await doctorRegistrationService.getRegistrationByDoctorId(
        updatedDoctorData.getDoctorId()
      );
      for (const doctorRegistration of doctorRegistrations) {
        let upload_document_ids = [];
        const registrationData = await RegistrationWrapper(doctorRegistration);

        const uploadDocuments = await uploadDocumentService.getDoctorQualificationDocuments(
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
          // doctor
          users: {
            [updatedUserData.getId()]: updatedUserData.getBasicInfo()
          },
          doctors: {
            [updatedDoctorData.getDoctorId()]: updatedDoctorData.getBasicInfo()
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
          doctor_qualification_ids,
          doctor_registration_ids
        },
        "qualifications updated successfully"
      );
    } catch (error) {
      Logger.debug("addDoctorQualification 500 error", error);
      return raiseServerError(res);
    }
  };

  updateQualificationDocs = async (req, res) => {
    const { raiseServerError, raiseSuccess } = this;
    try {
      const { userDetails: { userId } = {} } = req;
      const file = req.file;

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

      let files = await uploadImageS3(userId, file);
      let qualification_id = 0;
      // let doctor = await doctorService.getDoctorByUserId(userId);

      return raiseSuccess(
        res,
        200,
        {
          files: files
          // qualification_id
        },
        "doctor qualification document uploaded successfully"
      );
    } catch (error) {
      Logger.debug("updateQualificationDocs 500 error", error);
      return raiseServerError(res);
    }
  };

  updateRegistrationDocs = async (req, res) => {
    const { raiseServerError } = this;
    try {
      const file = req.file;
      const { userDetails: { userId } = {} } = req;

      Logger.debug("updateRegistrationDocs file", file);

      let files = await uploadImageS3(userId, file);

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
    const { raiseServerError, raiseSuccess } = this;
    try {
      const { gender = "", speciality_id = "", qualification = {} } = req.body;
      const { userDetails: { userId } = {} } = req;

      let doctor = await doctorService.getDoctorByData({ user_id: userId });
      const doctorData = await DoctorWrapper(doctor);

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
        degree_id = "",
        year = "",
        college_name = "",
        college_id = "",
        id = 0,
        photos = []
      } = qualification || {};

      let docQualification = null;

      if (photos.length > 3) {
        return this.raiseServerError(
          res,
          422,
          {},
          "Cannot add more than 3 documents"
        );
      }

      if (!id) {
        let collegeId = college_id;
        if (college_name) {
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
        if (college_name) {
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
        user_id: userId
      });
      const updatedDoctorData = await DoctorWrapper(updatedDoctor);

      let uploadDocumentsData = {};

      let qualificationsData = {};
      let doctor_qualification_ids = [];
      const doctorQualifications = await doctorQualificationService.getQualificationsByDoctorId(
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

        const uploadDocuments = await uploadDocumentService.getDoctorQualificationDocuments(
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

      const colleges = await collegeService.getAll();
      let collegeData = {};
      for (const college of colleges) {
        const collegeWrapper = await CollegeWrapper(college);
        collegeData[
          collegeWrapper.getCollegeId()
        ] = collegeWrapper.getBasicInfo();
      }

      return raiseSuccess(
        res,
        200,
        {
          // qualification_id
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
          colleges: {
            ...collegeData
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
      const { body, userDetails: { userId } = {} } = req;
      const {
        gender = "",
        speciality_id = "",
        qualifications = [],
        registration = {}
      } = body || {};

      const doctor = await doctorService.getDoctorByData({ user_id: userId });
      const doctorData = await DoctorWrapper(doctor);

      if (gender && speciality_id) {
        const updatedDoctor = await doctorService.updateDoctor(
          { gender, speciality_id },
          doctorData.getDoctorId()
        );
      }

      if (qualifications.length > 0) {
        for (const qualification of qualifications) {
          const {
            degree_id = "",
            year = "",
            college_name = "",
            college_id = "",
            id = 0,
            photos = []
          } = qualification || {};
          if (!id) {
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
        registration_council_id = "",
        year: registration_year = "",
        expiry_date = "",
        id = 0,
        photos: registration_photos = []
      } = registration || {};

      if (!id) {
        const docRegistration = await registrationService.addRegistration({
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
            photo
          );

          if (!docExist) {
            const qualificationDoc = await documentService.addDocument({
              doctor_id: doctorData.getDoctorId(),
              parent_type: DOCUMENT_PARENT_TYPE.DOCTOR_REGISTRATION,
              parent_id: docRegistration.get("id"),
              document: getFilePath(photo)
            });
          }
        }
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
        user_id: userId
      });
      const updatedDoctorData = await DoctorWrapper(updatedDoctor);

      let uploadDocumentsData = {};

      let qualificationsData = {};
      let doctor_qualification_ids = [];
      const doctorQualifications = await doctorQualificationService.getQualificationsByDoctorId(
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

        const uploadDocuments = await uploadDocumentService.getDoctorQualificationDocuments(
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
      const doctorRegistrations = await doctorRegistrationService.getRegistrationByDoctorId(
        updatedDoctorData.getDoctorId()
      );
      for (const doctorRegistration of doctorRegistrations) {
        let upload_document_ids = [];
        const registrationData = await RegistrationWrapper(doctorRegistration);

        const uploadDocuments = await uploadDocumentService.getDoctorQualificationDocuments(
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
          // registration_id: registrationId
          doctors: {
            [updatedDoctorData.getDoctorId()]: {
              ...updatedDoctorData.getBasicInfo(),
              doctor_qualification_ids,
              doctor_registration_ids
            }
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
          }
        },
        "Registration details updated successfully"
      );
    } catch (error) {
      Logger.debug("registrationStep 500 error", error);
      return raiseServerError(res);
    }
  };

  updateDoctorClinics = async (req, res) => {
    const { raiseServerError, raiseSuccess } = this;
    try {
      const { clinics = [] } = req.body;
      const { userDetails: { userId } = {} } = req;

      const doctor = await doctorService.getDoctorByData({ user_id: userId });
      const doctorData = await DoctorWrapper(doctor);

      let clinicDetails = {};
      let doctor_clinic_ids = [];

      for (const clinic of clinics) {
        const {
          id: clinic_id = "",
          name = "",
          location = "",
          time_slots = {}
        } = clinic;

        const details = {
          time_slots
        };

        if (clinic_id) {
          const existingClinic = await clinicService.updateClinic(
            {
              name,
              location,
              details
            },
            clinic_id
          );

          const clinicData = await ClinicWrapper(null, clinic_id);
          clinicDetails[
            clinicData.getDoctorClinicId()
          ] = clinicData.getBasicInfo();
          doctor_clinic_ids.push(clinicData.getDoctorClinicId());
        } else {
          const newClinic = await clinicService.addClinic({
            doctor_id: doctorData.getDoctorId(),
            name,
            location,
            details
          });

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
        userId
      );
      const updateUser = await userService.getUserById(userId);

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
        "doctor clinics added successfully"
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

  getAllDoctorDetails = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const { userDetails: { userId } = {} } = req;
      Logger.debug("userId --> ", req.userDetails);
      const doctors = await doctorService.getDoctorByData({ user_id: userId });
      Logger.debug("doctors --> ", doctors);
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

      for (const doctorQualification of doctorQualifications) {
        const doctorQualificationWrapper = await DoctorQualificationWrapper(
          doctorQualification
        );

        const qualificationDocuments = await uploadDocumentService.getDoctorQualificationDocuments(
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
      const doctorRegistrations = await doctorRegistrationService.getRegistrationByDoctorId(
        doctorWrapper.getDoctorId()
      );

      Logger.debug("198361283 ---====> ", doctorRegistrations);

      for (const doctorRegistration of doctorRegistrations) {
        const doctorRegistrationWrapper = await DoctorRegistrationWrapper(
          doctorRegistration
        );

        const registrationDocuments = await uploadDocumentService.getDoctorQualificationDocuments(
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

      const doctorClinics = await doctorClinicService.getClinicForDoctor(
        doctorWrapper.getDoctorId()
      );

      for (const doctorClinic of doctorClinics) {
        const doctorClinicWrapper = await DoctorClinicWrapper(doctorClinic);
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
      //
      // const courses = await courseService.getAll();
      // let courseData = {};
      // for(const course of courses) {
      //   const courseWrapper = await CourseWrapper(course);
      //   courseData[courseWrapper.getDegreeId()] = courseWrapper.getBasicInfo();
      // }

      return raiseSuccess(
        res,
        200,
        {
          users: {
            [userWrapper.getId()]: userWrapper.getBasicInfo()
          },
          doctors: {
            [doctorWrapper.getDoctorId()]: {
              ...doctorWrapper.getBasicInfo(),
              doctor_qualification_ids,
              doctor_clinic_ids,
              doctor_registration_ids
            }
          },
          ...(await doctorWrapper.getReferenceInfo()),
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
          }
        },
        "Doctor details fetched successfully"
      );
    } catch (error) {
      Logger.debug("getalldoctors 500 error", error);
      return raiseServerError(res);
    }
  };

  uploadImage = async (req, res) => {
    const { userDetails, body } = req;
    const { userId = "3" } = userDetails || {};
    const file = req.file;
    Logger.debug("file ----> ", file);
    // const fileExt= file.originalname.replace(/\s+/g, '');
    try {
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
      let files = await uploadImageS3(userId, file);
      return this.raiseSuccess(
        res,
        200,
        {
          files
        },
        "Image uploaded successfully"
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
      const { userDetails: { userId } = {} } = req;

      const patient = await PatientWrapper(null, patient_id);
      const doctor = await doctorsService.getDoctorByUserId(parseInt(userId));

      if (patient && doctor) {
        const newWatchlistRecord = await doctorService.createNewWatchlistRecord(
          {
            patient_id: parseInt(patient_id),
            doctor_id: doctor.get("id")
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
          "Patient added to watchlist"
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
      const { userDetails: { userId } = {} } = req;

      const patient = await PatientWrapper(null, patient_id);
      const doctor = await doctorsService.getDoctorByUserId(parseInt(userId));
      if (patient && doctor) {
        const deletedWatchlistRecord = await doctorService.deleteWatchlistRecord(
          {
            patient_id: parseInt(patient_id),
            doctor_id: doctor.get("id")
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

  updatePatientAndCareplan = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const {
        mobile_number = "",
        name = "",
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
        params: { careplan_id } = {},
        userDetails: { userId } = {}
      } = req;
      const carePlanData = await CarePlanWrapper(null, careplan_id);
      const patient_id = await carePlanData.getPatientId();
      const initialPatientData = await PatientWrapper(null, patient_id);

      const previousDetails = (await initialPatientData.getDetails()) || {};
      const { basic_info: prevBasicInfo } =
        initialPatientData.getBasicInfo() || {};

      let patientName = name.trim().split(" ");
      let first_name = patientName[0];
      let middle_name = patientName.length == 3 ? patientName[1] : "";
      let last_name =
        patientName.length == 3
          ? patientName[2]
          : patientName.length == 2
          ? patientName[1]
          : "";

      const birth_date = moment(date_of_birth);
      const age = getAge(date_of_birth);

      const patientUpdateData = {
        details: {
          ...previousDetails,
          allergies,
          comorbidities
        },
        height,
        weight,
        address,
        gender,
        birth_date,
        age,
        dob: date_of_birth,
        first_name,
        middle_name,
        last_name
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

      return this.raiseSuccess(
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


  getPaginatedDataForPatients = async(req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try { 
      const {
        userDetails: { userId , userRoleId = null  } = {},
        query = {}
      } = req;

      const { offset=0, watchlist = 0, sort_by_name = 1 } = query || {};

      const limit = process.config.PATIENT_LIST_SIZE_LIMIT;

      const offsetLimit = parseInt(limit, 10) * parseInt(offset, 10);
      const endLimit = parseInt(limit, 10);

      const userRoleWrapper = await UserRoleWrapper(null,userRoleId);
      const userIdentity = await userRoleWrapper.getUserId();

      const doctor = await doctorService.getDoctorByData({
        user_id: userIdentity
      });

      const getWatchListPatients = parseInt(watchlist, 10) === 0? 0: 1;
      const sortByName = parseInt(sort_by_name, 10) === 0? 0: 1;

      let doctorId = null, patients = {}, watchlistPatientIds = [], count = 0, patientIds = [];

      if(doctor) {
        const doctorData = await DoctorWrapper(doctor);
        doctorId = doctorData.getDoctorId();

        
        const doctorAllInfo = await doctorData.getAllInfo();
        const { watchlist_patient_ids = []} = doctorAllInfo || {};
        watchlistPatientIds = watchlist_patient_ids;
      }

      if(getWatchListPatients) {
        count = await carePlanService.getWatchlistedDistinctPatientCounts( watchlistPatientIds,userRoleId);
      } else {
        count = await carePlanService.getDistinctPatientCounts(userRoleId);
      }

      if(count > 0) {
        const data = {
          offset: offsetLimit,
          limit: endLimit,
          doctorId,
          watchlistPatientIds,
          watchlist: getWatchListPatients,
          sortByName,
          userRoleId
        }
        const allPatients = await carePlanService.getPaginatedDataOfPatients(data);

        for(const patient of allPatients) {
          const formattedPatientData = patient
  
          const { id, details = {} } = formattedPatientData;
          patientIds.push(id);
          let watchlist = false;
  
          const { profile_pic } = details;
          const updatedDetails =  {
            ...details,
            profile_pic: profile_pic ? completePath(profile_pic) : null,
        };
  
          if(watchlistPatientIds.indexOf(id) !== -1) {
            watchlist = true;
          }
  
          patients[id] = {...formattedPatientData, watchlist, details: updatedDetails};
        }
      }
      
      return raiseSuccess(
        res,
        200,
        {
          total: count,
          page_size: limit,
          patient_ids: patientIds,
          patients
        },
        "Patients data fetched successfully."
      );
      
    } catch (error) {
      Logger.debug("getPaginatedDataForPatients 500 ERROR", error);
      return raiseServerError(res);
    }
  }
}

export default new MobileDoctorController();
