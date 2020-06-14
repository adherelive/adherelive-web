import {withRouter} from "react-router-dom";
import QualificationRegister from "../../Components/DoctorOnBoarding/qualificationRegister";
import {signOut} from "../../modules/auth";
import {doctorQualificationRegister,getDoctorQualificationRegisterData,registerQualification,deleteDoctorQualificationImage} from "../../modules/onBoarding";
import {connect} from "react-redux";

const mapStateToProps = state => {
    const {auth,users,onBoarding} = state;
    let{authenticated_user={}}=auth;
    return {authenticated_user,users,onBoarding};
};

const mapDispatchToProps = dispatch => {
    return {
        signOut: () => dispatch(signOut()),
        doctorQualificationRegister: (data,userId) => dispatch(doctorQualificationRegister(data,userId)),
        getDoctorQualificationRegisterData: (userId) => dispatch(getDoctorQualificationRegisterData(userId)),
        registerQualification: (data,userId) => dispatch(registerQualification(data,userId)),
        deleteDoctorQualificationImage: (qualificationId,document) => dispatch(deleteDoctorQualificationImage(qualificationId,document))
    };
};
export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(QualificationRegister)
);
