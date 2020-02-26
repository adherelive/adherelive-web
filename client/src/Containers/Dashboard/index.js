import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Dashboard from "../../Components/Dashboard";

const mapStateToProps = state => {
  const { graphs } = state;
  return { graphs };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Dashboard)
);
