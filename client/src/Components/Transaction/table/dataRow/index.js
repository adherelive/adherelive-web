import { TABLE_COLUMN, formatTransactionTableData } from "../helper";
import { USER_CATEGORY } from "../../../../constant";

export default (data) => {
  const { id, authenticated_category } = data;
  const formattedData = formatTransactionTableData(data);
  const {
    transactionData,
    patientData,
    paymentProductData,
    doctorData,
    transaction_ids,
    users,
  } = formattedData || {};

  if (authenticated_category === USER_CATEGORY.PROVIDER) {
    return {
      key: id,
      [TABLE_COLUMN.ID.dataIndex]: {
        transactionData,
      },
      [TABLE_COLUMN.DOCTOR.dataIndex]: {
        doctorData,
        users,
      },
      [TABLE_COLUMN.PATIENT.dataIndex]: {
        patientData,
      },
      [TABLE_COLUMN.PAYMENT_PRODUCT.dataIndex]: {
        paymentProductData,
      },
      [TABLE_COLUMN.AMOUNT.dataIndex]: {
        transactionData,
        transaction_ids,
      },
      [TABLE_COLUMN.DATE.dataIndex]: {
        transactionData,
        transaction_ids,
      },
      [TABLE_COLUMN.STATUS.dataIndex]: {
        transactionData,
        transaction_ids,
      },
    };
  } else if (
    authenticated_category === USER_CATEGORY.DOCTOR ||
    authenticated_category === USER_CATEGORY.HSP
  ) {
    return {
      key: id,
      [TABLE_COLUMN.ID.dataIndex]: {
        transactionData,
      },
      [TABLE_COLUMN.PATIENT.dataIndex]: {
        patientData,
      },
      [TABLE_COLUMN.PAYMENT_PRODUCT.dataIndex]: {
        paymentProductData,
      },
      [TABLE_COLUMN.AMOUNT.dataIndex]: {
        transactionData,
        transaction_ids,
      },
      [TABLE_COLUMN.DATE.dataIndex]: {
        transactionData,
        transaction_ids,
      },
      [TABLE_COLUMN.STATUS.dataIndex]: {
        transactionData,
        transaction_ids,
      },
    };
  }
};
