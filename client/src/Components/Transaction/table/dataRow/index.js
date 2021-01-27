import { TABLE_COLUMN, formatTransactionTableData } from "../helper";

export default data => {
  const { id } = data;
  const formattedData = formatTransactionTableData(data);
  const { 
    transactionData,
    patientData,
    paymentProductData,
    doctorData,
    transaction_ids,
    users
  } =
    formattedData || {};

  return {
    key: id,
    [TABLE_COLUMN.ID.dataIndex]: {
      transactionData
    },
    [TABLE_COLUMN.DOCTOR.dataIndex]: {
      doctorData,
      users
    },
    [TABLE_COLUMN.PATIENT.dataIndex]: {
      patientData
    },
    [TABLE_COLUMN.PAYMENT_PRODUCT.dataIndex]: {
      paymentProductData
    },
    [TABLE_COLUMN.AMOUNT.dataIndex]: {
        transactionData,transaction_ids
    },
    [TABLE_COLUMN.DATE.dataIndex]: {
      transactionData,transaction_ids
    },
    [TABLE_COLUMN.STATUS.dataIndex]: {
        transactionData,transaction_ids
    },
    
  };
};
