import Routes from "../../Routes/index";
import { connect } from "react-redux";

const mapStateToProps = state => {
    const {auth} = state;
    const {authenticated, authRedirection} = auth;
    console.log("containers ===== ", authenticated, authRedirection);
    return {authenticated, authRedirection};
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Routes);
