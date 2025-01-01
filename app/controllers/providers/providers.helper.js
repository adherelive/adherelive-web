import Controller from "../index";

import { isEmpty } from "lodash";

export const validateAccountData = ({
  account_number,
  account_type,
  customer_name,
  ifsc_code,
  use_as_main,
  upi_id,
  razorpay_account_id,
  razorpay_account_name,
  prefix,
  account_mobile_number,
}) => {
  let data = {};

  if (!isEmpty(account_number)) {
    data["account_number"] = account_number;
  }

  if (!isEmpty(account_type)) {
    data["account_type"] = account_type;
  }

  if (!isEmpty(customer_name)) {
    data["customer_name"] = customer_name;
  }

  if (!isEmpty(ifsc_code)) {
    data["ifsc_code"] = ifsc_code;
  }

  if (!isEmpty(use_as_main)) {
    data["use_as_main"] = use_as_main;
  }

  if (!isEmpty(upi_id)) {
    data["upi_id"] = upi_id;
  }

  // razorpay account
  if (!isEmpty(razorpay_account_id)) {
    data["razorpay_account_id"] = razorpay_account_id;
  }

  if (!isEmpty(razorpay_account_name)) {
    data["razorpay_account_name"] = razorpay_account_name;
  }

  if (prefix) {
    data["prefix"] = prefix;
  }

  if (account_mobile_number) {
    data["account_mobile_number"] = account_mobile_number;
  }

  return data;
};
