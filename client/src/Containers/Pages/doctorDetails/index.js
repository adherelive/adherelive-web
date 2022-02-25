import { connect } from "react-redux";
import AdminDoctorDetails from "../../../Components/Pages/adminDoctorDetails";
import { withRouter } from "react-router-dom";
import {
  getDoctorDetails,
  verifyDoctor,
  addRazorpayId,
  deactivateDoctor,
  activateDoctor,
} from "../../../modules/doctors";
import { getDoctorAccountDetails } from "../../../modules/accountDetails";
// import {verifyDoctor} from "../../../modules/doctors";
// import {open} from "../../../modules/drawer";
// import {DRAWER} from "../../../constant";

const mapStateToProps = (state) => {
  const {
    users = {},
    doctors = {},
    pages = {},
    doctor_clinics = {},
    doctor_qualifications = {},
    upload_documents = {},
    doctor_registrations = {},
    degrees = {},
    colleges = {},
    councils = {},
    specialities = {},
  } = state;
  const { qualification_ids = [], clinic_ids = [], doctor_ids = [] } = pages;
  return {
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
    verifyDoctor: (id) => dispatch(verifyDoctor(id)),
    getDoctorDetails: (id) => () => dispatch(getDoctorDetails(id)),
    addRazorpayId: (id, payload) => dispatch(addRazorpayId(id, payload)),
    getDoctorAccountDetails: (id) => () =>
      dispatch(getDoctorAccountDetails(id)),
    deactivateDoctor: (doctor_id) => dispatch(deactivateDoctor(doctor_id)),
    activateDoctor: (user_id) => dispatch(activateDoctor(user_id)),
  };
};
const mergePropsToState = (stateProps, dispatchProps, ownProps) => {
  const {
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
  const {
    getDoctorDetails,
    verifyDoctor,
    addRazorpayId,
    getDoctorAccountDetails,
    deactivateDoctor,
    activateDoctor,
  } = dispatchProps;
  const { id } = ownProps;

  const getDoctorAllDetails = getDoctorDetails(id);
  const getCurrentDoctorAccountDetails = getDoctorAccountDetails(id);

  return {
    users,
    doctors,
    qualification_ids,
    clinic_ids,
    doctor_ids,
    id,
    verifyDoctor,
    addRazorpayId,
    doctor_clinics,
    doctor_qualifications,
    upload_documents,
    doctor_registrations,
    degrees,
    colleges,
    councils,
    specialities,
    getDoctorDetails: getDoctorAllDetails,
    getDoctorAccountDetails: getCurrentDoctorAccountDetails,
    deactivateDoctor,
    activateDoctor,
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergePropsToState
  )(AdminDoctorDetails)
);
