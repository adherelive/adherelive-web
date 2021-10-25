import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ProviderDoctorDetails from "../../../Components/Pages/providerDoctorDetails";

const mapStateToProps = (state) => {
  const { doctors, auth, users } = state;

  return { doctors, auth, users };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ProviderDoctorDetails)
);
