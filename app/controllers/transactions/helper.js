import Logger from "../../../libs/log";

// services
import TransactionService from "../../services/transactions/transaction.service";
import PaymentProductService from "../../services/paymentProducts/paymentProduct.service";
import doctorService from "../../services/doctor/doctor.service";
import patientService from "../../services/patients/patients.service";
import userRolesService from "../../services/userRoles/userRoles.service";

// wrappers
import TransactionWrapper from "../../ApiWrapper/web/transactions";
import PaymentProductWrapper from "../../ApiWrapper/web/paymentProducts";
import DoctorWrapper from "../../ApiWrapper/web/doctor";
import PatientWrapper from "../../ApiWrapper/web/patient";
import UserRolesWrapper from "../../ApiWrapper/web/userRoles";

// helpers
import { USER_CATEGORY } from "../../../constant";

const Log = new Logger("TRANSACTION > HELPER");

export const getProviderTransactions = async req => {
  try {
    const { userDetails: { userRoleId } = {} } = req;
    const paymentProductService = new PaymentProductService();
    const transactionService = new TransactionService();

    // get all payment product created by provider
    const allPaymentProducts =
      (await paymentProductService.getAllCreatorTypeProducts({
        creator_role_id: userRoleId,
        creator_type: USER_CATEGORY.PROVIDER
      })) || [];

    let paymentProductIds = [],
      userRoleData = {};
    // let paymentProductData = {};

    let doctorIds = [];

    if (allPaymentProducts.length > 0) {
      for (let index = 0; index < allPaymentProducts.length; index++) {
        const paymentProduct = await PaymentProductWrapper({
          data: allPaymentProducts[index]
        });
        paymentProductIds.push(paymentProduct.getId());

        // get for_user data
        if (
          paymentProduct.getForUserType() === USER_CATEGORY.DOCTOR ||
          paymentProduct.getForUserType() === USER_CATEGORY.HSP
        ) {
          const roleId = paymentProduct.getForUserRoleId();
          const creatorRoleId = paymentProduct.getCreatorRoleId();

          const creatorRole = await userRolesService.getSingleUserRoleByData({
            id: creatorRoleId
          });
          if (creatorRole) {
            const creatorRoleData = await UserRolesWrapper(creatorRole);
            userRoleData = {
              ...userRoleData,
              ...{ [creatorRoleId]: creatorRoleData.getBasicInfo() }
            };
          }

          let doctor_user_id = null;
          const forUserRole = await userRolesService.getSingleUserRoleByData({
            id: roleId
          });
          if (forUserRole) {
            const forUserRoleData = await UserRolesWrapper(forUserRole);
            doctor_user_id = forUserRoleData.getUserId();
            userRoleData = {
              ...userRoleData,
              ...{ [roleId]: forUserRoleData.getBasicInfo() }
            };
          }
          const doctor =
            (await doctorService.findOne({
              where: { user_id: doctor_user_id },
              attributes: ["id"]
            })) || null;
          const { id: doctorId = null } = doctor || {};

          doctorIds.push(doctorId);
        }
      }
    }

    const allTransactions =
      (await transactionService.getAllByData({
        payment_product_id: paymentProductIds
      })) || [];

    let transactionData = {};
    let transactionIds = [];
    let paymentProductData = {};
    let userData = {};
    let doctorData = {};
    let patientData = {};

    let patientIds = [];

    if (allTransactions.length > 0) {
      for (let index = 0; index < allTransactions.length; index++) {
        const transaction = await TransactionWrapper({
          data: allTransactions[index]
        });
        const {
          transactions,
          payment_products,
          transaction_id
        } = await transaction.getReferenceInfo();
        transactionData = { ...transactionData, ...transactions };
        transactionIds.push(transaction_id);
        paymentProductData = { ...paymentProductData, ...payment_products };

        if (transaction.getPayeeType() === USER_CATEGORY.PATIENT) {
          const payeeRoleId = transaction.getPayeeId();
          let patient_user_id = null;
          const payeeRole = await userRolesService.getSingleUserRoleByData({
            id: payeeRoleId
          });
          if (payeeRole) {
            const payeeRoleData = await UserRolesWrapper(payeeRole);
            patient_user_id = payeeRoleData.getUserId();
            userRoleData = {
              ...userRoleData,
              ...{ [payeeRoleData.getId()]: payeeRoleData.getBasicInfo() }
            };
          }

          const requestorRole = await userRolesService.getSingleUserRoleByData({
            id: transaction.getRequestorId()
          });
          if (requestorRole) {
            const requestorRoleData = await UserRolesWrapper(requestorRole);
            userRoleData = {
              ...userRoleData,
              ...{
                [requestorRoleData.getId()]: requestorRoleData.getBasicInfo()
              }
            };
          }

          const patient = await patientService.getPatientByUserId(
            patient_user_id
          );
          const patientWrapper = await PatientWrapper(patient);
          patientIds.push(patientWrapper.getPatientId());
        }
      }
    }

    // get all doctors
    const allDoctors =
      (await doctorService.getAllDoctorByData({
        id: doctorIds
      })) || [];

    if (allDoctors.length > 0) {
      for (let index = 0; index < allDoctors.length; index++) {
        const doctor = await DoctorWrapper(allDoctors[index]);
        const { users, doctors } = await doctor.getReferenceInfo();
        doctorData = { ...doctorData, ...doctors };
        userData = { ...userData, ...users };
      }
    }

    // get all patients
    const allPatients =
      (await patientService.getPatientByData({
        id: patientIds
      })) || [];

    if (allPatients.length > 0) {
      for (let index = 0; index < allPatients.length; index++) {
        const patient = await PatientWrapper(allPatients[index]);
        const { users } = await patient.getReferenceInfo();
        userData = { ...userData, ...users };
        patientData[patient.getPatientId()] = await patient.getAllInfo();
      }
    }

    return {
      transactions: {
        ...transactionData
      },
      payment_products: {
        ...paymentProductData
      },
      doctors: {
        ...doctorData
      },
      patients: {
        ...patientData
      },
      users: {
        ...userData
      },
      user_roles: {
        ...userRoleData
      },
      transaction_ids: transactionIds
    };
  } catch (error) {
    Log.debug("getProviderTransactions catch error", error);
    return null;
  }
};

