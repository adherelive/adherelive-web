import { TABLE_COLUMN, formatTransactionTableData } from "../helper";
import { USER_CATEGORY } from "../../../../constant";

export default (data) => {
  const { id, authenticated_category } = data;

  return {
    key: id,
    [TABLE_COLUMN.ID.dataIndex]: {},
    [TABLE_COLUMN.DOCTOR.dataIndex]: {},
    [TABLE_COLUMN.PATIENT.dataIndex]: {},
    [TABLE_COLUMN.SUBSCRIPTION.dataIndex]: {},
    [TABLE_COLUMN.DURATION.dataIndex]: {},
    // [TABLE_COLUMN.PAYMENT_PRODUCT.dataIndex]: {},
    [TABLE_COLUMN.AMOUNT.dataIndex]: {},
    [TABLE_COLUMN.DATE.dataIndex]: {},
    [TABLE_COLUMN.STATUS.dataIndex]: {},
    [TABLE_COLUMN.PAYMENT.dataIndex]: {},
  };
};
