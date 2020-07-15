import Controller from "../../";
import bcrypt from "bcrypt";
import userService from "../../../services/user/user.service";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

// services
import patientsService from "../../../services/patients/patients.service";
import doctorService from "../../../services/doctor/doctor.service";
import carePlanTemplateService from "../../../services/carePlanTemplate/carePlanTemplate.service";
import carePlanService from "../../../services/carePlan/carePlan.service";
import doctorQualificationService from "../../../services/doctorQualifications/doctorQualification.service";
import doctorRegistrationService from "../../../services/doctorRegistration/doctorRegistration.service";
import uploadDocumentService from "../../../services/uploadDocuments/uploadDocuments.service";

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

import Log from "../../../../libs/log";
import {
  DOCUMENT_PARENT_TYPE,
  ONBOARDING_STATUS,
  SIGN_IN_CATEGORY,
  USER_CATEGORY
} from "../../../../constant";
import { getFilePath } from "../../../helper/filePath";
import qualificationService from "../../../services/doctorQualifications/doctorQualification.service";
import documentService from "../../../services/uploadDocuments/uploadDocuments.service";
import registrationService from "../../../services/doctorRegistration/doctorRegistration.service";
import { uploadImageS3 } from "../user/userHelper";
import clinicService from "../../../services/doctorClinics/doctorClinics.service";
import DoctorQualificationWrapper from "../../../ApiWrapper/web/doctorQualification";
import DoctorRegistrationWrapper from "../../../ApiWrapper/web/doctorRegistration";
import doctorClinicService from "../../../services/doctorClinics/doctorClinics.service";
import DoctorClinicWrapper from "../../../ApiWrapper/web/doctorClinic";

const Logger = new Log("M-API DOCTOR CONTROLLER");

class MobileDoctorController extends Controller {
  constructor() {
    super();
  }

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

      const updatedDoctor = await doctorService.getDoctorByData({user_id: userId});
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
        onboarded: false,
        verified: true,
        activated_on: moment()
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

      const carePlanTemplateData = await CarePlanTemplateWrapper(
        carePlanTemplate
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
            [carePlanTemplateData.getCarePlanTemplateId()]: carePlanTemplateData.getBasicInfo()
          }
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
      const doctor = await doctorService.getDoctorByData({user_id});
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

        const updatedDoctor = await doctorService.getDoctorByData({user_id});
        const updatedDoctorData = await DoctorWrapper(updatedDoctor);

        let uploadDocumentsData = {};

        let qualificationsData = {};
        let doctor_qualification_ids = [];
        const doctorQualifications = await doctorQualificationService.getQualificationsByDoctorId(updatedDoctorData.getDoctorId());
        for(const doctorQualification of doctorQualifications) {
            let upload_document_ids = [];
            const qualificationData = await QualificationWrapper(doctorQualification);
            doctor_qualification_ids.push(qualificationData.getDoctorQualificationId());

            const uploadDocuments = await uploadDocumentService.getDoctorQualificationDocuments(
                DOCUMENT_PARENT_TYPE.DOCTOR_QUALIFICATION,
                qualificationData.getDoctorQualificationId()
            );


            for(const uploadDocument of uploadDocuments) {
                const uploadDocumentData = await UploadDocumentWrapper(uploadDocument);
                upload_document_ids.push(uploadDocumentData.getUploadDocumentId());
                uploadDocumentsData[uploadDocumentData.getUploadDocumentId()] = uploadDocumentData.getBasicInfo();
            }
            qualificationsData[qualificationData.getDoctorQualificationId()] = {...qualificationData.getBasicInfo(), upload_document_ids};
        }

