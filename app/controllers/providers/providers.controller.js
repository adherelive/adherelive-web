import Controller from "../index";
import Log from "../../../libs/log";
import moment from "moment";
import isEmpty from "lodash/isEmpty";

import userService from "../../services/user/user.service";
// import doctorService from "../../services/doctor/doctor.service";
import providerService from "../../services/provider/provider.service";
import doctorProviderMappingService from "../../services/doctorProviderMapping/doctorProviderMapping.service";
import qualificationService from "../../services/doctorQualifications/doctorQualification.service";
import clinicService from "../../services/doctorClinics/doctorClinics.service";
import documentService from "../../services/uploadDocuments/uploadDocuments.service";
import registrationService from "../../services/doctorRegistration/doctorRegistration.service";
import degreeService from "../../services/degree/degree.service";
import collegeService from "../../services/college/college.service";
import councilService from "../../services/council/council.service";
// import PaymentProductService from "../../services/paymentProducts/paymentProduct.service";
import appointmentService from "../../services/appointment/appointment.service";
import carePlanService from "../../services/carePlan/carePlan.service";
import userPreferenceService from "../../services/userPreferences/userPreference.service";
import UserRoleService from "../../services/userRoles/userRoles.service";
import DoctorService from "../../services/doctor/doctor.service";
import providerTermsMappingService from "../../services/providerTermsMapping/providerTermsMappings.service";
import tacService from "../../services/termsAndConditions/termsAndConditions.service";

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
// import PaymentProductWrapper from "../../ApiWrapper/web/paymentProducts";
import AppointmentWrapper from "../../ApiWrapper/web/appointments";
import PatientWrapper from "../../ApiWrapper/web/patient";
import CarePlanWrapper from "../../ApiWrapper/web/carePlan";
import UserRoleWrapper from "../../ApiWrapper/web/userRoles";

import TACWrapper from "../../ApiWrapper/web/termsAndConditions";
// import * as PaymentHelper from "../payments/helper";

// import bcrypt from "bcrypt";

import {
  DOCUMENT_PARENT_TYPE,
  EVENT_TYPE,
  SIGN_IN_CATEGORY,
  USER_CATEGORY,
  TERMS_AND_CONDITIONS_TYPES,
} from "../../../constant";
import ScheduleEventService from "../../services/scheduleEvents/scheduleEvent.service";
import { Sequelize } from "sequelize";
import bcrypt from "bcrypt";

// helper
import * as ProviderHelper from "./helper";
import accountDetailsService from "../../services/accountDetails/accountDetails.service";
import AccountsWrapper from "../../ApiWrapper/web/accountsDetails";
import { getFilePath } from "../../helper/filePath";

// import { generatePassword } from "../helper/passwordGenerator";

// import { USER_CATEGORY } from "../../../constant";

// import { Proxy_Sdk, EVENTS } from "../../proxySdk";

// import { v4 as uuidv4 } from "uuid";

const Logger = new Log("WEB > PROVIDERS > CONTROLLER");

const APPOINTMENT_QUERY_TYPE = {
  DAY: "d",
  MONTH: "m",
};

class ProvidersController extends Controller {
  constructor() {
    super();
  }

  getAll = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const { userDetails: { userId, userRoleId = null } = {} } = req;

      const providerData = await providerService.getProviderByData({
        user_id: userId,
      });
      const provider = await ProviderWrapper(providerData);
      const providerId = provider.getProviderId();

      let doctorIds = [];
      // const doctorProviderMapping = await doctorProviderMappingService.getDoctorProviderMappingByData(
      //   { provider_id: providerId }
      // );

      const UserRoles = await UserRoleService.getAllByData({
        linked_id: providerId,
        linked_with: USER_CATEGORY.PROVIDER,
      });

