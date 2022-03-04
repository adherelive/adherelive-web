import { connect } from "react-redux";
import DoctorSettingsPage from "../../../Components/Pages/doctorSettingsPage";
import { withRouter } from "react-router-dom";
import {
  getDoctorProfileDetails,
  getAdminPaymentProduct,
  getDoctorPaymentProduct,
  addDoctorPaymentProduct,
  deleteDoctorPaymentProduct,
} from "../../../modules/doctors";
import {
  addAccountDetails,
  getAccountDetails,
  deleteAccountDetails,
  updateAccountDetails,
} from "../../../modules/accountDetails";
import { open } from "../../../modules/drawer";
import { DRAWER } from "../../../constant";

const mapStateToProps = (state) => {
  const {
    auth,
    user_roles = {},
    users = {},
    doctors = {},
    auth: {
      authPermissions = [],
      authenticated_user = 1,
      authenticated_category,
    } = {},
    account_details = {},
  } = state;

  return {
    auth,
    users,
    doctors,
    authPermissions,
    authenticated_user,
    authenticated_category,
    account_details,
    user_roles,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getDoctorDetails: (id) => () => dispatch(getDoctorProfileDetails()),
    getAdminPaymentProduct: () => dispatch(getAdminPaymentProduct()),
    getDoctorPaymentProduct: () => dispatch(getDoctorPaymentProduct()),
    addDoctorPaymentProduct: (data) => dispatch(addDoctorPaymentProduct(data)),
    openConsultationFeeDrawer: (payload) =>
      dispatch(open({ type: DRAWER.ADD_CONSULTATION_FEE, payload })),
    deleteDoctorPaymentProduct: (data) =>
      dispatch(deleteDoctorPaymentProduct(data)),
    openRazorpayAccountDetailsDrawer: (payload) =>
      dispatch(open({ type: DRAWER.ADD_RAZORPAY_ACCOUNT_DETAILS })),
    openEditRazorpayAccountDetailsDrawer: (payload) =>
      dispatch(open({ type: DRAWER.EDIT_RAZORPAY_ACCOUNT_DETAILS })),
    addAccountDetails: (payload) => dispatch(addAccountDetails(payload)),
    getAccountDetails: (provider_id = null) =>
      dispatch(getAccountDetails(provider_id)),
    deleteAccountDetails: (id) => dispatch(deleteAccountDetails(id)),
    updateAccountDetails: (id, payload) =>
      dispatch(updateAccountDetails(id, payload)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DoctorSettingsPage)
);
