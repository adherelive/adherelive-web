import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PatientDetailsDrawer from "../../Components/Drawer/PatientDetails";
import {DRAWER} from "../../constant";
import {close} from "../../modules/drawer";

const mapStateToProps = state => {
  const {
    drawer: {
      visible,
      data: { type, payload = {} } = {}
    },
    patients,
    doctors,
    providers,
    treatments,
    medications,
    users,
    appointments
  } = state;
  return {
      visible: visible && type === DRAWER.PATIENT_DETAILS,
    patients,
    doctors,
    providers,
    treatments,
    medications,
    users,
    appointments,
      payload
  };
};

const mapDispatchToProps = dispatch => {
  return {
      close: () => dispatch(close()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PatientDetailsDrawer)
);
