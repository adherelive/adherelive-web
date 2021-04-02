import { connect } from "react-redux";
import SideBar from "../../Components/Sidebar";

const mapStateToProps = (state) => {
  const { auth, users, doctors } = state;
  const {
    authenticated,
    authenticated_user,
    authRedirection,
    authPermissions = [],
    doctor_provider_id = null,
  } = auth;

  return {
    authenticated,
    authPermissions,
    authRedirection,
    authenticated_user,
    users,
    doctors,
    doctor_provider_id,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
