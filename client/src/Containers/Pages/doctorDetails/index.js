import { connect } from "react-redux";
import AdminDoctorDetails from "../../../Components/Pages/adminDoctorDetails";
import { withRouter } from "react-router-dom";
import { getDoctorDetails, verifyDoctor } from "../../../modules/doctors";
// import {verifyDoctor} from "../../../modules/doctors";
// import {open} from "../../../modules/drawer";
// import {DRAWER} from "../../../constant";

const mapStateToProps = state => {
  const { users = {}, doctors = {}, pages = {} } = state;
  const { qualification_ids = [], clinic_ids = [], doctor_ids = [] } = pages;
  return {
    users,
    doctors,
    qualification_ids,
    clinic_ids,
    doctor_ids
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
    doctor_ids
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
