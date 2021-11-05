import { connect } from "react-redux";
import addAccountDetailsDrawer from "../../Components/Drawer/addAccountDetails";
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
    drawer: { visible, loading, data: { type, payload = {} } = {} },
  } = state;

  return {
    visible: visible && type === DRAWER.ADD_RAZORPAY_ACCOUNT_DETAILS,
    loading,
    payload,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    close: () => dispatch(close()),
    addAccountDetails: (data) => dispatch(addAccountDetails(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(addAccountDetailsDrawer);
