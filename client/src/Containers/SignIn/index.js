import { withRouter } from "react-router-dom";
import SignIn from "../../Components/SignIn";
import {
  signOut,
  signIn,
  signUp,
  verifyUser,
  getInitialData,
} from "../../modules/auth";
import { connect } from "react-redux";
import { getUserRoles } from "../../modules/userRoles";

const mapStateToProps = (state) => {
  const { graphs, auth } = state;
  return { graphs, auth };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signIn: (data) => dispatch(signIn(data)),
    signUp: (data) => dispatch(signUp(data)),
    verifyUser: (link) => dispatch(verifyUser(link)),
    signOut: () => dispatch(signOut()),
    getInitialData: () => dispatch(getInitialData()),
    getUserRoles: () => dispatch(getUserRoles),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignIn));
