import BaseAccountDetails from "../../../services/accountDetails";
import accountDetailsService from "../../../services/accountDetails/accountDetails.service";

class AccountDetailsWrapper extends BaseAccountDetails {
  constructor(data) {
    super(data);
  }

  getBasicInfo = () => {
    const { _data } = this;
    const {
      id,
      user_id,
      customer_name,
      account_number,
      ifsc_code,
      account_type,
      account_mobile_number,
      in_use,
      razorpay_account_id,
      razorpay_account_name,
      activated_on,
      prefix,
      upi_id,
    } = _data || {};

    return {
      basic_info: {
        id,
        user_id,
        customer_name,
        account_number,
        ifsc_code,
        account_type,
        account_mobile_number,
        in_use,
        razorpay_account_id,
        razorpay_account_name,
        prefix,
        upi_id,
      },
      activated_on,
    };
  };
}

export default async (data = null, id = null) => {
  if (data) {
    return new AccountDetailsWrapper(data);
  }
  const accountDetails = await accountDetailsService.getByData({ id });
  return new AccountDetailsWrapper(accountDetails);
};
