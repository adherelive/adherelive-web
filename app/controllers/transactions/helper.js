import Logger from "../../../libs/log";

// services
import TransactionService from "../../services/transactions/transaction.service";
import PaymentProductService from "../../services/paymentProducts/paymentProduct.service";
import doctorService from "../../services/doctor/doctor.service";
import patientService from "../../services/patients/patients.service";

// wrappers
import TransactionWrapper from "../../ApiWrapper/web/transactions";
import PaymentProductWrapper from "../../ApiWrapper/web/paymentProducts";
import DoctorWrapper from "../../ApiWrapper/web/doctor";
import PatientWrapper from "../../ApiWrapper/web/patient";

// helpers
import {USER_CATEGORY} from "../../../constant";

const Log = new Logger("TRANSACTION > HELPER");

export const getProviderTransactions = async req => {
  try {
    const {
      userDetails: { userCategoryId } = {}
    } = req;
    const paymentProductService = new PaymentProductService();
    const transactionService = new TransactionService();

    // get all payment product created by provider
    const allPaymentProducts = await paymentProductService.getAllCreatorTypeProducts({
      creator_id: userCategoryId,
      creator_type: USER_CATEGORY.PROVIDER
    }) || [];

    let paymentProductIds = [];
    // let paymentProductData = {};

    let doctorIds = [];

    if(allPaymentProducts.length > 0) {
      for(let index = 0; index < allPaymentProducts.length; index++) {
        const paymentProduct = await PaymentProductWrapper({data: allPaymentProducts[index]});
        paymentProductIds.push(paymentProduct.getId());

        // get for_user data
        if(paymentProduct.getForUserType() === USER_CATEGORY.DOCTOR) {
          doctorIds.push(paymentProduct.getForUserId());
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

    let patientIds = [];

    if (allTransactions.length > 0) {
      for (let index = 0; index < allTransactions.length; index++) {
        const transaction = await TransactionWrapper({
          data: allTransactions[index]
        });
        const {
          transactions,
          payment_products,
          transaction_id,
        } = await transaction.getReferenceInfo();
        transactionData = { ...transactionData, ...transactions };
        transactionIds.push(transaction_id);
        paymentProductData = { ...paymentProductData, ...payment_products };

        if(transaction.getPayeeType() === USER_CATEGORY.PATIENT) {
          patientIds.push(transaction.getPayeeId());
        }
      }
    }

    // get all doctors
    const allDoctors = await doctorService.getAllDoctorByData({
      id: doctorIds
    }) || [];

    let doctorData = {};

    if(allDoctors.length > 0) {
      for(let index = 0; index < allDoctors.length; index++) {
        const doctor = await DoctorWrapper(allDoctors[index]);
        doctorData[doctor.getDoctorId()] = await doctor.getAllInfo();
      }
    }


    // get all patients
    const allPatients = await patientService.getPatientByData({
      id: patientIds
    }) || [];

    let patientData = {};

    if(allPatients.length > 0) {
      for(let index = 0; index < allPatients.length; index++) {
        const patient = await PatientWrapper(allPatients[index]);
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
        ...doctorData,
      },
      patients: {
        ...patientData,
      },
      transaction_ids: transactionIds,
    };
  } catch (error) {
      Log.debug("getProviderTransactions catch error", error);
      return null;
  }
};
