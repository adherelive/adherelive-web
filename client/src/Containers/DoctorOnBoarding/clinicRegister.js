import { withRouter } from "react-router-dom";
import ClinicRegister from "../../Components/DoctorOnBoarding/clinicRegister";
import { signOut } from "../../modules/auth";
import {
  doctorClinicRegister,
  callNewDoctorAction,
} from "../../modules/onBoarding";
import { connect } from "react-redux";
import { showVerifyModal } from "../../modules/pages/features";
import {
  getDoctorDetails,
  getDoctorProfileDetails,
} from "../../modules/doctors";

const mapStateToProps = (state) => {
  const { auth, users, doctors, onBoarding, doctor_clinics } = state;
  const { authenticated_user, authenticated_category } = auth;
  return {
    authenticated_user,
    users,
    authenticated_category,
    doctors,
    onBoarding,
    doctor_clinics,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(signOut()),
    doctorClinicRegister: (data) => dispatch(doctorClinicRegister(data)),
    showVerifyModal: (data) => dispatch(showVerifyModal(data)),
    callNewDoctorAction: (doctor_id) =>
      dispatch(callNewDoctorAction(doctor_id)),
    getDoctorDetails: (id) => dispatch(getDoctorDetails(id)),
    getDoctorProfileDetails: (id) => dispatch(getDoctorProfileDetails(id)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ClinicRegister)
);
