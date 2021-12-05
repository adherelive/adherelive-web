import isEmpty from "lodash/isEmpty";

export const getFormattedData = (data = {}) => {
  const {name, type, amount, id, razorpay_link = ""} = data;
  
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
  
  details.razorpay_link = razorpay_link;
  
  if (id) {
    details.id = id;
  }
  
  return details;
};