      if (UserRoles && UserRoles.length) {
        for (let i = 0; i < UserRoles.length; i++) {
          const UserRole = UserRoles[i];
          const userRoleWrapper = await UserRoleWrapper(UserRole);
          const DoctorUserId = await userRoleWrapper.getUserId();
          const doctor = await DoctorService.getDoctorByData({
            user_id: DoctorUserId,
          });
          if (doctor) {
            const doctorWrapper = await DoctorWrapper(doctor);
            const doctorId = await doctorWrapper.getDoctorId();
            doctorIds.push(doctorId);
          }
        }
      }

      // console.log("938479287498237948723984738472 ==================>>>>>>>",{doctorIds});

      // for (const mappingData of doctorProviderMapping) {
      //   const mappingWrapper = await DoctorProviderMappingWrapper(mappingData);
      //   const doctorId = mappingWrapper.getDoctorId();
      //   doctorIds.push(doctorId);
      // }

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

        const doctorQualifications =
          await qualificationService.getQualificationsByDoctorId(
            doctorWrapper.getDoctorId()
          );

        const userDetails = await userService.getUserById(
          doctorWrapper.getUserId()
        );
        const userWrapper = await UserWrapper(userDetails.get());

        userApiDetails[userWrapper.getId()] = { ...userWrapper.getBasicInfo() };

