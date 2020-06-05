import AuthRoute from "../../Routes/Auth";
import { connect } from "react-redux";
import {signOut} from "../../modules/auth";


const mapStateToProps = state => {
    const { auth, users } = state;

    return {
        // user_data: getUser(users, auth.authenticated_user)
    };
};

const mapDispatchToProps = dispatch => {
  return {
      logOut: () => dispatch(signOut()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthRoute);
