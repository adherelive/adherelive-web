import { connect } from "react-redux";
import ProviderDoctorPaymentProduct from "../../../Components/Pages/providerDoctorPaymentProduct";
import { withRouter } from "react-router-dom";
import {
  getAdminPaymentProduct,
  getDoctorPaymentProduct,
  addDoctorPaymentProduct,
  deleteDoctorPaymentProduct,
} from "../../../modules/doctors";
import { open } from "../../../modules/drawer";
import { DRAWER } from "../../../constant";

const mapStateToProps = (state) => {
  const { users = {} } = state;

  return {
    users,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAdminPaymentProduct: () => dispatch(getAdminPaymentProduct()),
    getDoctorPaymentProduct: (data) => dispatch(getDoctorPaymentProduct(data)),
    addDoctorPaymentProduct: (data) => dispatch(addDoctorPaymentProduct(data)),
    openConsultationFeeDrawer: (payload) =>
      dispatch(open({ type: DRAWER.ADD_CONSULTATION_FEE, payload })),
    deleteDoctorPaymentProduct: (data) =>
      dispatch(deleteDoctorPaymentProduct(data)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ProviderDoctorPaymentProduct)
);
