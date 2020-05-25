import { withRouter } from "react-router-dom";
import Dashboard from "../../Components/Dashboard";
import {signOut} from "../../modules/auth";

const mapStateToProps = state => {
  const { graphs } = state;
  return { graphs };
};

const mapDispatchToProps = dispatch => {
    return {
	signOut: () => dispatch(signOut()) 
    };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Dashboard)
);
