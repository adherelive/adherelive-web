import { withRouter } from "react-router-dom";
import ForgotPassword from "../../Components/forgotPassword";
import { forgotPassword } from "../../modules/auth";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  const {} = state;
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    forgotPassword: (payload) => dispatch(forgotPassword(payload)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ForgotPassword)
);
