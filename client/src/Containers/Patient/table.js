import { connect } from "react-redux";
import PatientTable from "../../Components/Patient/table";
import { withRouter } from "react-router-dom";
import {open} from "../../modules/drawer";
import {DRAWER} from "../../constant";

const mapStateToProps = state => {
  const {
    patients = {},
    doctors = {},
    providers = {},
    treatments = {},
    pages: { patient_ids = [], chat_ids = [] } = {},
    chats = {},
    users,
    care_plans
  } = state;

  return {
    patient_ids,
    chat_ids,
    patients,
    doctors,
    providers,
    treatments,
    chats,
    users,
    care_plans
  };
};

const mapDispatchToProps = dispatch => {
  return {
    openPatientDetailsDrawer: (payload) => dispatch(open({type: DRAWER.PATIENT_DETAILS, payload}))
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PatientTable)
);
