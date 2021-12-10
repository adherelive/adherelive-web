import { connect } from "react-redux";
import ProviderDoctorCalender from "../../../Components/Pages/providerDoctorCalender";
import { withRouter } from "react-router-dom";
// import {open} from "../../../modules/drawer";
// import {DRAWER} from "../../../constant";
import {
  getCalenderDataCountForDay,
  getCalenderDataForDay,
  getDoctorsCalenderDataForDay,
} from "../../../modules/scheduleEvents";

const mapStateToProps = (state) => {
  const {
    users = {},
    doctors = {},
    patients = {},
    date_wise_appointments = {},
    appointments = {},
    auth = {},
  } = state;

  const { authenticated_category } = auth;

  return {
    users,
    doctors,
    patients,
    date_wise_appointments,
    appointments,
    authenticated_category,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCalenderDataCountForDay: (date) =>
      dispatch(getCalenderDataCountForDay(date)),
    getCalenderDataForDay: (date, type) =>
      dispatch(getCalenderDataForDay(date, type)),
    getDoctorsCalenderDataForDay: (date, type) =>
      dispatch(getDoctorsCalenderDataForDay(date, type)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ProviderDoctorCalender)
);
