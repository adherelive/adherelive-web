import { connect } from "react-redux";
import AddConsultationFee from "../../Components/Drawer/addConsultationFee";
import { DRAWER } from "../../constant";
import { close } from "../../modules/drawer";
import {getAdminPaymentProduct,getDoctorPaymentProduct,addDoctorPaymentProduct} from "../../modules/doctors";


// import { createReminder, updateReminder } from "../../modules/reminder"; // write to add to database
const mapStateToProps = state => {
    
  const {
    drawer: { visible, loading, data: { type, payload = {} } = {} }
  } = state;

  

  return {
    visible: visible && type === DRAWER.ADD_CONSULTATION_FEE,
    loading,
    payload,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    close: () => dispatch(close()),
    getAdminPaymentProduct : () => dispatch(getAdminPaymentProduct()),
    getDoctorPaymentProduct : () => dispatch(getDoctorPaymentProduct()),
    addDoctorPaymentProduct : (data) => dispatch(addDoctorPaymentProduct(data)),
   
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddConsultationFee);
