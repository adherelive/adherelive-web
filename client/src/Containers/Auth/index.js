import AuthRoute from "../../Routes/Auth";
import {withRouter} from "react-router-dom";
import { connect } from "react-redux";
import {signOut} from "../../modules/auth";


const mapStateToProps = state => {
    const { auth, users } = state;
        console.log('AUTH IN AUTH CONTAINERRR',auth,users);
        const{authenticated_user}=auth
    return {
        authenticated_user,users
    };
};

const mapDispatchToProps = dispatch => {
  return {
      logOut: () => dispatch(signOut()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AuthRoute));
