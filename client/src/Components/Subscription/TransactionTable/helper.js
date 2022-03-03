import { USER_CATEGORY, TRANSACTION_STATUS } from "../../../constant";

export const getTransactionFilters = () => {
  return Object.keys(TRANSACTION_STATUS).map((key) => {
    return {
      text: TRANSACTION_STATUS[key],
      value: TRANSACTION_STATUS[key],
    };
  });
};

export const TABLE_COLUMN = {
  ID: {
    key: "ID",
    dataIndex: "ID",
    // fixed: "left",
    width: 150,
  },
  DOCTOR: {
    key: "DOCTOR",
    dataIndex: "DOCTOR",
    width: 200,
  },
  PATIENT: {
    key: "PATIENT",
    dataIndex: "PATIENT",
    width: 200,
  },
  // PAYMENT_PRODUCT: {
  //   key: "PAYMENT_PRODUCT",
  //   dataIndex: "PAYMENT_PRODUCT",
  // },
  SUBSCRIPTION: {
    key: "SUBSCRIPTION",
    dataIndex: "SUBSCRIPTION",
    width: 200,
  },
  DURATION: {
    key: "DURATION",
    dataIndex: "DURATION",
    width: 200,
  },
  AMOUNT: {
    key: "AMOUNT",
    dataIndex: "AMOUNT",
    width: 200,
  },
  STATUS: {
    key: "STATUS",
    dataIndex: "STATUS",
    onFilter: (value, record) => {
      // console.log("874657483294723463792",{record,value,recordStatus:record.STATUS});
      const { transactionData: { status = "" } = {} } = record.STATUS || {};
      return status === value;
    },
    width: 200,
  },
  DATE: {
    key: "DATE",
    dataIndex: "DATE",
    width: 200,
  },
  PAYMENT: {
    key: "PAYMENT",
    dataIndex: "PAYMENT",
    width: 200,
  },
};

// export const formatTransactionTableData = (data) => {
//   let {
//     id,
//     transactions,
//     patients,
//     doctors,
//     payment_products,
//     transaction_ids,
//     users,
//   } = data || {};

//   const transactionData = transactions[id] || {};
//   const {
//     requestor = {},
//     payee = {},
//     basic_info: { payment_product_id = null } = {},
//   } = transactions[id] || {};
//   let doctorId = null;

//   let patientId = null,
//     doctorData = {},
//     patientData = {};
//   const { id: requestor_id = null, category: requestor_cat = "" } = requestor;
//   const { id: payee_id = null, category: payee_cat = "" } = payee;

//   if (
//     requestor_cat === USER_CATEGORY.DOCTOR ||
//     requestor_cat === USER_CATEGORY.HSP
//   ) {
//     doctorId = requestor_id;
//     patientId = payee_id;
//   } else {
//     doctorId = payee_id;
//     patientId = requestor_id;
//   }

//   const { user_roles = {} } = data;
//   const { basic_info: { user_identity: request_user_id = null } = {} } =
//     user_roles[requestor_id];
//   const { basic_info: { user_identity: payee_user_id = null } = {} } =
//     user_roles[payee_id];

//   for (let each in doctors) {
//     const { basic_info: { user_id } = {} } = doctors[each];
//     if (user_id.toString() === request_user_id.toString()) {
//       doctorData = doctors[each];
//       break;
//     }
//   }

//   for (let each in patients) {
//     const { basic_info: { user_id } = {} } = patients[each];
//     if (user_id.toString() === payee_user_id.toString()) {
//       patientData = patients[each];
//       break;
//     }
//   }

//   const paymentProductData = payment_products[payment_product_id] || {};

//   return {
//     transactionData,
//     patientData,
//     paymentProductData,
//     doctorData,
//     transaction_ids,
//     users,
//   };
// };
