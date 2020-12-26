import isEmpty from "lodash/isEmpty";

export const getFormattedData = (data = {}) => {
  const { name, type, amount, id } = data;

  let details = {};

  if (!isEmpty(name)) {
    details.name = name;
  }

  if (!isEmpty(type)) {
    details.type = type;
  }

  if (!isEmpty(amount)) {
    details.amount = amount;
  }

  if (id) {
    details.id = id;
  }

  return details;
};
