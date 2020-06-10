import {withRouter} from "react-router-dom";
import ClinicRegister from "../../Components/DoctorOnBoarding/clinicRegister";
import {signOut} from "../../modules/auth";
import {doctorClinicRegister} from "../../modules/onBoarding";
import {connect} from "react-redux";

const mapStateToProps = state => {
    const {graphs} = state;
    return {graphs};
};

const mapDispatchToProps = dispatch => {
    return {
        signOut: () => dispatch(signOut()),
        doctorClinicRegister: (data) => dispatch(doctorClinicRegister(data))
    };
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(ClinicRegister)
);
