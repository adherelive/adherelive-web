import { connect } from "react-redux";
import AdminDoctorDetails from "../../../Components/Pages/adminDoctorDetails";
import { withRouter } from "react-router-dom";
import { getDoctorDetails, verifyDoctor } from "../../../modules/doctors";
// import {verifyDoctor} from "../../../modules/doctors";
// import {open} from "../../../modules/drawer";
// import {DRAWER} from "../../../constant";

const mapStateToProps = state => {
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
  };
};

const mapDispatchToProps = dispatch => {
  return {
    verifyDoctor: id => dispatch(verifyDoctor(id)),
    getDoctorDetails: id => () => dispatch(getDoctorDetails(id))
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
  } = stateProps;
  const { getDoctorDetails, verifyDoctor } = dispatchProps;
  const { id } = ownProps;

  const getDoctorAllDetails = getDoctorDetails(id);

  return {
    users,
    doctors,
    qualification_ids,
    clinic_ids,
    doctor_ids,
    id,
    verifyDoctor,
    doctor_clinics,
    doctor_qualifications,
    upload_documents,
    doctor_registrations,
    degrees,
    colleges,
    councils,
    getDoctorDetails: getDoctorAllDetails
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergePropsToState
  )(AdminDoctorDetails)
);
