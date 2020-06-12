import {withRouter} from "react-router-dom";
import QualificationRegister from "../../Components/DoctorOnBoarding/qualificationRegister";
import {signOut} from "../../modules/auth";
import {doctorQualificationRegister,getDoctorQualificationRegisterData} from "../../modules/onBoarding";
import {connect} from "react-redux";

const mapStateToProps = state => {
    const {auth,users,onBoarding} = state;
    let{authenticated_user={}}=auth;
    return {authenticated_user,users,onBoarding};
};

const mapDispatchToProps = dispatch => {
    return {
        signOut: () => dispatch(signOut()),
        doctorQualificationRegister: (data) => dispatch(doctorQualificationRegister(data)),
        getDoctorQualificationRegisterData: (userId) => dispatch(getDoctorQualificationRegisterData(userId))
    };
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(QualificationRegister)
);
