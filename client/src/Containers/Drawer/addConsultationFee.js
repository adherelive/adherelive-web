import { connect } from "react-redux";
import AddConsultationFee from "../../Components/Drawer/addConsultationFee";
import { DRAWER } from "../../constant";
import { close } from "../../modules/drawer";
import {
  getAdminPaymentProduct,
  getDoctorPaymentProduct,
  addDoctorPaymentProduct,
} from "../../modules/doctors";
import { authDoctorSelector } from "../../modules/doctors/selectors";

// import { createReminder, updateReminder } from "../../modules/reminder"; // write to add to database
const mapStateToProps = (state) => {
  const {
    auth: { auth_role = null } = {},
    user_roles = {},
    drawer: { visible, loading, data: { type, payload = {} } = {} },
    doctors,
    users,
  } = state;

  const auth_doctor_id = authDoctorSelector(state);
  return {
    auth_role,
    user_roles,
    auth_doctor_id,
    visible: visible && type === DRAWER.ADD_CONSULTATION_FEE,
    loading,
    payload,
    doctors,
    users,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    close: () => dispatch(close()),
    getAdminPaymentProduct: () => dispatch(getAdminPaymentProduct()),
    getDoctorPaymentProduct: () => dispatch(getDoctorPaymentProduct()),
    addDoctorPaymentProduct: (data) => dispatch(addDoctorPaymentProduct(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddConsultationFee);
