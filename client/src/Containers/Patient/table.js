import { connect } from "react-redux";
import PatientTable from "../../Components/Patient/table";
import { withRouter } from "react-router-dom";

const mapStateToProps = state => {
  const {
    patients = {},
    doctors = {},
    providers = {},
    treatments = {},
    pages: { patient_ids = [] } = {}
  } = state;

  console.log("92837 --> ", patients, patient_ids);
  return {
    patient_ids,
    patients,
    doctors,
    providers,
    treatments
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PatientTable)
);
