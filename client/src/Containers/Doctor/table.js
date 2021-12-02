import { connect } from "react-redux";
import DoctorTable from "../../Components/Doctor/table";
import { withRouter } from "react-router-dom";
import { getAllDoctors, getAllDoctorsForProvider } from "../../modules/doctors";
import { USER_CATEGORY } from "../../constant";

const mapStateToProps = (state) => {
  const {
    doctors = {},
    users = {},
    pages: { doctor_ids = [], user_ids = [] } = {},
    specialities = {},
    auth = {},
  } = state;

  return {
    doctors,
    users,
    specialities,
    doctor_ids,
    user_ids,
    auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllDoctors: () => dispatch(getAllDoctors()),
    getAllDoctorsForProvider: () => dispatch(getAllDoctorsForProvider()),
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { doctors, users, specialities, doctor_ids, user_ids, auth } =
    stateProps;

  const { getAllDoctors, getAllDoctorsForProvider } = dispatchProps;

  const { authenticated_category } = auth || {};

  return {
    doctors,
    users,
    specialities,
    doctor_ids,
    user_ids,
    auth,
    getAllDoctors:
      authenticated_category === USER_CATEGORY.PROVIDER
        ? getAllDoctorsForProvider
        : getAllDoctors,
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(DoctorTable)
);
