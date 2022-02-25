import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import SideBar from "../../Components/Sidebar";
import { switchUserRole } from "../../modules/userRoles";
import { authCategorySelector } from "../../modules/doctors/selectors";

const mapStateToProps = (state) => {
  const {
    auth,
    users,
    doctors,
    user_roles,
    pages: { user_role_ids = [] } = {},
    providers,
  } = state;
  const {
    authenticated,
    authenticated_user,
    authRedirection,
    authPermissions = [],
    doctor_provider_id = null,
    auth_role = null,
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
    auth_role,
    authDoctor: authCategorySelector(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    switchUserRole: (data) => dispatch(switchUserRole(data)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SideBar)
);
