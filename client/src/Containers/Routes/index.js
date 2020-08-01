import { connect } from "react-redux";
import Routes from "../../Routes";
import { getInitialData } from "../../modules/auth";

const mapStateToProps = state => {
  const { auth, users, doctors } = state;
  const { authenticated, authenticated_user, authRedirection, authPermissions = [] } = auth;
  return { authenticated, authPermissions, authRedirection, authenticated_user, users, doctors };
};

const mapDispatchToProps = dispatch => {
  return {
    getInitialData: () => dispatch(getInitialData())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Routes);
