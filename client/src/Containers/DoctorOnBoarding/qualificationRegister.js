import {withRouter} from "react-router-dom";
import QualificationRegister from "../../Components/DoctorOnBoarding/qualificationRegister";
import {signOut} from "../../modules/auth";
import {doctorQualificationRegister} from "../../modules/onBoarding";
import {connect} from "react-redux";

const mapStateToProps = state => {
    const {graphs} = state;
    return {graphs};
};

const mapDispatchToProps = dispatch => {
    return {
        signOut: () => dispatch(signOut()),
        doctorQualificationRegister: (data) => dispatch(doctorQualificationRegister(data))
    };
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(QualificationRegister)
);
