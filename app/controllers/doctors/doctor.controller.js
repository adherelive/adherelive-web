// import DoctorWrapper from "../../services/doctor/doctorHelper";

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

import { DOCUMENT_PARENT_TYPE, ONBOARDING_STATUS, SIGN_IN_CATEGORY, USER_CATEGORY } from "../../../constant";
import { getFilePath } from "../../helper/filePath";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { uploadImageS3 } from "../mControllers/user/userHelper";

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

      let password = process.config.DEFAULT_PASSWORD;
      const salt = await bcrypt.genSalt(Number(process.config.saltRounds));
      const hash = await bcrypt.hash(password, salt);
      console.log("17823812 USER_CATEGORY.PATIENT --> ", USER_CATEGORY.PATIENT);
      let user = await userService.addUser({
        prefix,
        mobile_number,
        password: hash,
        sign_in_type: SIGN_IN_CATEGORY.BASIC,
        category: USER_CATEGORY.PATIENT,
        onboarded: false
      });

      let newUserId = user.get("id");

      let patientName = name.split(" ");
      let first_name = patientName[0];
      let middle_name = patientName.length == 3 ? patientName[1] : "";
      let last_name =
        patientName.length == 3
          ? patientName[2]
          : patientName.length == 2
            ? patientName[1]
            : "";

      const uid = uuidv4();
      const birth_date = moment(date_of_birth);
      const age = moment().diff(birth_date, "y");
      const patient = await patientsService.addPatient({
        first_name,
        gender,
        middle_name,
        last_name,
        user_id: newUserId,
        birth_date,
        age,
        uid
      });

      const patientData = await PatientWrapper(patient);

      const doctor = await doctorService.getDoctorByData({ user_id: userId });
      const carePlanTemplate = await carePlanTemplateService.getCarePlanTemplateByData(
        treatment_id,
        severity_id,
        condition_id
      );



      const patient_id = patient.get("id");
      const care_plan_template_id = carePlanTemplate
        ? carePlanTemplate.get("id")
        : null;

      const details = care_plan_template_id
        ? {}
        : { treatment_id, severity_id, condition_id };

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

      Logger.debug(
        "medicineData",
        medicineData
      );

      for (const medicine of medicineData) {
        const medicineWrapper = await MedicineApiWrapper(medicine);
        medicineApiData[medicineWrapper.getMedicineId()] = medicineWrapper.getBasicInfo();
      }

      return this.raiseSuccess(
        res,
        200,
        {
          patient_ids: [patient_id],
          // carePlanId,
          care_plan_ids: [carePlanData.getCarePlanId()],
          care_plan_template_ids: [care_plan_template_id],
          patients: {
            [patientData.getPatientId()]: patientData.getBasicInfo()
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
          show: true,
        },
        "doctor's patient added successfully"
      );
    } catch (error) {
      console.log("ADD DOCTOR PATIENT ERROR ", error);
      return this.raiseServerError(res);
    }
  };

  updateDoctorQualificationRegistration = async (req, res) => {
    const { raiseServerError, raiseSuccess } = this;
    try {
      const {
        speciality = "",
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
          speciality
        },
        doctorData.getDoctorId()
      );
      const qualificationsOfDoctor = await qualificationService.getQualificationsByDoctorId(
        doctorData.getDoctorId()
      );

      let newQualifications = [];
      for (const item of qualification_details) {
        const {
          degree = "",
          year = "",
          college = "",
          photos = [],
          id = 0
        } = item;
        if (id && id !== "0") {
          const qualification = await qualificationService.updateQualification(
            { doctor_id: doctorData.getDoctorId(), degree, year, college },
            id
          );
          newQualifications.push(parseInt(id));
        } else {
          const qualification = await qualificationService.addQualification({
            doctor_id: doctorData.getDoctorId(),
            degree,
            year,
            college
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
        const { number, council, year, expiry_date, id = 0 } = item;
        if (id && id !== "0") {
          const registration = await registrationService.updateRegistration(
            { doctor_id: doctorData.getDoctorId(), number, year, council, expiry_date },
            id
          );
          newRegistrations.push(parseInt(id));
        } else {
          const registration = await registrationService.addRegistration({
            doctor_id: doctorData.getDoctorId(),
            number,
            year,
            council,
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
        "doctor qualification document uploaded successfully"
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
      const { gender = "", speciality = "", qualification = {} } = req.body;
      const { userDetails: { userId } = {} } = req;

      let doctor = await doctorService.getDoctorByData({ user_id: userId });
      const doctorData = await DoctorWrapper(doctor);

      if (gender && speciality) {
        const updatedDoctor = await doctorService.updateDoctor(
          {
            gender,
            speciality
          },
          doctorData.getDoctorId()
        );
      }
      const { degree = "", year = "", college = "", id = 0, photos = [] } =
        qualification || {};

      let docQualification = null;

      if (photos.length > 3) {
        return this.raiseServerError(res, 422, {}, "Cannot add more than 3 documents");
      }

      if (!id) {
        docQualification = await qualificationService.addQualification({
          doctor_id: doctorData.getDoctorId(),
          degree,
          year,
          college
        });

        for (const photo of photos) {
          const docExist = await documentService.getDocumentByData(
            DOCUMENT_PARENT_TYPE.DOCTOR_QUALIFICATION,
            id,
            photo
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
        docQualification = await qualificationService.getQualificationById(id);
        for (const photo of photos) {
          const docExist = await documentService.getDocumentByData(
            DOCUMENT_PARENT_TYPE.DOCTOR_QUALIFICATION,
            id,
            photo
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
        speciality = "",
        qualifications = [],
        registration = {}
      } = body || {};

      const doctor = await doctorService.getDoctorByData({ user_id: userId });
      const doctorData = await DoctorWrapper(doctor);

      if (gender && speciality) {
        const updatedDoctor = await doctorService.updateDoctor(
          { gender, speciality },
          doctorData.getDoctorId()
        );
      }

      if (qualifications.length > 0) {
        for (const qualification of qualifications) {
          const { degree = "", year = "", college = "", id = 0, photos = [] } =
            qualification || {};

          if (photos.length > 3) {
            return this.raiseServerError(res, 422, {}, "Cannot add more than 3 documents");
          }
          if (!id) {
            const docQualification = await qualificationService.addQualification(
              {
                doctor_id: doctorData.getDoctorId(),
                degree,
                year,
                college
              }
            );

            for (const photo of photos) {
              const docExist = await documentService.getDocumentByData(
                DOCUMENT_PARENT_TYPE.DOCTOR_QUALIFICATION,
                id,
                photo
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
                photo
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
        council = "",
        year: registration_year = "",
        expiry_date = "",
        id = 0,
        photos: registration_photos = []
      } = registration || {};

      let docRegistrationDetails = null;

      if (registration_photos.length > 3) {
        return this.raiseServerError(res, 422, {}, "Cannot add more than 3 documents");
      }

      if (!id) {

        const doctorRegistration = await registrationService.addRegistration({
          doctor_id: doctorData.getDoctorId(),
          number,
          council,
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
              parent_id: doctorRegistration.get("id"),
              document: getFilePath(photo)
            });
          }
        }

        docRegistrationDetails = await RegistrationWrapper(doctorRegistration.get());
      } else {
        const docRegistration = await registrationService.updateRegistration(
          {
            doctor_id: doctorData.getDoctorId(),
            number,
            council,
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
            photo
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

      Logger.debug("doctors ---> ", userId);

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
        "Doctor details fetched successfully"
      );
    } catch (error) {
      Logger.debug("500 error", error);
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
