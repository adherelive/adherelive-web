import {withRouter} from "react-router-dom";
import SignIn from "../../Components/SignIn";
import {signOut, signIn,signUp} from "../../modules/auth";
import {connect} from "react-redux";

const mapStateToProps = state => {
    const {graphs} = state;
    return {graphs};
};

const mapDispatchToProps = dispatch => {
    return {
        signIn: data => dispatch(signIn(data)),
        signUp: data => dispatch(signUp(data)),
        signOut: () => dispatch(signOut()),
    };
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(SignIn)
);
