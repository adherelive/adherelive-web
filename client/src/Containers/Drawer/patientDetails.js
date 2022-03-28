import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PatientDetailsDrawer from "../../Components/Drawer/PatientDetails";
import { DRAWER } from "../../constant";
import { close } from "../../modules/drawer";
import { getMedications } from "../../modules/medications";
import { getPatientDetailsById } from "../../modules/patients";
import { setPatientForChat, setCareplanForChat } from "../../modules/twilio";
import { openPopUp } from "../../modules/chat";
import {
  getAppointments,
  getAppointmentsDetails,
} from "../../modules/appointments";
import { getPatientMissedEvents } from "../../modules/patients";

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
    chats,
    auth,
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
    chats,
    auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    close: () => dispatch(close()),
    getMedications: (id) => dispatch(getMedications(id)),
    setPatientForChat: (patient_id) => dispatch(setPatientForChat(patient_id)),
    getPatientDetailsById: (patientId) =>
      dispatch(getPatientDetailsById(patientId)),
    setCareplanForChat: (care_plan_id) =>
      dispatch(setCareplanForChat(care_plan_id)),
    openPopUp: () => dispatch(openPopUp()),
    getAppointments: (id) => dispatch(getAppointments(id)),
    getAppointmentsDetails: () => dispatch(getAppointmentsDetails()),
    getPatientMissedEvents: (patient_id) =>
      dispatch(getPatientMissedEvents(patient_id)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PatientDetailsDrawer)
);
