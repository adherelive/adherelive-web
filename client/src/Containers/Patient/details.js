import PatientDetails from "../../Components/Patient/details";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PatientDetails)
);
