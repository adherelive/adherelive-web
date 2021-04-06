import { connect } from "react-redux";
import SideBar from "../../Components/Sidebar";
import { switchUserRole } from "../../modules/userRoles";

const mapStateToProps = (state) => {
  const { auth, users, doctors, user_roles, pages: {user_role_ids = []} = {}, providers } = state;
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
    user_roles,
    user_role_ids,
    providers,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    switchUserRole: (data) => dispatch(switchUserRole(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
