import { connect } from "react-redux";
import ProviderDoctorPage from "../../../Components/Pages/providerDashboard";
import { withRouter } from "react-router-dom";
import { getGraphs, updateGraphs } from "../../../modules/graphs";
import { getAllMissedScheduleEvents } from "../../../modules/scheduleEvents";
import { DRAWER } from "../../../constant";
import { open } from "../../../modules/drawer";

const mapStateToProps = (state) => {
  const {
    auth: {
      authPermissions = [],
      authenticated_user = 1,
      authenticated_category,
    } = {},
    pages: { dashboard = {} } = {},
    users = {},
    doctors = {},
    providers = {},
    graphs = {},
  } = state;

  return {
    graphs,
    users,
    doctors,
    providers,
    authPermissions,
    authenticated_user,
    authenticated_category,
    dashboard,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGraphs: () => dispatch(getGraphs()),
    updateGraphs: (data) => dispatch(updateGraphs(data)),
    getAllMissedScheduleEvents: () => dispatch(getAllMissedScheduleEvents()),
    openMissedMedicationDrawer: () =>
      dispatch(open({ type: DRAWER.MISSED_MEDICATION })),
    openMissedAppointmentDrawer: () =>
      dispatch(open({ type: DRAWER.MISSED_APPOINTMENT })),
    openMissedVitalDrawer: () => dispatch(open({ type: DRAWER.MISSED_VITAL })),
    openMissedDietDrawer: () => dispatch(open({ type: DRAWER.MISSED_DIET })),
    openMissedWorkoutDrawer: () =>
      dispatch(open({ type: DRAWER.MISSED_WORKOUT })),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ProviderDoctorPage)
);
