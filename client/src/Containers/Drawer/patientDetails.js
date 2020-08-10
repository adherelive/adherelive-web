import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PatientDetailsDrawer from "../../Components/Drawer/PatientDetails";
import { DRAWER } from "../../constant";
import { close } from "../../modules/drawer";
import { getMedications } from "../../modules/medications";
import { setPatientForChat } from "../../modules/twilio";

const mapStateToProps = (state) => {
  const {
    drawer: { visible, data: { type, payload = {} } = {} },
    patients,
    doctors,
    providers,
    treatments,
    conditions,
    severity,
    medications,
    users,
    appointments,
    care_plans,
    medicines,
  } = state;
  return {
    visible: visible && type === DRAWER.PATIENT_DETAILS,
    patients,
    doctors,
    providers,
    treatments,
    conditions,
    severity,
    medications,
    users,
    care_plans,
    appointments,
    payload,
    medicines,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    close: () => dispatch(close()),
    getMedications: (id) => dispatch(getMedications(id)),
    setPatientForChat:(patient_id) => dispatch(setPatientForChat(patient_id))
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PatientDetailsDrawer)
);
