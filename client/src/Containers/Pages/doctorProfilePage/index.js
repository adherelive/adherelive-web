import { connect } from "react-redux";
import DoctorProfilePage from "../../../Components/Pages/doctorProfilePage";
import { withRouter } from "react-router-dom";
import {
  updateDoctor,
  getDoctorProfileDetails,
  verifyDoctor,
  deactivateDoctor,
  activateDoctor,
} from "../../../modules/doctors";
import { searchSpecialties } from "../../../modules/specialities";
import { searchCouncil } from "../../../modules/councils";
import {
  deleteDoctorQualificationImage,
  deleteDoctorRegistrationImage,
} from "../../../modules/onBoarding";
import { searchDegree } from "../../../modules/degrees";
import { searchCollege } from "../../../modules/colleges";

// import {open} from "../../../modules/drawer";
// import {DRAWER} from "../../../constant";

const mapStateToProps = (state) => {
  const {
    auth,
    users,
    doctors,
    qualification_ids,
    clinic_ids,
    doctor_ids,
    doctor_clinics,
    doctor_qualifications,
    upload_documents,
    doctor_registrations,
    degrees,
    colleges,
    councils,
    specialities,
  } = state;

  return {
    auth,
    users,
    doctors,
    qualification_ids,
    clinic_ids,
    doctor_ids,
    doctor_clinics,
    doctor_qualifications,
    upload_documents,
    doctor_registrations,
    degrees,
    colleges,
    councils,
    specialities,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getDoctorDetails: (id) => () => dispatch(getDoctorProfileDetails(id)),
    verifyDoctor: (id) => dispatch(verifyDoctor(id)),
    searchSpecialities: (data) => dispatch(searchSpecialties(data)),
    updateDoctorBasicInfo: (user_id, data) =>
      dispatch(updateDoctor(user_id, data)),
    searchDegree: (data) => dispatch(searchDegree(data)),
    searchCollege: (data) => dispatch(searchCollege(data)),
    searchCouncil: (data) => dispatch(searchCouncil(data)),
    deleteDoctorQualificationImage: (qualificationId, document) =>
      dispatch(deleteDoctorQualificationImage(qualificationId, document)),
    deleteDoctorRegistrationImage: (registrationId, document) =>
      dispatch(deleteDoctorRegistrationImage(registrationId, document)),
    deactivateDoctor: (doctor_id) => dispatch(deactivateDoctor(doctor_id)),
    activateDoctor: (user_id) => dispatch(activateDoctor(user_id)),
  };
};

const mergePropsToState = (stateProps, dispatchProps, ownProps) => {
  const {
    getDoctorDetails,
    searchSpecialities,
    updateDoctorBasicInfo,
    searchDegree,
    searchCollege,
    deleteDoctorQualificationImage,
    deleteDoctorRegistrationImage,
    searchCouncil,
    verifyDoctor,
    deactivateDoctor,
    activateDoctor,
  } = dispatchProps;

  const {
    auth,
    users,
    doctors,
    qualification_ids,
    clinic_ids,
    doctor_ids,
    doctor_clinics,
    doctor_qualifications,
    upload_documents,
    doctor_registrations,
    degrees,
    colleges,
    councils,
    specialities,
  } = stateProps;

  const { id } = ownProps;

  const getDoctorAllDetails = getDoctorDetails(id);

  return {
    id,
    auth,
    users,
    doctors,
    qualification_ids,
    clinic_ids,
    doctor_ids,
    doctor_clinics,
    doctor_qualifications,
    upload_documents,
    doctor_registrations,
    degrees,
    colleges,
    councils,
    specialities,
    verifyDoctor,
    getDoctorDetails: getDoctorAllDetails,
    searchSpecialities: searchSpecialities,
    updateDoctorBasicInfo: updateDoctorBasicInfo,
    searchDegree: searchDegree,
    searchCollege: searchCollege,
    deleteDoctorQualificationImage: deleteDoctorQualificationImage,
    deleteDoctorRegistrationImage: deleteDoctorRegistrationImage,
    searchCouncil: searchCouncil,
    deactivateDoctor,
    activateDoctor,
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergePropsToState
  )(DoctorProfilePage)
);
