
import Controller from "../index";
import Log from "../../../libs/log";
import moment from "moment";

import userService from "../../services/user/user.service";
import doctorService from "../../services/doctor/doctor.service";
import patientsService from "../../services/patients/patients.service";
import qualificationService from "../../services/doctorQualifications/doctorQualification.service";
import clinicService from "../../services/doctorClinics/doctorClinics.service";
import documentService from "../../services/uploadDocuments/uploadDocuments.service";
import registrationService from "../../services/doctorRegistration/doctorRegistration.service";
import carePlanTemplateService from "../../services/carePlanTemplate/carePlanTemplate.service";
import carePlanService from "../../services/carePlan/carePlan.service";
import medicineService from "../../services/medicine/medicine.service";
import templateMedicationService from "../../services/templateMedication/templateMedication.service";
import templateAppointmentService from "../../services/templateAppointment/templateAppointment.service";
import degreeService from "../../services/degree/degree.service";
import collegeService from "../../services/college/college.service";
import councilService from  "../../services/council/council.service";

import TemplateMedicationWrapper from "../../ApiWrapper/web/templateMedication";
import TemplateAppointmentWrapper from "../../ApiWrapper/web/templateAppointment";

import UserWrapper from "../../ApiWrapper/web/user";
import DoctorWrapper from "../../ApiWrapper/web/doctor";
import PatientWrapper from "../../ApiWrapper/web/patient";
import UploadDocumentWrapper from "../../ApiWrapper/web/uploadDocument";
import CarePlanWrapper from "../../ApiWrapper/web/carePlan";
import QualificationWrapper from "../../ApiWrapper/web/doctorQualification";
import RegistrationWrapper from "../../ApiWrapper/web/doctorRegistration";
import CarePlanTemplateWrapper from "../../ApiWrapper/web/carePlanTemplate";
import ClinicWrapper from "../../ApiWrapper/web/doctorClinic";
import MedicineApiWrapper from "../../ApiWrapper/web/medicine";
import DegreeWrapper from "../../ApiWrapper/web/degree";
import CollegeWrapper from "../../ApiWrapper/web/college";
import CouncilWrapper from "../../ApiWrapper/web/council";

