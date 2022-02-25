import { withRouter } from "react-router-dom";
import QualificationRegister from "../../Components/DoctorOnBoarding/qualificationRegister";
import { signOut } from "../../modules/auth";
import {
  doctorQualificationRegister,
  getDoctorQualificationRegisterData,
  registerQualification,
  deleteDoctorQualificationImage,
  deleteDoctorRegistrationImage,
  registerRegistration,
  callNewDoctorAction,
} from "../../modules/onBoarding";
import { connect } from "react-redux";
import { searchCollege } from "../../modules/colleges";
import { searchCouncil } from "../../modules/councils";
import { searchDegree } from "../../modules/degrees";
import { searchSpecialties } from "../../modules/specialities";
import {
  getDoctorDetails,
  getDoctorProfileDetails,
} from "../../modules/doctors";

const mapStateToProps = (state) => {
  console.log("STATEEEEEEEEEEEEEEEEEEEEE =====>", state);
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
    specialities,
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
    authenticated_category,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(signOut()),
    searchCollege: (data) => dispatch(searchCollege(data)),
    searchCouncil: (data) => dispatch(searchCouncil(data)),
    searchDegree: (data) => dispatch(searchDegree(data)),
    doctorQualificationRegister: (data) =>
      dispatch(doctorQualificationRegister(data)),
    getDoctorQualificationRegisterData: (data) =>
      dispatch(getDoctorQualificationRegisterData(data)),
    registerQualification: (data) => dispatch(registerQualification(data)),
    registerRegistration: (data) => dispatch(registerRegistration(data)),
    deleteDoctorQualificationImage: (qualificationId, document) =>
      dispatch(deleteDoctorQualificationImage(qualificationId, document)),
    deleteDoctorRegistrationImage: (registrationId, document) =>
      dispatch(deleteDoctorRegistrationImage(registrationId, document)),
    searchSpecialities: (data) => dispatch(searchSpecialties(data)),
    callNewDoctorAction: (doctor_id) =>
      dispatch(callNewDoctorAction(doctor_id)),
    getDoctorProfileDetails: (id) => dispatch(getDoctorProfileDetails(id)),
  };
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(QualificationRegister)
);
