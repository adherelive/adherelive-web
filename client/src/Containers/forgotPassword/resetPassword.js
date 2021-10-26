import { withRouter } from "react-router-dom";
import ResetPassword from "../../Components/forgotPassword/resetPassword";
import { resetPassword, verifyForgotPasswordLink } from "../../modules/auth";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  const {} = state;
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    resetPassword: (payload) => dispatch(resetPassword(payload)),
    verifyForgotPasswordLink: (link) =>
      dispatch(verifyForgotPasswordLink(link)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ResetPassword)
);
