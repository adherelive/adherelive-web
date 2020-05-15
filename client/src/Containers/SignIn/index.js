import SignIn from "../../Components/SignIn";
import {googleSignIn, facebookSignIn} from "../../modules/auth";
import { connect } from "react-redux";

const mapStateToProps = state => {
    const { auth, users } = state;
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
	googleSignIn: (data) => dispatch(googleSignIn(data)),
	facebookSignIn: (data) => dispatch(facebookSignIn(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
