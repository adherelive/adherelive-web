import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import DoctorConsultationFeeTable from "../../Components/DoctorConsultationFee/table";
import { authDoctorSelector } from "../../modules/doctors/selectors";
import {
  getDoctorPaymentProduct,
  deleteDoctorPaymentProduct,
} from "../../modules/doctors";
import { open } from "../../modules/drawer";
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
  } = state;

  const auth_doctor_id = authDoctorSelector(state);

  return {
    doctors: doctors[auth_doctor_id],
    payment_products,
    auth,
    users,
    // TODO: 'doctors' used again without parameters?
    //doctors,
    authPermissions,
    authenticated_user,
    authenticated_category,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getDoctorPaymentProduct: (data) => dispatch(getDoctorPaymentProduct(data)),
    openConsultationFeeDrawer: (payload) =>
      dispatch(open({ type: DRAWER.ADD_CONSULTATION_FEE, payload })),
    deleteDoctorPaymentProduct: (data) =>
      dispatch(deleteDoctorPaymentProduct(data)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DoctorConsultationFeeTable)
);