        await doctorQualifications.forEach(async (doctorQualification) => {
          const doctorQualificationWrapper = await QualificationWrapper(
            doctorQualification
          );

          const qualificationDocuments =
            await documentService.getDoctorQualificationDocuments(
              "doctor_qualification",
              doctorQualificationWrapper.getDoctorQualificationId()
            );

          await qualificationDocuments.forEach(async (document) => {
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
            upload_document_ids,
          };

          doctor_qualification_ids.push(
            doctorQualificationWrapper.getDoctorQualificationId()
          );

          degree_ids.push(doctorQualificationWrapper.getDegreeId());

          college_ids.push(doctorQualificationWrapper.getCollegeId());

          upload_document_ids = [];
        });

        // REGISTRATION DETAILS
        const doctorRegistrations =
          await registrationService.getRegistrationByDoctorId(
            doctorWrapper.getDoctorId()
          );

        Logger.debug("198361283 ---====> ", doctorRegistrations);

        await doctorRegistrations.forEach(async (doctorRegistration) => {
          const doctorRegistrationWrapper = await RegistrationWrapper(
            doctorRegistration
          );

          const registrationDocuments =
            await documentService.getDoctorQualificationDocuments(
              DOCUMENT_PARENT_TYPE.DOCTOR_REGISTRATION,
              doctorRegistrationWrapper.getDoctorRegistrationId()
            );

          await registrationDocuments.forEach(async (document) => {
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
            upload_document_ids,
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

        await doctorClinics.forEach(async (doctorClinic) => {
          const doctorClinicWrapper = await ClinicWrapper(doctorClinic);
          doctorClinicApiDetails[doctorClinicWrapper.getDoctorClinicId()] =
            doctorClinicWrapper.getBasicInfo();
          doctor_clinic_ids.push(doctorClinicWrapper.getDoctorClinicId());
        });

        const doctorCouncils = await councilService.getCouncilByData({
          id: registration_council_ids,
        });

        for (const doctorCouncil of doctorCouncils) {
          const council = await CouncilWrapper(doctorCouncil);
          councilApiDetails[council.getCouncilId()] = council.getBasicInfo();
        }

        const doctorDegrees = await degreeService.getDegreeByData({
          id: degree_ids,
        });

        for (const doctorDegree of doctorDegrees) {
          const degree = await DegreeWrapper(doctorDegree);
          degreeApiDetails[degree.getDegreeId()] = degree.getBasicInfo();
        }

        const doctorColleges = await collegeService.getCollegeByData({
          id: college_ids,
        });

        for (const doctorCollege of doctorColleges) {
          const college = await CollegeWrapper(doctorCollege);
          collegeApiDetails[college.getCollegeId()] = college.getBasicInfo();
        }

        doctorApiDetails[doctorWrapper.getDoctorId()] = {
          ...doctorWrapper.getBasicInfo(),
          doctor_qualification_ids,
          doctor_clinic_ids,
          doctor_registration_ids,
        };
      }

      return raiseSuccess(
        res,
        200,
        {
          users: {
            ...userApiDetails,
          },
          doctors: {
            ...doctorApiDetails,
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
          },
          colleges: {
            ...collegeApiDetails,
          },
          degrees: {
            ...degreeApiDetails,
          },
          registration_councils: {
            ...councilApiDetails,
          },
          specialities: {
            ...specialityDetails,
          },
          user_ids: userIds,
          doctor_ids: doctorIds,
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
      // const {
      //   userDetails: { userId } = {},
      //   body: { doctor_id = null } = {}
      // } = req;

      // const providerData = await providerService.getProviderByData({
      //   user_id: userId
      // });
      // const provider = await ProviderWrapper(providerData);
      // const providerId = provider.getProviderId();

      // const doctor = await doctorService.getDoctorByData({ id: doctor_id });

      // if (!doctor) {
      //   return raiseClientError(res, 401, {}, "Invalid doctor.");
      // }

      // const doctorWrapper = await DoctorWrapper(doctor);
      // const doctorUserId = doctorWrapper.getUserId();

      // const link = uuidv4();

      // const newPassword = generatePassword();
      // const salt = await bcrypt.genSalt(Number(process.config.saltRounds));
      // const hash = await bcrypt.hash(newPassword, salt);

      // const updateUser = await userService.updateUser(
      //   { password: hash,
      //     // system_generated_password: true
      //   },
      //   doctorUserId
      // );

      // const userDetails = await userService.getUserById(doctorUserId);
      // const userWrapper = await UserWrapper(userDetails.get());

      // // todo: update password for new user.

      // const userEmail = userWrapper.getEmail();

      // const emailPayload = {
      //   title: "Verification mail",
      //   toAddress: userEmail,
      //   templateName: EMAIL_TEMPLATE_NAME.WELCOME,
      //   templateData: {
      //     title: "Doctor",
      //     link: process.config.WEB_URL + process.config.app.invite_link + link,
      //     inviteCard: "",
      //     mainBodyText: `We are really happy that you chose us. Your temporary password is ${newPassword}.`,
      //     subBodyText: "Please verify your account",
      //     buttonText: "Verify",
      //     host: process.config.WEB_URL,
      //     contactTo: "customersupport@adhere.live"
      //   }
      // };

      // Proxy_Sdk.execute(EVENTS.SEND_EMAIL, emailPayload);

      return raiseSuccess(res, 200, {}, "Password mailed successfully.");
    } catch (error) {
      Logger.debug("mailPassword 500 error ", error);
      return raiseServerError(res);
    }
  };

  getAppointmentForDoctors = async (req, res) => {
    const { raiseSuccess, raiseServerError, raiseClientError } = this;
    try {
      const {
        userDetails: { userId } = {},
        query: { type = APPOINTMENT_QUERY_TYPE.DAY, value = null } = {},
      } = req;

      const validDate = moment(value).isValid();
      if (!validDate) {
        return raiseClientError(
          res,
          402,
          {},
          "Please enter the correct date value"
        );
      }

      const providerData = await providerService.getProviderByData({
        user_id: userId,
      });
      const provider = await ProviderWrapper(providerData);
      const providerId = provider.getProviderId();

      let userApiDetails = {};
      let doctorApiDetails = {};
      let patientsApiDetails = {};
      let appointmentApiDetails = {};
      let dateWiseAppointmentDetails = {};

      let patientIds = [];
      let doctorIds = [];

      const UserRoles = await UserRoleService.getAllByData({
        linked_id: providerId,
        linked_with: USER_CATEGORY.PROVIDER,
      });

      if (UserRoles && UserRoles.length) {
        for (let i = 0; i < UserRoles.length; i++) {
          const UserRole = UserRoles[i];
          const userRoleWrapper = await UserRoleWrapper(UserRole);
          const DoctorUserId = await userRoleWrapper.getUserId();
          const doctor = await DoctorService.getDoctorByData({
            user_id: DoctorUserId,
          });
          if (doctor) {
            const doctorWrapper = await DoctorWrapper(doctor);
            const doctorId = await doctorWrapper.getDoctorId();
            doctorIds.push(doctorId);
          }
        }
      }

      for (const doctorId of doctorIds) {
        let appointmentList = [];

        switch (type) {
          case APPOINTMENT_QUERY_TYPE.DAY:
            appointmentList =
              await appointmentService.getDayAppointmentForDoctor(
                doctorId,
                value
              );
            break;
          case APPOINTMENT_QUERY_TYPE.MONTH:
            appointmentList =
              await appointmentService.getMonthAppointmentForDoctor(
                doctorId,
                value
              );
            break;
          default:
            return raiseClientError(
              res,
              422,
              {},
              "Please check selected value for getting upcoming schedules"
            );
        }

        if (appointmentList && appointmentList.length) {
          for (const appointment of appointmentList) {
            const appointmentData = await AppointmentWrapper(appointment);
            const { participant_one_id, participant_two_id } =
              appointmentData.getParticipants();

            const {
              [appointmentData.getFormattedStartDate()]:
                dateAppointments = null,
            } = dateWiseAppointmentDetails;

            if (dateAppointments) {
              dateWiseAppointmentDetails[
                appointmentData.getFormattedStartDate()
              ].push(appointmentData.getAppointmentId());
            } else {
              dateWiseAppointmentDetails[
                appointmentData.getFormattedStartDate()
              ] = [appointmentData.getAppointmentId()];
            }

            appointmentApiDetails[appointmentData.getAppointmentId()] =
              appointmentData.getBasicInfo();

            if (participant_one_id !== doctorId) {
              patientIds.push(participant_one_id);
            } else {
              patientIds.push(participant_two_id);
            }
          }
        }
      }

      for (const patientId of patientIds) {
        const patientData = await PatientWrapper(null, patientId);
        const patientUserId = patientData.getUserId();
        const patientUserData = await UserWrapper(null, patientUserId);

        userApiDetails[patientUserId] = patientUserData.getBasicInfo();
        patientsApiDetails[patientId] = patientData.getBasicInfo();
      }

      return raiseSuccess(
        res,
        200,
        {
          users: { ...userApiDetails },
          doctors: { ...doctorApiDetails },
          date_wise_appointments: { ...dateWiseAppointmentDetails },
          patients: { ...patientsApiDetails },
          appointments: { ...appointmentApiDetails },
        },
        "Appointments data fetched successfully."
      );
    } catch (error) {
      Logger.debug("getAllAppointmentForDoctors 500 error ", error);
      return raiseServerError(res);
    }
  };

  getMonthAppointmentCountForDoctors = async (req, res) => {
    const { raiseSuccess, raiseServerError, raiseClientError } = this;
    try {
      const { userDetails: { userId } = {}, query: { date = null } = {} } = req;

      try {
        const validDate = moment(date).isValid();
        if (!validDate) {
          return raiseClientError(res, 402, {}, "Invalid date.");
        }
      } catch {
        return raiseClientError(res, 402, {}, "Invalid date.");
      }

      const providerData = await providerService.getProviderByData({
        user_id: userId,
      });
      const provider = await ProviderWrapper(providerData);
      const providerId = provider.getProviderId();

      let dateWiseAppointmentDetails = {};

      let doctorIds = [];

      const UserRoles = await UserRoleService.getAllByData({
        linked_id: providerId,
        linked_with: USER_CATEGORY.PROVIDER,
      });

      if (UserRoles && UserRoles.length) {
        for (let i = 0; i < UserRoles.length; i++) {
          const UserRole = UserRoles[i];
          const userRoleWrapper = await UserRoleWrapper(UserRole);
          const DoctorUserId = await userRoleWrapper.getUserId();
          const doctor = await DoctorService.getDoctorByData({
            user_id: DoctorUserId,
          });
          if (doctor) {
            const doctorWrapper = await DoctorWrapper(doctor);
            const doctorId = await doctorWrapper.getDoctorId();
            doctorIds.push(doctorId);
          }
        }
      }

      for (const doctorId of doctorIds) {
        const appointmentList =
          await appointmentService.getMonthAppointmentCountForDoctor(
            doctorId,
            date
          );

        if (appointmentList && appointmentList.length) {
          for (const appointment of appointmentList) {
            const start_date = appointment.get("start_date");
            const count = appointment.get("count");

            dateWiseAppointmentDetails[start_date] = count;
          }
        }
      }

      return raiseSuccess(
        res,
        200,
        {
          date_wise_appointments: { ...dateWiseAppointmentDetails },
        },
        "Appointments data fetched successfully."
      );
    } catch (error) {
      Logger.debug("getAllAppointmentForDoctors 500 error ", error);
      return raiseServerError(res);
    }
  };

  getPatientEvents = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      /*
       *
       * query params:
       * type: EVENT_TYPE
       * from: START_DATE
       * to: END_DATE
       *
       * */
      const {
        query: { type, from, to } = {},
        userDetails: { userCategoryId } = {},
      } = req;

      // instantiate services
      const eventService = new ScheduleEventService();

      if (isEmpty(type) || isEmpty(from) || isEmpty(to)) {
        return raiseClientError(res, 422, {}, "please check details entered");
      }

      // doctors for provider
      const doctors =
        (await doctorProviderMappingService.getAllDoctorIds(userCategoryId)) ||
        [];

      let doctorIds = [];
      doctors.forEach((doctor) => {
        const { doctor_id } = doctor || {};
        doctorIds.push(doctor_id);
      });

      const carePlans =
        (await carePlanService.getMultipleCarePlanByData({
          doctor_id: doctorIds,
          expired_on: null,
        })) || [];

      Logger.debug("carePlans", carePlans);

      for (let i = 0; i < carePlans.length; i++) {
        const carePlan = await CarePlanWrapper(carePlans[i]);
        const { care_plans, patients, care_plan_id, patient_id } =
          await carePlan.getReferenceInfo();

        const { appointment_id, medication_id, vital_id } =
          care_plans[care_plan_id] || {};

        const events = await eventService.getAllEventByData({
          [Sequelize.Op.or]: [
            {
              event_id: appointment_id,
              event_type: EVENT_TYPE.APPOINTMENT,
            },
            {
              event_id: medication_id,
              event_type: EVENT_TYPE.MEDICATION_REMINDER,
            },
            {
              event_id: vital_id,
              event_type: EVENT_TYPE.VITALS,
            },
          ],
        });

        /*
         *
         * todo: format patients :: schedule_events
         *  USE SORT IF NECESSARY
         *
         * */
      }
    } catch (error) {
      Logger.debug("getPatientEvents 500 error ", error);
      return raiseServerError(res);
    }
  };

  getAllProviders = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { userDetails: { userData: { category } = {} } = {} } = req;
      if (category !== USER_CATEGORY.ADMIN) {
        return raiseClientError(res, 401, {}, "Unauthorized");
      }

      const allProviders = (await providerService.getAllProviders()) || [];

      let providerData = {};
      let userData = {};
      let providerIds = [];
      let userIds = [];
      for (let index = 0; index < allProviders.length; index++) {
        const provider = await ProviderWrapper(allProviders[index]);
        const { providers, users, user_id, provider_id } =
          await provider.getReferenceInfo();
        providerData = { ...providerData, ...providers };
        userData = { ...userData, ...users };
        userIds.push(user_id);
        providerIds.push(provider_id);
      }

      // provider accounts
      let providerAccountsData = {};
      const allAccounts =
        (await accountDetailsService.getAllAccountsForUser(userIds)) || [];

      if (allAccounts.length > 0) {
        for (let index = 0; index < allAccounts.length; index++) {
          const account = await AccountsWrapper(allAccounts[index]);
          providerAccountsData[account.getId()] = account.getBasicInfo();
        }
      }

      return raiseSuccess(
        res,
        200,
        {
          providers: {
            ...providerData,
          },
          users: {
            ...userData,
          },
          account_details: {
            ...providerAccountsData,
          },
          provider_ids: providerIds,
        },
        "Providers fetched successfully"
      );
    } catch (error) {
      Logger.debug("getAllProviders 500 error ", error);
      return raiseServerError(res);
    }
  };

