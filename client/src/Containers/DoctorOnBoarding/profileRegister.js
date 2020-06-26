import {withRouter} from "react-router-dom";
import ProfileRegister from "../../Components/DoctorOnBoarding/profileRegister";
import {signOut} from "../../modules/auth";
import {doctorProfileRegister,getDoctorProfileRegisterData} from "../../modules/onBoarding";
import {connect} from "react-redux";

const mapStateToProps = state => {
    const {auth,users,onBoarding} = state;
    let{authenticated_user={}}=auth;
    return {authenticated_user,users,onBoarding};
};

const mapDispatchToProps = dispatch => {
    return {
        signOut: () => dispatch(signOut()),
        doctorProfileRegister: (data) => dispatch(doctorProfileRegister(data)),
        getDoctorProfileRegisterData: (userId) => dispatch(getDoctorProfileRegisterData(userId))
    };
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(ProfileRegister)
);
