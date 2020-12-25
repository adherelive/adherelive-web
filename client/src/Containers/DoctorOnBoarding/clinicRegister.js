import {withRouter} from "react-router-dom";
import ClinicRegister from "../../Components/DoctorOnBoarding/clinicRegister";
import {signOut} from "../../modules/auth";
import {doctorClinicRegister} from "../../modules/onBoarding";
import {connect} from "react-redux";
import {showVerifyModal} from "../../modules/pages/features";

const mapStateToProps = state => {
    const {auth,users} = state;
    let{authenticated_user={}}=auth;
    return {authenticated_user,users};
};

const mapDispatchToProps = dispatch => {
    return {
        signOut: () => dispatch(signOut()),
        doctorClinicRegister: (data) => dispatch(doctorClinicRegister(data)),
        showVerifyModal: (data) => dispatch(showVerifyModal(data)),
    };
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(ClinicRegister)
);