export const getDoctorTransactions = async req => {
  try {
    const { userDetails: { userCategoryId, userRoleId } = {} } = req;
    const paymentProductService = new PaymentProductService();
    const transactionService = new TransactionService();

    // get all payment product created by provider

    const allPaymentProducts =
      (await paymentProductService.getAllCreatorTypeProducts({
        creator_role_id: userRoleId,
        creator_type: [USER_CATEGORY.DOCTOR, USER_CATEGORY.HSP]
      })) || [];

    let userRoleData = {};
    let paymentProductIds = [];
    let doctorIds = [];

    if (allPaymentProducts.length > 0) {
      for (let index = 0; index < allPaymentProducts.length; index++) {
        const paymentProduct = await PaymentProductWrapper({
          data: allPaymentProducts[index]
        });
        paymentProductIds.push(paymentProduct.getId());

        // get for_user data
        if (
          paymentProduct.getForUserType() === USER_CATEGORY.DOCTOR ||
          paymentProduct.getForUserType() === USER_CATEGORY.HSP
        ) {
          const roleId = paymentProduct.getForUserRoleId();
          const creatorRoleId = paymentProduct.getCreatorRoleId();

          const creatorRole = await userRolesService.getSingleUserRoleByData({
            id: creatorRoleId
          });
          if (creatorRole) {
            const creatorRoleData = await UserRolesWrapper(creatorRole);
            userRoleData = {
              ...userRoleData,
              ...{ [creatorRoleId]: creatorRoleData.getBasicInfo() }
            };
          }

          let doctor_user_id = null;
          const forUserRole = await userRolesService.getSingleUserRoleByData({
            id: roleId
          });
          if (forUserRole) {
            const forUserRoleData = await UserRolesWrapper(forUserRole);
            doctor_user_id = forUserRoleData.getUserId();
            userRoleData = {
              ...userRoleData,
              ...{ [roleId]: forUserRoleData.getBasicInfo() }
            };
          }

          const doctor =
            (await doctorService.findOne({
              where: { user_id: doctor_user_id },
              attributes: ["id"]
            })) || null;
          const { id: doctorId = null } = doctor || {};

          doctorIds.push(doctorId);
        }
      }
    }

    const allTransactions =
      (await transactionService.getAllByData({
        payment_product_id: paymentProductIds
      })) || [];

    let transactionData = {};
    let transactionIds = [];
    let paymentProductData = {};
    let userData = {};
    let doctorData = {};
    let patientData = {};

    let patientIds = [];

    if (allTransactions.length > 0) {
      for (let index = 0; index < allTransactions.length; index++) {
        const transaction = await TransactionWrapper({
          data: allTransactions[index]
        });
        const {
          transactions,
          payment_products,
          transaction_id
        } = await transaction.getReferenceInfo();
        transactionData = { ...transactionData, ...transactions };
        transactionIds.push(transaction_id);
        paymentProductData = { ...paymentProductData, ...payment_products };

        if (transaction.getPayeeType() === USER_CATEGORY.PATIENT) {
          const payeeRoleId = transaction.getPayeeId();
          let patient_user_id = null;
          const payeeRole = await userRolesService.getSingleUserRoleByData({
            id: payeeRoleId
          });
          if (payeeRole) {
            const payeeRoleData = await UserRolesWrapper(payeeRole);
            patient_user_id = payeeRoleData.getUserId();
            userRoleData = {
              ...userRoleData,
              ...{ [payeeRoleData.getId()]: payeeRoleData.getBasicInfo() }
            };
          }

          const requestorRole = await userRolesService.getSingleUserRoleByData({
            id: transaction.getRequestorId()
          });
          if (requestorRole) {
            const requestorRoleData = await UserRolesWrapper(requestorRole);
            userRoleData = {
              ...userRoleData,
              ...{
                [requestorRoleData.getId()]: requestorRoleData.getBasicInfo()
              }
            };
          }

          const patient = await patientService.getPatientByUserId(
            patient_user_id
          );
          const patientWrapper = await PatientWrapper(patient);
          patientIds.push(patientWrapper.getPatientId());
        }
      }
    }

    // get all doctors
    const allDoctors =
      (await doctorService.getAllDoctorByData({
        id: doctorIds
      })) || [];

    if (allDoctors.length > 0) {
      for (let index = 0; index < allDoctors.length; index++) {
        const doctor = await DoctorWrapper(allDoctors[index]);
        const { users, doctors } = await doctor.getReferenceInfo();
        doctorData = { ...doctorData, ...doctors };
        userData = { ...userData, ...users };
      }
    }

    // get all patients
    const allPatients =
      (await patientService.getPatientByData({
        id: patientIds
      })) || [];

    if (allPatients.length > 0) {
      for (let index = 0; index < allPatients.length; index++) {
        const patient = await PatientWrapper(allPatients[index]);
        const { users } = await patient.getReferenceInfo();
        userData = { ...userData, ...users };
        patientData[patient.getPatientId()] = await patient.getAllInfo();
      }
    }

    return {
      transactions: {
        ...transactionData
      },
      payment_products: {
        ...paymentProductData
      },
      doctors: {
        ...doctorData
      },
      patients: {
        ...patientData
      },
      users: {
        ...userData
      },
      user_roles: {
        ...userRoleData
      },
      transaction_ids: transactionIds
    };
  } catch (error) {
    Log.debug("getDoctorTransactions catch error", error);
    return null;
  }
};
