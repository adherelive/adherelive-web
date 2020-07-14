import { withRouter } from "react-router-dom";
import QualificationRegister from "../../Components/DoctorOnBoarding/qualificationRegister";
import { signOut } from "../../modules/auth";
import { doctorQualificationRegister, getDoctorQualificationRegisterData, registerQualification, deleteDoctorQualificationImage, deleteDoctorRegistrationImage, registerRegistration } from "../../modules/onBoarding";
import { connect } from "react-redux";

const mapStateToProps = state => {
    const { auth, users, doctors, onBoarding, upload_documents, doctor_qualifications, doctor_registrations } = state;
    let { authenticated_user = {} } = auth;
    return { authenticated_user, doctors, users, onBoarding, upload_documents, doctor_qualifications, doctor_registrations };
};

const mapDispatchToProps = dispatch => {
    return {
        signOut: () => dispatch(signOut()),
        doctorQualificationRegister: (data) => dispatch(doctorQualificationRegister(data)),
        getDoctorQualificationRegisterData: () => dispatch(getDoctorQualificationRegisterData()),
        registerQualification: (data) => dispatch(registerQualification(data)),
        registerRegistration: (data) => dispatch(registerRegistration(data)),
        deleteDoctorQualificationImage: (qualificationId, document) => dispatch(deleteDoctorQualificationImage(qualificationId, document)),
        deleteDoctorRegistrationImage: (registrationId, document) => dispatch(deleteDoctorRegistrationImage(registrationId, document))
    };
};
export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(QualificationRegister)
);
