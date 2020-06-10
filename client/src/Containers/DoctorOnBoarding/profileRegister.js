import {withRouter} from "react-router-dom";
import ProfileRegister from "../../Components/DoctorOnBoarding/profileRegister";
import {signOut} from "../../modules/auth";
import {doctorProfileRegister} from "../../modules/onBoarding";
import {connect} from "react-redux";

const mapStateToProps = state => {
    const {graphs} = state;
    return {graphs};
};

const mapDispatchToProps = dispatch => {
    return {
        signOut: () => dispatch(signOut()),
        doctorProfileRegister: (data) => dispatch(doctorProfileRegister(data))
    };
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(ProfileRegister)
);