  addProvider = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const {
        body: {
          email,
          password,
          name,
          prefix,
          mobile_number,
          address,

          // ui details
          icon,
          banner,

          // account details
          account_type,
          customer_name,
          account_number,
          ifsc_code,
          use_as_main = false,
          upi_id,

          // razorpay accounts
          razorpay_account_id,
          razorpay_account_name,

          // prescription details
          prescription_details,
        } = {},
      } = req;

      const providerExists =
        (await userService.getUserData({
          email,
          category: USER_CATEGORY.PROVIDER,
        })) || null;

      Logger.debug("providerExists --> ", providerExists);

      if (providerExists) {
        return raiseClientError(
          res,
          422,
          {},
          "Provider already exists for the email"
        );
      }

      const activated_on = moment().utc().toISOString();

      // create user
      const salt = await bcrypt.genSalt(Number(process.config.saltRounds));
      const hash = await bcrypt.hash(password, salt);

      const user = await userService.addUser({
        email,
        prefix,
        mobile_number,
        activated_on,
        password: hash,
        category: USER_CATEGORY.PROVIDER,
        sign_in_type: SIGN_IN_CATEGORY.BASIC,
        onboarded: true,
        verified: true,
      });

      const userData = await UserWrapper(user.get());

      const providerUserId = await userData.getId();
      const userRole = await UserRoleService.create({
        user_identity: providerUserId,
      });
      const userRoleWrapper = await UserRoleWrapper(userRole);
      const newUserRoleId = await userRoleWrapper.getId();

