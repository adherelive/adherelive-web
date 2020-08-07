import AuthRoute from "../../Routes/Auth";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../../modules/auth";

const mapStateToProps = (state) => {
  const { auth, users ,doctors} = state;
  console.log("AUTH IN AUTH CONTAINERRR", auth, users);
  const { authenticated_user, authenticated_category } = auth;

  console.log("AUTH IN AUTH CONTAINERRR111111", authenticated_category, authenticated_user);
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
