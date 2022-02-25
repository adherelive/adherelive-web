import { connect } from "react-redux";
import editAccountDetailsDrawer from "../../Components/Drawer/editAccountDetails";
import {
  getAccountDetails,
  updateAccountDetails,
} from "../../modules/accountDetails";
import { addAccountDetails } from "../../modules/accountDetails";
import { DRAWER } from "../../constant";
import { close } from "../../modules/drawer";
import {
  getAdminPaymentProduct,
  getDoctorPaymentProduct,
  addDoctorPaymentProduct,
} from "../../modules/doctors";

// import { createReminder, updateReminder } from "../../modules/reminder"; // write to add to database
const mapStateToProps = (state) => {
  const {
    account_details,
    drawer: { visible, loading, data: { type, payload = {} } = {} },
  } = state;

  return {
    account_details,
    visible: visible && type === DRAWER.EDIT_RAZORPAY_ACCOUNT_DETAILS,
    loading,
    payload,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    close: () => dispatch(close()),
    getAccountDetails: (provider_id = null) =>
      dispatch(getAccountDetails(provider_id)),
    updateAccountDetails: (id, payload) =>
      dispatch(updateAccountDetails(id, payload)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(editAccountDetailsDrawer);
