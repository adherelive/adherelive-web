import moment from "moment";

export const generateTransactionId = (id) => {
  return `TRA_${id}_${moment().format("x")}`;
};
