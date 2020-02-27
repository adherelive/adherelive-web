import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PatientDetailsDrawer from "../../Components/Drawer/PatientDetails";

const mapStateToProps = state => {
  const { patients, doctors, providers, treatments } = state;
  return { patients, doctors, providers, treatments };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PatientDetailsDrawer)
);
