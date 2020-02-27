import { connect } from "react-redux";
import PatientTable from "../../Components/Patient/table";
import { withRouter } from "react-router-dom";

const mapStateToProps = state => {
  const {
    patients = {},
    doctors = {},
    providers = {},
    treatments = {},
    pages: { patient_ids = [], chat_ids = [] } = {},
    chats = {}
  } = state;

  return {
    patient_ids,
    chat_ids,
    patients,
    doctors,
    providers,
    treatments,
    chats
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PatientTable)
);