      // add user preference
      await userPreferenceService.addUserPreference({
        user_id: userData.getId(),
        details: {
          charts: ["1", "2", "3"],
        },
        user_role_id: newUserRoleId,
      });

      // create provider
      const provider = await providerService.addProvider({
        name,
        address,
        activated_on,
        // TODO: These are duplicate and not required anymore?
        //details: {
        //icon: getFilePath(icon),
        //banner: getFilePath(banner)
        //},
        user_id: userData.getId(),
        details: {
          icon: getFilePath(icon),
          banner: getFilePath(banner),
          prescription_details,
        },
      });
      const providerData = await ProviderWrapper(provider);

      // crate provider temrs mapping record

      const tacId = await tacService.getByData({
        terms_type: TERMS_AND_CONDITIONS_TYPES.DEFAULT_TERMS_OF_PAYMENT,
      });

      const tacData = await TACWrapper(tacId);

      const providerTermsMapping = await providerTermsMappingService.create({
        provider_id: providerData.getProviderId(),
        terms_and_conditions_id: tacData.getId(),
      });

      // add provider account
      let providerAccountData = {};

      // check for valid account details to be added
      if (account_type) {
        const accountData = ProviderHelper.validateAccountData({
          account_type,
          account_number,
          customer_name,
          ifsc_code,
          use_as_main,
          upi_id,
          razorpay_account_id,
          razorpay_account_name,
          prefix,
          account_mobile_number: mobile_number,
        });

        if (Object.keys(accountData).length > 0) {
          const accountDetails = await accountDetailsService.addAccountDetails({
            ...accountData,
            user_id: userData.getId(),
          });

          const providerAccount = await AccountsWrapper(accountDetails);
          providerAccountData[providerAccount.getId()] =
            providerAccount.getBasicInfo();
        }
      }

