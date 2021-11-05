import AuthRoute from "../../Routes/Auth";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../../modules/auth";
import { getUserRoles } from "../../modules/userRoles";

const mapStateToProps = (state) => {
  const { auth, users, doctors } = state;
  const { authenticated_user, authenticated_category, hasConsent } = auth;

  return {
    authenticated_user,
    users,
    doctors,
    authenticated_category,
    hasConsent,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logOut: () => dispatch(signOut()),
    getUserRoles: () => dispatch(getUserRoles()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AuthRoute)
);
