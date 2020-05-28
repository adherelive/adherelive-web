import SignIn from "../../Components/SignIn";
import {googleSignIn, facebookSignIn, getInitialData, signIn} from "../../modules/auth";
import {connect} from "react-redux";

const mapStateToProps = state => {
    const {auth, users} = state;
    return {};
};

const mapDispatchToProps = dispatch => {
    return {
        signIn: (data) => dispatch(signIn(data)),
        googleSignIn: (data) => dispatch(googleSignIn(data)),
        facebookSignIn: (data) => dispatch(facebookSignIn(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
