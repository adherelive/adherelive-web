import { withRouter } from "react-router-dom";
import Dashboard from "../../Components/Dashboard";
import {getInitialData, signOut} from "../../modules/auth";
import {connect} from "react-redux";

const mapStateToProps = state => {
  const { graphs } = state;
  return { graphs };
};

const mapDispatchToProps = dispatch => {
    return {
	signOut: () => dispatch(signOut()),
        getInitialData: () => dispatch(getInitialData())
    };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Dashboard)
);
