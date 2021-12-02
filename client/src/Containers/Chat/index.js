import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Chat from "../../Components/Chat";

const mapStateToProps = (state) => {
  const {} = state;
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Chat));
