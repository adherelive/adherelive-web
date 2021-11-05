import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
// import { resetUnauthorizedError } from "../../modules/auth";
import BlankState from "../../Components/BlankState";

const mapStateToProps = (state) => {
  const {} = state;
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(BlankState)
);
