import { connect } from "react-redux";
import ProviderDoctorPage from "../../../Components/Pages/providerDashboard";
import { withRouter } from "react-router-dom";
// import {open} from "../../../modules/drawer";
// import {DRAWER} from "../../../constant";

const mapStateToProps = state => {
  const {
    auth: { authPermissions = [], authenticated_user = 1 ,authenticated_category} = {},
    users ={},
    doctors = {},
    providers={}
} = state;

  return {
  users,
  doctors,
  providers,
  authPermissions,
  authenticated_user,
  authenticated_category};
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ProviderDoctorPage)
);
