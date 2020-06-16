import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PatientDetailsDrawer from "../../Components/Drawer/PatientDetails";
import { DRAWER } from "../../constant";
import { close } from "../../modules/drawer";
import { getMedications } from "../../modules/medications";

const mapStateToProps = (state) => {
  const {
    drawer: { visible, data: { type, payload = {} } = {} },
    patients,
    doctors,
    providers,
    treatments,
    medications,
    users,
    appointments,
    medicines,
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
    payload,
    medicines,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    close: () => dispatch(close()),
    getMedications: (id) => dispatch(getMedications(id)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PatientDetailsDrawer)
);
