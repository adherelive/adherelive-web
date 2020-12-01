import { withRouter } from "react-router-dom";
import ProfileRegister from "../../Components/DoctorOnBoarding/profileRegister";
import { signOut } from "../../modules/auth";
import { doctorProfileRegister, getDoctorProfileRegisterData, getDoctorQualificationRegisterData,sendPasswordMail } from "../../modules/onBoarding";
import { connect } from "react-redux";

const mapStateToProps = state => {
    const { auth, users, onBoarding, doctors } = state;
  const { authenticated_user, authenticated_category } = auth;
    return { authenticated_user,authenticated_category, users, doctors, onBoarding };
};

const mapDispatchToProps = dispatch => {
    return {
        signOut: () => dispatch(signOut()),
        doctorProfileRegister: (data) => dispatch(doctorProfileRegister(data)),
        getDoctorProfileRegisterData: (userId) => dispatch(getDoctorProfileRegisterData(userId)),
        getDoctorQualificationRegisterData: () => dispatch(getDoctorQualificationRegisterData()),
        sendPasswordMail : (data) => dispatch(sendPasswordMail(data))
    };
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(ProfileRegister)
);