      return raiseSuccess(
        res,
        200,
        {
          providers: {
            [providerData.getProviderId()]: providerData.getBasicInfo(),
          },
          users: {
            [userData.getId()]: userData.getBasicInfo(),
          },
          account_details: {
            ...providerAccountData,
          },
        },
        "Provider added successfully"
      );
    } catch (error) {
      Logger.debug("addProvider 500 error ", error);
      return raiseServerError(res);
    }
  };

  updateProvider = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      Logger.info(`provider id : ${req.params.id}`);
      const { params: { id } = {}, body = {} } = req;
      const {
        email,
        name,
        prefix,
        mobile_number,
        address,

        // customizations
        icon,
        banner,

        // account details
        account_type,
        customer_name,
        account_number,
        ifsc_code,
        upi_id,
        use_as_main,

        // razorpay accounts
        razorpay_account_id,
        razorpay_account_name,

        // prescription details
        prescription_details,
      } = body || {};

      const existingProvider =
        (await providerService.getProviderByData({
          id,
        })) || null;

      if (!existingProvider) {
        return raiseClientError(res, 422, {}, "Provider does not exists");
      }

      const previousProvider = await ProviderWrapper(existingProvider);

      // update user
      const salt = await bcrypt.genSalt(Number(process.config.saltRounds));

      await userService.updateUser(
        {
          email,
          prefix,
          mobile_number,
        },
        previousProvider.getUserId()
      );

      // update provider
      await providerService.updateProvider(
        {
          name,
          address,
          details: {
            ...previousProvider.getDetails(),
            icon: getFilePath(icon),
            banner: getFilePath(banner),
            prescription_details,
          },
        },
        id
      );

      const updatedProvider = await ProviderWrapper(null, id);

      // update account
      const previousAccount =
        (await accountDetailsService.getByData({
          user_id: previousProvider.getUserId(),
        })) || null;

      let updatedAccountData = {};

      if (previousAccount) {
        const account = await AccountsWrapper(previousAccount);

        const accountData = ProviderHelper.validateAccountData({
          account_type,
          account_number,
          customer_name,
          ifsc_code,
          upi_id,
          razorpay_account_id,
          razorpay_account_name,
          prefix,
          account_mobile_number: mobile_number,
        });

        await accountDetailsService.update(accountData, account.getId());

        const updatedAccount = await AccountsWrapper(null, account.getId());
        updatedAccountData[updatedAccount.getId()] =
          updatedAccount.getBasicInfo();

        Logger.debug("783453267478657894235236476289347523846923", {
          account_details: {
            ...updatedAccountData,
          },
          updatedAccount,
        });
      } else {
        // check for valid account details to be added
        if (account_type) {
          const accountData = ProviderHelper.validateAccountData({
            account_type,
            account_number,
            customer_name,
            ifsc_code,
            use_as_main,
            upi_id,
            razorpay_account_id,
            razorpay_account_name,
            prefix,
            account_mobile_number: mobile_number,
          });

          if (Object.keys(accountData).length > 0) {
            const accountDetails =
              await accountDetailsService.addAccountDetails({
                ...accountData,
                user_id: updatedProvider.getUserId(),
              });

            const providerAccount = await AccountsWrapper(accountDetails);
            updatedAccountData[providerAccount.getId()] =
              providerAccount.getBasicInfo();
          }
        }
      }

      return raiseSuccess(
        res,
        200,
        {
          ...(await updatedProvider.getReferenceInfo()),
          account_details: {
            ...updatedAccountData,
          },
        },
        "Provider updated successfully"
      );
    } catch (error) {
      Logger.debug("updateProvider 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new ProvidersController();
