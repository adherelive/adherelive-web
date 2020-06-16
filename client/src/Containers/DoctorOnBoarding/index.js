import {withRouter} from "react-router-dom";
import Register from "../../Components/Register";
import {signOut} from "../../modules/auth";
import {connect} from "react-redux";

const mapStateToProps = state => {
    const {graphs} = state;
    return {graphs};
};

const mapDispatchToProps = dispatch => {
    return {
        signOut: () => dispatch(signOut()),
    };
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Register)
);
