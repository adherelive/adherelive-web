import { connect } from "react-redux";
import Routes from "../../Routes";
import {getInitialData} from "../../modules/auth";

const mapStateToProps = state => {
    const {auth} = state;
    const {authenticated, authRedirection} = auth;
    console.log("containers ===== ", authenticated, authRedirection);
    return {authenticated, authRedirection};
};

const mapDispatchToProps = dispatch => {
  return {
      getInitialData: () => dispatch(getInitialData())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Routes);
