import AuthRoute from "../../Routes/Auth";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../../modules/auth";

const mapStateToProps = (state) => {
  const { auth, users ,doctors} = state;
  const { authenticated_user, authenticated_category } = auth;

  return {
    authenticated_user,
    users,
    doctors,
    authenticated_category,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logOut: () => dispatch(signOut()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AuthRoute)
);