import {
  ALLOWED_DOC_TYPE_DOCTORS,
  DOCUMENT_PARENT_TYPE, EMAIL_TEMPLATE_NAME, EVENT_TYPE,
  ONBOARDING_STATUS,
  SIGN_IN_CATEGORY,
  USER_CATEGORY,
  VERIFICATION_TYPE
} from "../../../constant";
import { getFilePath } from "../../helper/filePath";
import getReferenceId from "../../helper/referenceIdGenerator";
import getUniversalLink from "../../helper/universalLink";
import getAge from "../../helper/getAge";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { uploadImageS3 } from "../mControllers/user/userHelper";
import {EVENTS, Proxy_Sdk} from "../../proxySdk";
import UserVerificationServices from "../../services/userVerifications/userVerifications.services";

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

      for(const doctor of doctors) {
        const doctorWrapper = await DoctorWrapper(doctor);

        doctorApiDetails[
            doctorWrapper.getDoctorId()
            ] = doctorWrapper.getBasicInfo();
        const {specialities} = await doctorWrapper.getReferenceInfo();
        specialityDetails = {...specialityDetails, ...specialities};
        doctorIds.push(doctorWrapper.getDoctorId());
        userIds.push(doctorWrapper.getUserId());
      }

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
      const doctors = await doctorService.getDoctorByData({ id });

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

      const doctorCouncils = await councilService.getCouncilByData({id : registration_council_ids});

      let councilApiDetails = {};
      for(const doctorCouncil of doctorCouncils) {
        const council = await CouncilWrapper(doctorCouncil);
        councilApiDetails[council.getCouncilId()] = council.getBasicInfo();
      }

      const doctorDegrees = await degreeService.getDegreeByData({id: degree_ids});

      let degreeApiDetails = {};
      for(const doctorDegree of doctorDegrees) {
        const degree = await DegreeWrapper(doctorDegree);
        degreeApiDetails[degree.getDegreeId()] = degree.getBasicInfo();
      }

      const doctorColleges = await collegeService.getCollegeByData({id: college_ids});

      let collegeApiDetails = {};
      for(const doctorCollege of doctorColleges) {
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
          doctors: {
            [doctorWrapper.getDoctorId()]: {
              ...doctorWrapper.getBasicInfo(),
              doctor_qualification_ids,
              doctor_clinic_ids,
              doctor_registration_ids,
            }
          },
          ...await doctorWrapper.getReferenceInfo(),
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
          },
          colleges: {
            ...collegeApiDetails,
          },
          degrees: {
            ...degreeApiDetails,
          },
          registration_councils: {
            ...councilApiDetails,
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

      const doctorQualifications = await qualificationService.getQualificationsByDoctorId(doctorWrapper.getDoctorId());
      const doctorRegistrations = await registrationService.getRegistrationByDoctorId(doctorWrapper.getDoctorId());
      const doctorClinics = await clinicService.getClinicForDoctor(doctorWrapper.getDoctorId());

      if(doctorQualifications.length === 0) {
        return this.raiseClientError(res, 422, {}, "Doctor has not updated any qualification details yet. Cannot be verified");
      } else if(doctorRegistrations.length === 0) {
        return this.raiseClientError(res, 422, {}, "Doctor has not updated any registration details yet. Cannot be verified");
      } else if(doctorClinics.length === 0) {
        return this.raiseClientError(res, 422, {}, "Doctor has not updated any clinic details yet. Cannot be verified");
      }

      const {basic_info : {first_name, middle_name, last_name} = {}} = doctorWrapper.getBasicInfo();

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

      const emailPayload = {
        title: "Doctor Account Verification Update",
        toAddress: userWrapper.getEmail(),
        templateName: EMAIL_TEMPLATE_NAME.VERIFIED_DOCTOR,
        templateData: {
          title: "Doctor",
          link: process.config.WEB_URL,
          inviteCard: "",
          mainBodyText: `Greetings from Adhere! We are really happy to inform you that your account has been verified.`,
          subBodyText: "To enable Add Patient option on your Dashboard, please click on verify",
          buttonText: "Verify",
          host: process.config.WEB_URL,
          contactTo: "patientEngagement@adhere.com"
        }
      };
      Proxy_Sdk.execute(EVENTS.SEND_EMAIL, emailPayload);

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

  addDoctor = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { userDetails: { userId } = {} } = req;
      const {
        name,
        city,
        category,
        mobile_number,
        prefix,
        profile_pic
      } = req.body;
      const doctorName = name.split(" ");
      const user_data_to_update = {
        category,
        mobile_number,
        prefix,
        onboarding_status: ONBOARDING_STATUS.PROFILE_REGISTERED
      };

      let doctor = {};
      let doctorExist = await doctorService.getDoctorByData({
        user_id: userId
      });
      let first_name = doctorName[0];
      let middle_name = doctorName.length === 3 ? doctorName[1] : "";
      let last_name =
        doctorName.length === 3
          ? doctorName[2]
          : doctorName.length === 2
            ? doctorName[1]
            : "";

      if (doctorExist) {
        let doctor_data = {
          city,
          profile_pic: profile_pic
            ? profile_pic.split(process.config.minio.MINIO_BUCKET_NAME)[1]
            : null,
          first_name,
          middle_name,
          last_name,
          address: city
        };
        let doctor_id = doctorExist.get("id");
        doctor = await doctorService.updateDoctor(doctor_data, doctor_id);
      } else {
        let doctor_data = {
          user_id: userId,
          city,
          profile_pic: getFilePath(profile_pic),
          first_name,
          middle_name,
          last_name,
          address: city
        };
        doctor = await doctorService.addDoctor(doctor_data);
      }
      const userUpdate = await userService.updateUser(
        user_data_to_update,
        userId
      );

      const updatedUser = await userService.getUserById(userId);

      const userData = await UserWrapper(updatedUser.get());

      const updatedDoctor = await doctorService.getDoctorByData({ user_id: userId });
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
      const {
        mobile_number = "",
        name = "",
        gender = "",
        date_of_birth = "",
        prefix = "",
        treatment_id = "1",
        severity_id = "1",
        condition_id = "1"
      } = req.body;
      const { userDetails: { userId, userData: { category } = {} } = {} } = req;

      const userExists = await userService.getPatientByMobile(mobile_number);

      if(userExists.length > 0) {
        return this.raiseClientError(res, 422, {}, `Patient with mobile number: ${mobile_number} already exists`);
      }

      let password = process.config.DEFAULT_PASSWORD;
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
        activated_on: moment().format()
      });

      const userData = await UserWrapper(user.get());

      let newUserId = user.get("id");

      let first_name = "";
      let middle_name = "";
      let last_name = "";

      if(name) {
        let patientName = name.split(" ");
        first_name = patientName[0];
        middle_name = patientName.length == 3 ? patientName[1] : "";
        last_name =
            patientName.length == 3
                ? patientName[2]
                : patientName.length == 2
                ? patientName[1]
                : "";
      }

      // const uid = uuidv4();

      const birth_date = moment(date_of_birth);
      const age = getAge(date_of_birth);



      // const age = moment().diff(birth_date, "y");
      const patient = await patientsService.addPatient({
        first_name,
        gender: gender ? gender : null,
        middle_name,
        last_name,
        user_id: newUserId,
        birth_date,
        age,
        dob: moment(date_of_birth).toISOString()
        // uid
      });

      const patientData = await PatientWrapper(patient);
      const uid = getReferenceId(patientData.getPatientId());
      // Logger.debug("UID -------------> ", uid);

      const updatePatientUid = await patientsService.update({uid}, patientData.getPatientId());

      const updatedPatientData = await PatientWrapper(null, patientData.getPatientId());

      const doctor = await doctorService.getDoctorByData({ user_id: userId });
      const carePlanTemplate = await carePlanTemplateService.getCarePlanTemplateByData(
        treatment_id,
        severity_id,
        condition_id
      );

      Logger.debug("careplanTemplate ----> ", carePlanTemplate);


      const patient_id = patient.get("id");
      const care_plan_template_id = carePlanTemplate
        ? carePlanTemplate.get("id")
        : null;

      const details = { treatment_id, severity_id, condition_id };

      const carePlan = await carePlanService.addCarePlan({
        patient_id,
        doctor_id: doctor.get("id"),
        care_plan_template_id,
        details,
        expired_on: moment().add(1, "y")
      });

      const carePlanData = await CarePlanWrapper(carePlan);

      let templateMedicationData = {};
      let template_medication_ids = [];

      let templateAppointmentData = {};
      let template_appointment_ids = [];
      let medicine_ids = [];


      let carePlanTemplateData = null;

      if (carePlanData.getCarePlanTemplateId()) {
        const carePlanTemplate = await carePlanTemplateService.getCarePlanTemplateById(carePlanData.getCarePlanTemplateId());
        carePlanTemplateData = await CarePlanTemplateWrapper(carePlanTemplate);
        const medications = await templateMedicationService.getMedicationsByCarePlanTemplateId(carePlanData.getCarePlanTemplateId());

        for (const medication of medications) {
          const medicationData = await TemplateMedicationWrapper(medication);
          templateMedicationData[medicationData.getTemplateMedicationId()] = medicationData.getBasicInfo();
          template_medication_ids.push(medicationData.getTemplateMedicationId());
          medicine_ids.push(medicationData.getTemplateMedicineId());
        }

        const appointments = await templateAppointmentService.getAppointmentsByCarePlanTemplateId(carePlanData.getCarePlanTemplateId());

        for (const appointment of appointments) {
          const appointmentData = await TemplateAppointmentWrapper(appointment);
          templateAppointmentData[appointmentData.getTemplateAppointmentId()] = appointmentData.getBasicInfo();
          template_appointment_ids.push(appointmentData.getTemplateAppointmentId());
        }
      }

      const medicineData = await medicineService.getMedicineByData({
        id: medicine_ids
      });

      let medicineApiData = {};

      let carePlanTemplateDetails = {};
      if (carePlanTemplate) {
        const carePlanTemplateData = await CarePlanTemplateWrapper(
          carePlanTemplate
        );
        carePlanTemplateDetails[carePlanTemplateData.getCarePlanTemplateId()] = {
          ...carePlanTemplateData.getBasicInfo(),
          template_appointment_ids,
          template_medication_ids
        };
      }

      // Logger.debug(
      //   "medicineData",
      //   medicineData
      // );

      for (const medicine of medicineData) {
        const medicineWrapper = await MedicineApiWrapper(medicine);
        medicineApiData[medicineWrapper.getMedicineId()] = medicineWrapper.getBasicInfo();
      }

      const link = uuidv4();
      const status = "pending";

      const userVerification = UserVerificationServices.addRequest({
        user_id: userId,
        request_id: link,
        status: "pending",
        type: VERIFICATION_TYPE.PATIENT_SIGN_UP
      });

      const universalLink = await getUniversalLink({event_type : VERIFICATION_TYPE.PATIENT_SIGN_UP,link});

      // Logger.debug("universalLink --> ", universalLink);

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


      return this.raiseSuccess(
        res,
        200,
        {
          patient_ids: [patient_id],
          // carePlanId,
          care_plan_ids: [carePlanData.getCarePlanId()],
          care_plan_template_ids: [care_plan_template_id],
          users: {
            [userData.getId()] : userData.getBasicInfo()
          },
          patients: {
            [updatedPatientData.getPatientId()]: updatedPatientData.getBasicInfo()
          },
          care_plans: {
            [carePlanData.getCarePlanId()]: carePlanData.getBasicInfo()
          },
          care_plan_templates: {
            ...carePlanTemplateDetails
          },
          template_appointments: {
            ...templateAppointmentData
          },
          template_medications: {
            ...templateMedicationData
          },
          show: carePlanTemplate ? true : false,
        },
        "doctor's patient added successfully"
      );
    } catch (error) {
      Logger.debug("ADD DOCTOR PATIENT 500 ERROR", error);
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
          college_id = "",
          photos = [],
          id = 0
        } = item;
        if (id && id !== "0") {
          const qualification = await qualificationService.updateQualification(
            { doctor_id: doctorData.getDoctorId(), degree_id, year, college_id },
            id
          );
          newQualifications.push(parseInt(id));
        } else {
          const qualification = await qualificationService.addQualification({
            doctor_id: doctorData.getDoctorId(),
            degree_id,
            year,
            college_id
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
        const { number, registration_council_id, year, expiryDate: expiry_date, id = 0 } = item;
        if (id && id !== "0") {
          const registration = await registrationService.updateRegistration(
            { doctor_id: doctorData.getDoctorId(), number, year, registration_council_id, expiry_date },
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
      const doctorQualifications = await qualificationService.getQualificationsByDoctorId(updatedDoctorData.getDoctorId());
      for (const doctorQualification of doctorQualifications) {
        let upload_document_ids = [];
        const qualificationData = await QualificationWrapper(doctorQualification);
        doctor_qualification_ids.push(qualificationData.getDoctorQualificationId());

        const uploadDocuments = await documentService.getDoctorQualificationDocuments(
          DOCUMENT_PARENT_TYPE.DOCTOR_QUALIFICATION,
          qualificationData.getDoctorQualificationId()
        );


        for (const uploadDocument of uploadDocuments) {
          const uploadDocumentData = await UploadDocumentWrapper(uploadDocument);
          upload_document_ids.push(uploadDocumentData.getUploadDocumentId());
          uploadDocumentsData[uploadDocumentData.getUploadDocumentId()] = uploadDocumentData.getBasicInfo();
        }
        qualificationsData[qualificationData.getDoctorQualificationId()] = { ...qualificationData.getBasicInfo(), upload_document_ids };
      }

      let registrationsData = {};
      let doctor_registration_ids = [];
      const doctorRegistrations = await registrationService.getRegistrationByDoctorId(updatedDoctorData.getDoctorId());
      for (const doctorRegistration of doctorRegistrations) {
        let upload_document_ids = [];
        const registrationData = await RegistrationWrapper(doctorRegistration);

        const uploadDocuments = await documentService.getDoctorQualificationDocuments(
          DOCUMENT_PARENT_TYPE.DOCTOR_REGISTRATION,
          registrationData.getDoctorRegistrationId()
        );
        doctor_registration_ids.push(registrationData.getDoctorRegistrationId());

        for (const uploadDocument of uploadDocuments) {
          const uploadDocumentData = await UploadDocumentWrapper(uploadDocument);
          upload_document_ids.push(uploadDocumentData.getUploadDocumentId());
          uploadDocumentsData[uploadDocumentData.getUploadDocumentId()] = uploadDocumentData.getBasicInfo();
        }
        registrationsData[registrationData.getDoctorRegistrationId()] = { ...registrationData.getBasicInfo(), upload_document_ids };
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
          doctor_qualifications: {
            ...qualificationsData
          },
          doctor_Registrations: {
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

      const {mimetype} = file || {};
      const fileType = mimetype.split("/");
      Logger.debug("mimetype ------> ", mimetype);
      if(!ALLOWED_DOC_TYPE_DOCTORS.includes(fileType[1])) {
        return this.raiseClientError(res, 422, {}, "Only images and pdf documents are allowed")
      }

      let files = await uploadImageS3(userId, file);
      let qualification_id = 0;
      // let doctor = await doctorService.getDoctorByUserId(userId);

      return raiseSuccess(
        res,
        200,
        {
          files: files,
          // qualification_id
        },
        "Doctor qualification document uploaded successfully"
      );
    } catch (error) {
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
      const { degree_id = "", year = "", college_id = "", id, photos = [] } =
        qualification || {};

      let docQualification = {};

      if (photos.length > 3) {
        return this.raiseServerError(res, 422, {}, "Cannot add more than 3 documents");
      }

      if (id === "0") {
        docQualification = await qualificationService.addQualification({
          doctor_id: doctorData.getDoctorId(),
          degree_id,
          year,
          college_id
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
        const docQualificationUpdate = await qualificationService.updateQualification(
            {
              doctor_id: doctorData.getDoctorId(),
              degree_id,
              year,
              college_id
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

      const docQualificationDetails = await QualificationWrapper(docQualification);

      const updatedDoctor = await doctorService.getDoctorByData({ user_id: userId });
      const updatedDoctorData = await DoctorWrapper(updatedDoctor);

      let uploadDocumentsData = {};

      let qualificationsData = {};
      let doctor_qualification_ids = [];
      const doctorQualifications = await qualificationService.getQualificationsByDoctorId(updatedDoctorData.getDoctorId());

      Logger.debug("1893712983 doctorQualifications --> ", doctorQualifications);
      for (const doctorQualification of doctorQualifications) {
        let upload_document_ids = [];
        const qualificationData = await QualificationWrapper(doctorQualification);
        doctor_qualification_ids.push(qualificationData.getDoctorQualificationId());

        const uploadDocuments = await documentService.getDoctorQualificationDocuments(
          DOCUMENT_PARENT_TYPE.DOCTOR_QUALIFICATION,
          qualificationData.getDoctorQualificationId()
        );


        for (const uploadDocument of uploadDocuments) {
          const uploadDocumentData = await UploadDocumentWrapper(uploadDocument);
          upload_document_ids.push(uploadDocumentData.getUploadDocumentId());
          uploadDocumentsData[uploadDocumentData.getUploadDocumentId()] = uploadDocumentData.getBasicInfo();
        }
        qualificationsData[qualificationData.getDoctorQualificationId()] = { ...qualificationData.getBasicInfo(), upload_document_ids };
      }

      return raiseSuccess(
        res,
        200,
        {
          doctors: {
            [updatedDoctorData.getDoctorId()]: { ...updatedDoctorData.getBasicInfo(), doctor_qualification_ids }
          },
          ...await updatedDoctorData.getReferenceInfo(),
          doctor_qualifications: {
            ...qualificationsData
          },
          upload_documents: {
            ...uploadDocumentsData
          },
          qualification_id: docQualificationDetails.getDoctorQualificationId(),
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
          const { degree_id = "", year = "", college_id = "", id, photos = [] } =
            qualification || {};

          if (photos.length > 3) {
            return this.raiseServerError(res, 422, {}, "Cannot add more than 3 documents");
          }
          if (id === "0") {
            const docQualification = await qualificationService.addQualification(
              {
                doctor_id: doctorData.getDoctorId(),
                degree_id,
                year,
                college_id
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
        id,
        photos: registration_photos = []
      } = registration || {};

      let docRegistrationDetails = null;

      if (registration_photos.length > 3) {
        return this.raiseServerError(res, 422, {}, "Cannot add more than 3 documents");
      }

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

      const updatedDoctor = await doctorService.getDoctorByData({ user_id: userId });
      const updatedDoctorData = await DoctorWrapper(updatedDoctor);

      let uploadDocumentsData = {};

      let qualificationsData = {};
      let doctor_qualification_ids = [];
      const doctorQualifications = await qualificationService.getQualificationsByDoctorId(updatedDoctorData.getDoctorId());
      for (const doctorQualification of doctorQualifications) {
        let upload_document_ids = [];
        const qualificationData = await QualificationWrapper(doctorQualification);
        doctor_qualification_ids.push(qualificationData.getDoctorQualificationId());

        const uploadDocuments = await documentService.getDoctorQualificationDocuments(
          DOCUMENT_PARENT_TYPE.DOCTOR_QUALIFICATION,
          qualificationData.getDoctorQualificationId()
        );


        for (const uploadDocument of uploadDocuments) {
          const uploadDocumentData = await UploadDocumentWrapper(uploadDocument);
          upload_document_ids.push(uploadDocumentData.getUploadDocumentId());
          uploadDocumentsData[uploadDocumentData.getUploadDocumentId()] = uploadDocumentData.getBasicInfo();
        }
        qualificationsData[qualificationData.getDoctorQualificationId()] = { ...qualificationData.getBasicInfo(), upload_document_ids };
      }

      let registrationsData = {};
      let doctor_registration_ids = [];
      const doctorRegistrations = await registrationService.getRegistrationByDoctorId(updatedDoctorData.getDoctorId());
      for (const doctorRegistration of doctorRegistrations) {
        let upload_document_ids = [];
        const registrationData = await RegistrationWrapper(doctorRegistration);

        const uploadDocuments = await documentService.getDoctorQualificationDocuments(
          DOCUMENT_PARENT_TYPE.DOCTOR_REGISTRATION,
          registrationData.getDoctorRegistrationId()
        );
        doctor_registration_ids.push(registrationData.getDoctorRegistrationId());

        for (const uploadDocument of uploadDocuments) {
          const uploadDocumentData = await UploadDocumentWrapper(uploadDocument);
          upload_document_ids.push(uploadDocumentData.getUploadDocumentId());
          uploadDocumentsData[uploadDocumentData.getUploadDocumentId()] = uploadDocumentData.getBasicInfo();
        }
        registrationsData[registrationData.getDoctorRegistrationId()] = { ...registrationData.getBasicInfo(), upload_document_ids };
      }

      return raiseSuccess(
        res,
        200,
        {
          registration_id: docRegistrationDetails.getDoctorRegistrationId(),
          doctors: {
            [updatedDoctorData.getDoctorId()]: updatedDoctorData.getBasicInfo()
          },
          ...await updatedDoctorData.getReferenceInfo(),
          doctor_qualifications: {
            ...qualificationsData
          },
          doctor_Registrations: {
            ...registrationsData
          },
          upload_documents: {
            ...uploadDocumentsData
          },
          doctor_qualification_ids,
          doctor_registration_ids
        },
        "registration details updated successfully"
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
        const { name = "", location = "", time_slots = [] } = clinic;

        const details = {
          time_slots
        };

        const newClinic = await clinicService.addClinic({
          doctor_id: doctorData.getDoctorId(),
          name,
          location,
          details
        });

        const clinicData = await ClinicWrapper(newClinic);
        clinicDetails[clinicData.getDoctorClinicId()] = clinicData.getBasicInfo();
        doctor_clinic_ids.push(clinicData.getDoctorClinicId());
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
      const doctors = await doctorService.getDoctorByData({ user_id: userId });

      let doctorQualificationApiDetails = {};
      let doctorClinicApiDetails = {};
      let uploadDocumentApiDetails = {};
      let doctorRegistrationApiDetails = {};
      let doctor_qualification_ids = [];
      let doctor_registration_ids = [];
      let doctor_clinic_ids = [];
      let upload_document_ids = [];

      const doctorWrapper = await DoctorWrapper(doctors);

      Logger.debug("doctors ---> ", doctors);

      if(!doctors) {
        return this.raiseServerError(res, 422, {}, "Doctor details not updated");
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
      for(const degree of degrees) {
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
      for(const college of colleges) {
        const collegeWrapper = await CollegeWrapper(college);
        collegeData[collegeWrapper.getCollegeId()] = collegeWrapper.getBasicInfo();
      }

      const councils = await councilService.getAll();
      let councilData = {};
      for(const council of councils) {
        const councilWrapper = await CouncilWrapper(council);
        councilData[councilWrapper.getCouncilId()] = councilWrapper.getBasicInfo();
      }


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
              doctor_registration_ids,
            }
          },
          ...await doctorWrapper.getReferenceInfo(),
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
          },
          colleges: {
            ...collegeData,
          },
          degrees: {
            ...degreeData,
          },
          registration_councils: {
            ...councilData,
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
    const { raiseServerError, raiseSuccess } = this;
    try {
      const { clinics = [] } = req.body;
      const { userDetails: { userId } = {} } = req;

      const doctor = await doctorService.getDoctorByData({ user_id: userId });
      const doctorData = await DoctorWrapper(doctor);

      let clinicDetails = {};
      let doctor_clinic_ids = [];

      for (const clinic of clinics) {
        const { name = "", location = "", time_slots = {} } = clinic;

        const details = {
          time_slots
        };

        const newClinic = await clinicService.addClinic({
          doctor_id: doctorData.getDoctorId(),
          name,
          location,
          details
        });

        const clinicData = await ClinicWrapper(newClinic);
        clinicDetails[clinicData.getDoctorClinicId()] = clinicData.getBasicInfo();
        doctor_clinic_ids.push(clinicData.getDoctorClinicId());
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

}

export default new DoctorController();