        let registrationsData = {};
        let doctor_registration_ids = [];
        const doctorRegistrations = await doctorRegistrationService.getRegistrationByDoctorId(updatedDoctorData.getDoctorId());
        for(const doctorRegistration of doctorRegistrations) {
            let upload_document_ids = [];
            const registrationData = await RegistrationWrapper(doctorRegistration);

            const uploadDocuments = await uploadDocumentService.getDoctorQualificationDocuments(
                DOCUMENT_PARENT_TYPE.DOCTOR_REGISTRATION,
                registrationData.getDoctorRegistrationId()
            );
            doctor_registration_ids.push(registrationData.getDoctorRegistrationId());

            for(const uploadDocument of uploadDocuments) {
                const uploadDocumentData = await UploadDocumentWrapper(uploadDocument);
                upload_document_ids.push(uploadDocumentData.getUploadDocumentId());
                uploadDocumentsData[uploadDocumentData.getUploadDocumentId()] = uploadDocumentData.getBasicInfo();
            }
            registrationsData[registrationData.getDoctorRegistrationId()] = {...registrationData.getBasicInfo(), upload_document_ids};
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
        const {userDetails: {userId} = {}} = req;
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

      let doctor = await doctorService.getDoctorByData({user_id: userId});
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

      if (!id) {
        const docQualification = await qualificationService.addQualification({
          doctor_id: doctorData.getDoctorId(),
          degree,
          year,
          college
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

        const updatedDoctor = await doctorService.getDoctorByData({user_id: userId});
        const updatedDoctorData = await DoctorWrapper(updatedDoctor);

        let uploadDocumentsData = {};

        let qualificationsData = {};
        let doctor_qualification_ids = [];
        const doctorQualifications = await doctorQualificationService.getQualificationsByDoctorId(updatedDoctorData.getDoctorId());
        for(const doctorQualification of doctorQualifications) {
            let upload_document_ids = [];
            const qualificationData = await QualificationWrapper(doctorQualification);
            doctor_qualification_ids.push(qualificationData.getDoctorQualificationId());

            const uploadDocuments = await uploadDocumentService.getDoctorQualificationDocuments(
                DOCUMENT_PARENT_TYPE.DOCTOR_QUALIFICATION,
                qualificationData.getDoctorQualificationId()
            );


            for(const uploadDocument of uploadDocuments) {
                const uploadDocumentData = await UploadDocumentWrapper(uploadDocument);
                upload_document_ids.push(uploadDocumentData.getUploadDocumentId());
                uploadDocumentsData[uploadDocumentData.getUploadDocumentId()] = uploadDocumentData.getBasicInfo();
            }
            qualificationsData[qualificationData.getDoctorQualificationId()] = {...qualificationData.getBasicInfo(), upload_document_ids};
        }

      return raiseSuccess(
        res,
        200,
        {
          // qualification_id
          doctors: {
              [updatedDoctorData.getDoctorId()]: {...updatedDoctorData.getBasicInfo(), doctor_qualification_ids}
          },
          doctor_qualifications: {
              ...qualificationsData
          },
          upload_documents: {
              ...uploadDocumentsData
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
        speciality = "",
        qualifications = [],
        registration = {}
      } = body || {};

      const doctor = await doctorService.getDoctorByData({user_id: userId});
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
        council = "",
        year: registration_year = "",
        expiry_date = "",
        id = 0,
        photos: registration_photos = []
      } = registration || {};

      if (!id) {
        const docRegistration = await registrationService.addRegistration({
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
            council,
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

      const updatedDoctor = await doctorService.getDoctorByData({user_id: userId});
      const updatedDoctorData = await DoctorWrapper(updatedDoctor);

      let uploadDocumentsData = {};

      let qualificationsData = {};
      let doctor_qualification_ids = [];
      const doctorQualifications = await doctorQualificationService.getQualificationsByDoctorId(updatedDoctorData.getDoctorId());
      for(const doctorQualification of doctorQualifications) {
          let upload_document_ids = [];
          const qualificationData = await QualificationWrapper(doctorQualification);
          doctor_qualification_ids.push(qualificationData.getDoctorQualificationId());

          const uploadDocuments = await uploadDocumentService.getDoctorQualificationDocuments(
              DOCUMENT_PARENT_TYPE.DOCTOR_QUALIFICATION,
              qualificationData.getDoctorQualificationId()
          );


          for(const uploadDocument of uploadDocuments) {
              const uploadDocumentData = await UploadDocumentWrapper(uploadDocument);
              upload_document_ids.push(uploadDocumentData.getUploadDocumentId());
              uploadDocumentsData[uploadDocumentData.getUploadDocumentId()] = uploadDocumentData.getBasicInfo();
          }
          qualificationsData[qualificationData.getDoctorQualificationId()] = {...qualificationData.getBasicInfo(), upload_document_ids};
      }

        let registrationsData = {};
        let doctor_registration_ids = [];
        const doctorRegistrations = await doctorRegistrationService.getRegistrationByDoctorId(updatedDoctorData.getDoctorId());
        for(const doctorRegistration of doctorRegistrations) {
            let upload_document_ids = [];
            const registrationData = await RegistrationWrapper(doctorRegistration);

            const uploadDocuments = await uploadDocumentService.getDoctorQualificationDocuments(
                DOCUMENT_PARENT_TYPE.DOCTOR_REGISTRATION,
                registrationData.getDoctorRegistrationId()
            );
            doctor_registration_ids.push(registrationData.getDoctorRegistrationId());

            for(const uploadDocument of uploadDocuments) {
                const uploadDocumentData = await UploadDocumentWrapper(uploadDocument);
                upload_document_ids.push(uploadDocumentData.getUploadDocumentId());
                uploadDocumentsData[uploadDocumentData.getUploadDocumentId()] = uploadDocumentData.getBasicInfo();
            }
            registrationsData[registrationData.getDoctorRegistrationId()] = {...registrationData.getBasicInfo(), upload_document_ids};
        }

      return raiseSuccess(
        res,
        200,
        {
          // registration_id: registrationId
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

      const doctor = await doctorService.getDoctorByData({user_id: userId});
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

      for(const doctorQualification of doctorQualifications) {
        const doctorQualificationWrapper = await DoctorQualificationWrapper(
            doctorQualification
        );

        const qualificationDocuments = await uploadDocumentService.getDoctorQualificationDocuments(
            DOCUMENT_PARENT_TYPE.DOCTOR_QUALIFICATION,
            doctorQualificationWrapper.getDoctorQualificationId()
        );

        for(const document of qualificationDocuments) {
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

      for(const doctorRegistration of doctorRegistrations) {
        const doctorRegistrationWrapper = await DoctorRegistrationWrapper(
            doctorRegistration
        );

        const registrationDocuments = await uploadDocumentService.getDoctorQualificationDocuments(
            DOCUMENT_PARENT_TYPE.DOCTOR_REGISTRATION,
            doctorRegistrationWrapper.getDoctorRegistrationId()
        );

        for(const document of registrationDocuments) {
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

      for(const doctorClinic of doctorClinics) {
        const doctorClinicWrapper = await DoctorClinicWrapper(doctorClinic);
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
          "doctor details fetched successfully"
      );
    } catch (error) {
      Logger.debug("500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new MobileDoctorController();
