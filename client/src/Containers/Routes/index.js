import { connect } from "react-redux";
import Routes from "../../Routes";
import {getInitialData} from "../../modules/auth";

const mapStateToProps = state => {
    const {auth,users,doctors} = state;
    const {authenticated,authenticated_user, authRedirection} = auth;
    console.log("containers ===== ", authenticated, authRedirection);
    return {authenticated, authRedirection,authenticated_user,users,doctors};
};

const mapDispatchToProps = dispatch => {
  return {
      getInitialData: () => dispatch(getInitialData())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Routes);
