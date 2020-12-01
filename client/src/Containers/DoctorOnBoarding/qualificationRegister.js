import { withRouter } from "react-router-dom";
import QualificationRegister from "../../Components/DoctorOnBoarding/qualificationRegister";
import { signOut } from "../../modules/auth";
import {
  doctorQualificationRegister,
  getDoctorQualificationRegisterData,
  registerQualification,
  deleteDoctorQualificationImage,
  deleteDoctorRegistrationImage,
  registerRegistration
} from "../../modules/onBoarding";
import { connect } from "react-redux";
import { searchCollege } from "../../modules/colleges";
import { searchCouncil } from "../../modules/councils";
import { searchDegree } from "../../modules/degrees";
import {searchSpecialties} from "../../modules/specialities";

const mapStateToProps = state => {
  const {
    auth,
    users,
    doctors,
    onBoarding,
    upload_documents,
    doctor_qualifications,
    doctor_registrations,
    colleges,
    degrees,
    councils,
    specialities
  } = state;
  const { authenticated_user, authenticated_category } = auth;
  return {
    authenticated_user,
    doctors,
    users,
    onBoarding,
    upload_documents,
    doctor_qualifications,
    doctor_registrations,
    colleges,
    degrees,
    councils,
    specialities,
    authenticated_category
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signOut: () => dispatch(signOut()),
    searchCollege: data => dispatch(searchCollege(data)),
    searchCouncil: data => dispatch(searchCouncil(data)),
    searchDegree: data => dispatch(searchDegree(data)),
    doctorQualificationRegister: data =>
      dispatch(doctorQualificationRegister(data)),
    getDoctorQualificationRegisterData: () =>
      dispatch(getDoctorQualificationRegisterData()),
    registerQualification: data => dispatch(registerQualification(data)),
    registerRegistration: data => dispatch(registerRegistration(data)),
    deleteDoctorQualificationImage: (qualificationId, document) =>
      dispatch(deleteDoctorQualificationImage(qualificationId, document)),
    deleteDoctorRegistrationImage: (registrationId, document) =>
      dispatch(deleteDoctorRegistrationImage(registrationId, document)),
      searchSpecialities: (data) => dispatch(searchSpecialties(data)),
  };
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(QualificationRegister)
);
