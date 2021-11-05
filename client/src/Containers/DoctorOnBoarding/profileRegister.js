import { withRouter } from "react-router-dom";
import ProfileRegister from "../../Components/DoctorOnBoarding/profileRegister";
import { signOut } from "../../modules/auth";
import {
  callNewDoctorAction,
  doctorProfileRegister,
  getDoctorProfileRegisterData,
  getDoctorQualificationRegisterData,
  sendPasswordMail,
} from "../../modules/onBoarding";
import { connect } from "react-redux";
import { searchDoctorEmail } from "../../modules/doctors";

import { getDoctorDetails } from "../../modules/doctors";

const mapStateToProps = (state) => {
  const { auth, users, onBoarding, doctors, emails = {} } = state;

  const { authenticated_user, authenticated_category } = auth;

  return {
    authenticated_user,
    authenticated_category,
    users,
    doctors,
    onBoarding,
    emails,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(signOut()),
    doctorProfileRegister: (data) => dispatch(doctorProfileRegister(data)),
    getDoctorProfileRegisterData: (userId) =>
      dispatch(getDoctorProfileRegisterData(userId)),
    getDoctorQualificationRegisterData: () =>
      dispatch(getDoctorQualificationRegisterData()),
    sendPasswordMail: (data) => dispatch(sendPasswordMail(data)),
    callNewDoctorAction: (doctor_id) =>
      dispatch(callNewDoctorAction(doctor_id)),
    getDoctorDetails: (id) => dispatch(getDoctorDetails(id)),
    searchDoctorEmail: (email) => dispatch(searchDoctorEmail(email)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ProfileRegister)
);
