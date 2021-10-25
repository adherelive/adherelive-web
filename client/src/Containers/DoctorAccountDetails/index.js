import { connect } from "react-redux";
import DoctorAccountDetails from "../../Components/DoctorAccountDetails";
import { withRouter } from "react-router-dom";
import {
  addAccountDetails,
  getAccountDetails,
  deleteAccountDetails,
  updateAccountDetails,
} from "../../modules/accountDetails";
import { open } from "../../modules/drawer";
import { authDoctorSelector } from "../../modules/doctors/selectors";
import { DRAWER } from "../../constant";

const mapStateToProps = (state) => {
  const {
    doctors = {},
    auth = {},
    users = {},
    payment_products = {},
    auth: {
      authPermissions = [],
      authenticated_user = 1,
      authenticated_category,
    } = {},
    account_details = {},
    user_roles = {},
  } = state;

  const auth_doctor_id = authDoctorSelector(state);

  return {
    doctors: doctors[auth_doctor_id],
    payment_products,
    auth,
    users,
    // TODO: 'doctors' used again without parameters?
    // doctors,
    authPermissions,
    authenticated_user,
    authenticated_category,
    account_details,
    user_roles,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    openRazorpayAccountDetailsDrawer: (payload) =>
      dispatch(open({ type: DRAWER.ADD_RAZORPAY_ACCOUNT_DETAILS })),
    openEditRazorpayAccountDetailsDrawer: (payload) =>
      dispatch(open({ type: DRAWER.EDIT_RAZORPAY_ACCOUNT_DETAILS, payload })),
    addAccountDetails: (payload) => dispatch(addAccountDetails(payload)),
    getAccountDetails: (provider_id = null) =>
      dispatch(getAccountDetails(provider_id)),
    deleteAccountDetails: (id) => dispatch(deleteAccountDetails(id)),
    updateAccountDetails: (id, payload) =>
      dispatch(updateAccountDetails(id, payload)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DoctorAccountDetails)
);
