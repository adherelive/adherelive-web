import { connect } from "react-redux";
import PatientTable from "../../Components/Patient/table";
import { withRouter } from "react-router-dom";

const mapStateToProps = state => {
  const {} = state;
  return {};
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PatientTable)
);
